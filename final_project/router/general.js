const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({message: 'Please provide a valid username and password'});
    }
  
    // Check if username already exists
    const userExists = users.find(user => user.username === username);
    if (userExists) {
      return res.status(409).json({message: 'Username already exists'});
    }
  
    // Add the new user to the users array
    users.push({username, password});
  
    // Return a success message
    return res.status(200).json({message: 'User registered successfully'});
  });

public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let booksList=Object.values(books)
  let result = booksList.find((book)=> book.isbn === req.params.isbn)
  return res.status(300).json({message: result});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let booksList=Object.values(books)
  let result = booksList.find((book)=> book.author === req.params.author.replaceAll("-", " "));
  return res.status(300).json({message: result});
 });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let booksList=Object.values(books)
  let result = booksList.find((book)=> book.title === req.params.title.replaceAll("-", " "));
  return res.status(300).json({message: result});
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let booksList=Object.values(books)
  let result = booksList.find((book)=> book.isbn === req.params.isbn)
  return res.status(300).json({message: result.reviews});
 });

module.exports.general = public_users;
