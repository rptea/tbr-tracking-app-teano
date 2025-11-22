// routes/bookRoutes.js
const router = require("express").Router();
const bookController = require("../controllers/bookController");
const checkAuth = require("../middleware/auth");

// show search form
router.get("/search", bookController.handleSearch);

// save selected book, requires login because it uses req.session.userId
router.post("/save", checkAuth, bookController.saveBook);

module.exports = router;