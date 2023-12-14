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

    if(req?.query){
        let keywordArray = req?.query;
        if(!_.isArray(req?.query)){
            keywordArray = [req?.query]
        }
        const queryString = prepareQuery(keywordArray)
        const values = keywordArray;
        try{
            const result = await pool.query(queryString, values);
            return result.rows;
        }catch(err){
            console.error('Error:', err.message);
            throw ({
                "message": "Error"
            })
        }      
    }
}

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