// Imports
const bookApiService = require('../services/bookApiService')
const Book = require('../models/bookModel')
const UserBook=require('../models/userBookModel')

// Show search form
function showSearchForm(req, res) {
    res.render('search', {
        isLoggedIn: req.session.isLoggedIn,
    });
}

// Run a search against Open Library
async function handleSearch(req, res) {
    try {
        const query = req.query.q || req.query.query || req.body.query

        if (!query || query.trim() === '') {
            return res.render("search", { 
                isLoggedIn: req.session.isLoggedIn,
            });
        }

        // pagination settings
        const page = parseInt(req.query.page || '1', 10)
        const limitRaw = parseInt(req.query.limit || '12', 10)
        const validPageSizes = [12, 24, 36]
        const limit = validPageSizes.includes(limitRaw) ? limitRaw : 12

        // get all results from open library
        const allResults = await bookApiService.searchBooks(query)

        const totalResults = allResults.length
        const totalPages = Math.max(1, Math.ceil(totalResults / limit))

        const currentPage = Math.min(Math.max(page, 1), totalPages)
        const start = (currentPage - 1) * limit
        const paginatedResults = allResults.slice(start, start + limit)

        // pagination
        const hasPrev = currentPage > 1;
        const hasNext = currentPage < totalPages;
        const prevPage = hasPrev ? currentPage - 1 : null;
        const nextPage = hasNext ? currentPage + 1 : null;

        const pageSizes = validPageSizes.map((size) => ({
            value: size,
            isSelected: size === limit,
        }));

        return res.render("results", {
            results: paginatedResults,
            query,
            currentPage,
            totalPages,
            limit,
            pageSizes,
            hasPrev,
            hasNext,
            prevPage,
            nextPage,
            isLoggedIn: req.session.isLoggedIn,
        });
    } catch (err) {
        console.error(err);
        res.render("search", { 
            error: "Error searching for books",
        isLoggedIn: req.session.isLoggedIn
        });
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