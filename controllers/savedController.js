const UserBook = require('../models/userBookModel')

async function toggleFavoritesHandler(req, res) {
    try {
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

module.exports = {
    toggleFavoritesHandler
}