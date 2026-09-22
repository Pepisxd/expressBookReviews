const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Username and password are required."});
  }

  if (!isValid(username)) {
    return res.status(404).json({message: "User already exists!"});
  }

  users.push({"username": username, "password": password});
  return res.status(200).json({message: "User successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found for the given ISBN."});
  }

  return res.status(200).send(JSON.stringify(book, null, 4));
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = Object.keys(books)
    .filter((isbn) => books[isbn].author === author)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matchingBooks = Object.keys(books)
    .filter((isbn) => books[isbn].title === title)
    .reduce((result, isbn) => {
      result[isbn] = books[isbn];
      return result;
    }, {});

  return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({message: "Book not found for the given ISBN."});
  }

  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

const BASE_URL = "http://localhost:5000";

// Task 10: Get the book list available in the shop - Async/Await with Axios
async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

// Task 11: Get book details based on ISBN - Async/Await with Axios
async function getBookByISBN(isbn) {
  const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
  return response.data;
}

// Task 12: Get book details based on author - Promise callbacks with Axios
function getBookByAuthor(author) {
  return axios.get(`${BASE_URL}/author/${author}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

// Task 13: Get book details based on title - Promise callbacks with Axios
function getBookByTitle(title) {
  return axios.get(`${BASE_URL}/title/${title}`)
    .then((response) => response.data)
    .catch((error) => {
      throw error;
    });
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBookByAuthor = getBookByAuthor;
module.exports.getBookByTitle = getBookByTitle;
