const { Pool } = require('pg');
const _ = require('lodash')
const { logger } = require('../utils/logger');

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
const tableName = 'djp_contents'
const status = 'Live';
let userPrefLangCode = 'hi';
let userPrefLang = 'Hindi';
let langCodeMapping = {
    "hi": "Hindi",
    "en": "English",
    "te": "Telugu",
    "or": "Odia",
    "ta": "Tamil",
    "as": "Assamese",
    "pa": "Punjabi",
    "ml": "Malayalam"
}

const localContents = async (req, res) => {

    let finalResult = []

    userPrefLangCode =  !_.isUndefined(req.get('x-preferred-language')) ?  req.get('x-preferred-language') : userPrefLang;
    userPrefLang = langCodeMapping[userPrefLangCode];
    // If the request includes query String/ List
    const query =  req.body?.request?.query;
    if(query){
        let keywordArray = query;
        if(_.isObject(query)){
            keywordArray= _.uniq(_.flatten(_.values(query)))
            if(_.isString(keywordArray)){
                keywordArray = [keywordArray]
            }
        } else if(_.isString(query)){
            keywordArray = [query]
        }
        const queryString = prepareQuery(keywordArray)
        const values = keywordArray;
        try{
            const result = await pool.query(queryString, values);
            finalResult = _.concat(finalResult, result.rows)
            logger.info(`Number of contents retrieved through query: ${Object.values(finalResult).length}`);
        }catch(err){
            logger.error(`Error while fetching contents using query: ${err}`);
            throw ({
                "message": "Error while fetching contents using query"
            })
        }      
    }

    // If the request includes filters
    const filters = req.body?.request?.filters;
    if(filters){
        const queryString = findBasedOnFilters(filters)
        try{
            const result = await pool.query(queryString);
            finalResult = _.concat(finalResult, result.rows)
            logger.info(`Number of contents retrieved through filters: ${Object.values(finalResult).length}`);
        }catch(err){
            logger.error(`Error while fetching contents using filters: ${err}`);
            throw ({
                "message": "Error while fetching contents using filters"
            })
        }
    }

    // If the request does not include either a query or filters
    if(!query && !filters){
        const queryString = prepareQuery()
        try{
            const result = await pool.query(queryString);
            finalResult = _.concat(finalResult, result.rows)
            logger.info(`Number of contents retrieved through query & filters: ${Object.values(finalResult).length}`);
        }catch(err){
            logger.error(`Error while fetching contents without query & filters: ${err}`);
            throw ({
                "message": "Error while fetching contents without query & filters"
            })
        }
    }
    
    return _.uniqBy(finalResult, "identifier");

}

const findBasedOnFilters = (conditions, jsonbType = [], arrayType = []) => {
    const columns = Object.keys(conditions);
    const values = Object.values(conditions);

    const whereClause = columns
        .map((column, i) => {
            if (_.isString(values[i]) && _.includes(values[i], '%')) {
                return `${column} ILIKE $${i + 1}`;
            } else if (_.isArray(values[i]) && !_.isEmpty(jsonbType) && !_.isEqual(_.indexOf(jsonbType, column), -1)) {
                if (_.isString(values[i][0])) {
                    return `${column} ?| $${i + 1}`;
                }

                return `${column} @> $${i + 1}`;
            } else if (_.isObject(values[i]) && !_.isEmpty(jsonbType) && !_.isEqual(_.indexOf(jsonbType, column), -1)) {
                if (_.isString(values[i][0])) {
                    return `${column} ?| $${i + 1}`;
                }

                return `${column} @> $${i + 1}`;
            } else if (_.isArray(values[i]) && !_.isEmpty(arrayType) && !_.isEqual(_.indexOf(arrayType, column), -1)) {
                return `${column} && $${i + 1}`;
            } else if (_.isObject(values[i]) && _.isArray(values[i])) {
                return `${column} = ANY($${i + 1})`;
            } else {
                return `${column}=$${i + 1}`;
            }
        })
        .join(' AND ');

    const query = {
        text: `SELECT * FROM ${tableName} WHERE ${whereClause} AND status='${status}' ORDER BY
            CASE
                WHEN LOWER(language::text) = LOWER('${userPrefLang}') THEN 5
                WHEN LOWER(language::text) = LOWER('English') THEN 3
                ELSE 1
            END DESC;`,
        values: [...values],
    };
    
    return query;
};

const prepareQuery = (keywordArray) => {
    let query;
    if(!_.isUndefined(keywordArray)){
        query = `SELECT * FROM ${tableName}
            WHERE status = '${status}' AND (
                ${keywordArray.map((keyword, index) => {
                return `EXISTS (
                    SELECT 1
                    FROM regexp_split_to_table($${index + 1}, ' ') AS k
                    WHERE
                    identifier ILIKE '%%' || k || '%%' OR
                    name ILIKE '%%' || k || '%%' OR
                    thumbnail ILIKE '%%' || k || '%%'  OR
                    description ILIKE '%%' || k || '%%' OR
                    mimeType ILIKE '%%' || k || '%%' OR
                    url ILIKE '%%' || k || '%%'  OR
                    domain ILIKE '%%' || k || '%%'  OR
                    language::text ILIKE '%%' || k || '%%'  OR
                    curriculargoal ILIKE '%%' || k || '%%' OR
                    category ILIKE '%%' || k || '%%' OR
                    agegroup ILIKE '%%' || k || '%%' OR
                    sourceorg ILIKE '%%' || k || '%%' OR
                    learningoutcomes ILIKE '%%' || k || '%%' OR
                    array_to_string(audience, ' ') ILIKE '%%' || k || '%%' OR
                    array_to_string(keywords, ' ') ILIKE '%%' || k || '%%' OR
                    array_to_string(competencies, ' ') ILIKE '%%' || k || '%%'
                )`;
                }).join(' OR ')}
            )
            ORDER BY
                CASE
                    WHEN LOWER(language::text) = LOWER('${userPrefLang}') THEN 5
                    WHEN LOWER(language::text) = LOWER('English') THEN 3
                    ELSE 1
                END DESC;`;
    } else {
        query = `SELECT * FROM ${tableName} WHERE status='${status}' 
        ORDER BY
            CASE
                WHEN LOWER(language::text) = LOWER('${userPrefLang}') THEN 5
                WHEN LOWER(language::text) = LOWER('English') THEN 3
                ELSE 1
            END DESC;`
    }
    return query;
}


const health = async (req, res) => {
    let pgClient
    try {
        pgClient  = await pool.connect();
        logger.info(`Connected to the database successfully!`);
        return {
            "message":"true"
        }
    } catch (error) {
        logger.error(`'Error connecting to the database:', ${error.message}`);
        throw ({
            "message": "Error connecting to database"
        })
    } finally {
        // Always release the client back to the pool, even if an error occurred
        pgClient && pgClient.release();
    }
}


module.exports = { localContents, health }