// Imports
const bookApiService = require('../services/bookApiService')

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
        const userId = res.session.userId

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

        let existingBook = await bookApiService.findByApiId(api_source, api_id)
        let bookId

        if (!existingUserBook) {
            await UserBook.create(userId, bookId)
        }

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