const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});

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


module.exports = { health }