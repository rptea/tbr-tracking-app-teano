const UserBook = require('../models/userBookModel')

async function listSavedBooks(req, res) {
    try {
        const userId = req.session.userId

        if (!userId) {
            return res.redirect('/login')
        }

        const savedBooks = await UserBook.getSavedBooksByUser(userId)

        res.render('savedBooks', { 
            savedBooks, 
            isLoggedIn: req.session.isLogggedIn
        });
    } catch (err) {
        console.error(err)
        res.status(500).send('Error loading saved books')
    }
}

async function toggleFavorites(req, res) {
    try {
        const userId = req.session.userId
        if (!userId) {
            return res.redirect('/login')
        }

        const { savedId } = req.params
        const { favorited } = req.body

        const newValue = 
        favorited === 'true' ||
        favorited === '1' ||
        favorited === 1 ||
        favorited === true

        await UserBook.toggleFavorites(savedId, newValue)

        res.redirect('/books/saved')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error updating favorite')
    }
}

async function deleteSaved(req,res) {
    try {
        const userId = req.session.userId

        if (!userId) {
            return res.redirect('/login')
        }
    
        const { savedId } = req.params

        await UserBook.remove(savedId)

        res.redirect('/books/saved')
    } catch (err) {
        console.error(err)
        res.status(500).send('Error deleting saved book')
    }
}

module.exports = {
    listSavedBooks,
    toggleFavorites,
    deleteSaved
}