async function searchBooks (query) {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=50`;

    const response = await fetch(url);
    if (!response.ok)throw new Error("Error contacting Open Library");

    const data = await response.json();

    const results = (data.docs || []).map((doc) => {
        const author = doc.author_name && doc.author_name.length > 0 ? doc.author_name[0] : "";

        const thumbnail_url = doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : "/default-illustration.png";

        return {
            api_source: "openlibrary",
            api_id: doc.key,
            title: doc.title || "Untitled",
            author,
            thumbnail_url
        };
    });

    return results;
}

module.exports = {
    searchBooks
}