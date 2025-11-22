// Imports
const bookApiService = require('../services/bookApiService')
const Book = require('../models/bookModel')
const UserBook=require('../models/userBookModel')

// Show search form
function showSearchForm(req, res) {
    res.render('search');
}

// Run a search against Open Library
async function handleSearch(req, res) {
    try {
        const query = req.body.query;

        if (!query || query.trim() === '') {
            return res.render('search', { error: 'Please enter a search term'});
        }

        const results = await bookApiService.searchBooks(query);
        return res.render('results', { results, query });
    } catch (err) {
        console.error(err);
        res.render('search', { error: 'Error searching for books' });
    }
}

// Save a selected book to books and user_books
async function saveBook(req, res) {
    try {
        const userId = req.session.userId

        if (!userId) {
            return res.redirect('/login')
        }

        const {
            api_source,
            api_id,
            title,
            author,
            thumbnail_url,
        } = req.body

        if (!api_source || !api_id || !title) {
            return res.status(400).send('Missing book data')
        }

        // check if book already exists in books table
        let existingBook = await Book.findByApiId(api_source, api_id)
        let bookId

        if (!existingBook) {
            // insert into books table if it doesn't exist
            bookId = await Book.createFromApiData({
                api_source,
                api_id,
                title,
                author,
                thumbnail_url
            })
        }   else {
            bookId = existingBook.id
        }

        // check if user already saved book
        const existingUserbook = await UserBook.findByUserAndBook(userId, bookId)

        if (!existingUserbook) {
            await UserBook.create(userId, bookId)
        }

        // redirect to saved books view
        return res.redirect('/books/saved')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error saving book')
    }
}

module.exports = {
    showSearchForm,
    handleSearch,
    saveBook
}