const { Pool } = require('pg');
const _ = require('lodash')

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});
const tableName = 'content'

const localContents = async (req, res) => {

    let finalResult = []

    if(req?.query){
        let keywordArray = req?.query;
        if(!_.isArray(req?.query)){
            keywordArray = [req?.query]
        }
        const queryString = prepareQuery(keywordArray)
        const values = keywordArray;
        try{
            const result = await pool.query(queryString, values);
            finalResult = _.concat(finalResult, result.rows)
            // return result.rows;
        }catch(err){
            console.error('Error:', err.message);
            throw ({
                "message": "Error"
            })
        }      
    }

    if(req?.filters){
        console.log("req?.filters ", req?.filters)
        const queryString = findBasedOnFilters(req?.filters)
        try{
            const result = await pool.query(queryString);
            finalResult = _.concat(finalResult, result.rows)
            // return result.rows;
        }catch(err){
            console.error('Error:', err.message);
            throw ({
                "message": "Error"
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
        text: `SELECT * FROM ${tableName} WHERE ${whereClause}`,
        values: [...values],
    };
    
    return query;
};

const prepareQuery = (keywordArray) => {
    const query = `
      SELECT * FROM ${tableName}
      WHERE
        ${keywordArray.map((keyword, index) => {
          return `EXISTS (
            SELECT 1
            FROM regexp_split_to_table($${index + 1}, ' ') AS k
            WHERE
            name ILIKE k || '%' OR
            thumbnail ILIKE k || '%'  OR
            description ILIKE k || '%' OR
            mimeType ILIKE k || '%'  OR
            url ILIKE k || '%'  OR
            domain ILIKE k || '%'  OR
            curricularGoal ILIKE k || '%'  OR
            category ILIKE k || '%'
          )`;
        }).join(' OR ')}
    `;

    return query;
}


const health = async (req, res) => {
    let pgClient
    try {
        pgClient  = await pool.connect();
        console.log('Connected to the database successfully!');
        return {
            "message":"true"
        }
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
        throw ({
            "message": "Error connecting to database"
        })
    } finally {
        // Always release the client back to the pool, even if an error occurred
        pgClient && pgClient.release();
    }
}


module.exports = { localContents, health }