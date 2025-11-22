const db = require ('../config/db')

// Create a saved book entry for user
async function create(userId, bookId) {
    const [result] = await db.query(
        // insters a new row into user_books
        `INSERT INTO user_books (user_id, book_id)
        VALUES (?,?)`,
        [userId, bookId]
    )

    return result.InsterId
}

// Get all saved books for a user (joined with book metadata)
async function getSavedBooksByUser(userId) {
    const [rows] = await db.query(
        // JOIN betwen user_books and book
        // Returns title, author, thumbnail
        // Orders by recent saves
        `SELECT
            user_books.id AS saved_id,
            user_books.favorited,
            books.id AS book_id,
            books.title,
            books.author,
            books.thumbnail_url
        FROM user_books
        JOIN books ON user_books.book_id = books.id
        WHERE user_books.user_id = ?
        ORDER BY user_books.created_at DESC`,
        [userId]
    )

    return rows
}

// Toggle the favorited status = updates favorited field
async function toggleFavorites(savedId, newValue) {
    await db.query(
        `UPDATE user_books
        SET favorited = ?
        WHERE id = ?`,
        [newValue, savedId]
    )
}

// Delete one saved book entry
async function remove(savedId) {
    await db.query(
        `DELETE FROM user_books
        WEHERE id = ?`,
        [savedId]
    )
}

module.exports = {
    create,
    getSavedBooksByUser,
    toggleFavorite,
    remove
}