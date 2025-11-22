// Show search form
function showSearchForm(req, res) {
    res.render('search');
}

// Run a search against Open Library
async function handleSearch(req, res) {
    try {
        const query = req.body.query;

        if (!query || query.trim()==='') {
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
     
}