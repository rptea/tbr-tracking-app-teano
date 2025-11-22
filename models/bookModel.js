const db = require('../config/db');

// Find book in database use API source + API id
async function findByApiId(apiSource, apiId) {
    const [rows] = await db.query(
        `SELECT * FROM books WHERE api_source = ? AND api_id = ?`,
        [apiSource, apiId]
    );
    return rows[0]; // return first match or undefined
}

async function createFromApiData(bookData) {
    const { api_source, api_id, title, author, thumbnail_url } = bookData;

    const [result] = await db.query (
        `INSERT INTO books (api_source, api_id, title, author, thumbnail_url) 
        VALUES (?, ?, ?, ?, ?)`,
        [api_source, api_id, title, author, thumbnail_url]
    );

    return result.insertId;
}