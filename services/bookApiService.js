async function searchBooks (query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`

    const response = await fetch(url)
    const data = await response.json()

    return data.docs.map(book => ({
        api_source: 'openlibrary',
        api_id: book.key, // example: "/works/0A12345B"
        title: book.title || 'Unknown title',
        author: book.author_name ? book.author_name[0] : 'Unknown author',
        thumbnail_url: book.cover_i
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : `/images/default-book.png`
    }))
}

MediaSourceHandle.exports = {
    searchBooks
}