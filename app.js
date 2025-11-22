require("dotenv").config();
const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const connection = require("./config/connection");

// route files
const apiRoutes = require("./routes/apiRoutes");
const htmlRoutes = require("./routes/htmlRoutes");
const bookRoutes = require('./routes/bookRoutes'); // handles GET /books/search, POST /books/search, POST /books/save
const savedRoutes = require('./routes/savedRoutes'); // handles GET /books/saved, POST /books/saved/:savedId/favorite, POST /books/saved/:savedId/delete

const app = express();

const sessionStore = new MySQLStore({}, connection);
app.use(
  session({
    key: "session_cookie",
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

// routes
app.use("/api", apiRoutes);
app.use("/books", bookRoutes); // /books/search, /books/save, etc.
app.use("/books", savedRoutes); // /books/saved, /books/saved/:savedId/...
app.use("/", htmlRoutes);

module.exports = app;
