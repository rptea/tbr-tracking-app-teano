// imports
const router = require('express').Router()
const savedController = require('../controllers/savedController')

// list all saved books for logged in user
router.get('/saved', savedController.listSavedBooks)

// toggle favorite on a saved book
router.post('saved/:savedId/favorite', savedController.toggleFavorites)

// delete a saved book
router.post('saved/:savedId/delete', savedController.deleteSaved)

module.exports = router;