const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL_ACADEMIC,
});

async function test() {
    try {
        console.log('Testing connection to Academic DB...');
        const res = await pool.query('SELECT NOW()');
        console.log('SUCCESS:', res.rows[0]);
    } catch (e) {
        console.error('FAILED TO CONNECT:', e.message);
    } finally {
        await pool.end();
    }
}

test();
