const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: 'lula', password:'123'}];

const isValid = (username, password)=>{ 
  return users.find(user => user.username === username && user.password === password);

}


const authenticatedUser = (username, password) => {
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put('/auth/review/:isbn', function(req, res) {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.session.username;
  
    let booksList = Object.values(books)
    const book = booksList.find(b => b.isbn == isbn)
    // If the ISBN doesn't exist in the books object, send an error message
    if (!book) {
      res.status(404).send('The book with ISBN ' + isbn + ' does not exist.');
      return;
    }
  
    // If the user already posted a review for this book, modify the existing review
    if (book.reviews[username]) {
      book.reviews[username] = review;
      //res.json('Your review has been updated for the book with ISBN ' + isbn + ':'+ `${book}`);
      res.json(`Your review has been updated for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);
  
      return;
    }
  
    // If the user didn't post a review for this book, add a new review
    book.reviews[username] = review;
    //res.send('Your review has been posted for the book with ISBN ' + isbn + ':'+ `${book}`);
    res.json(`Your review has been posted for the book ${book.title} by ${book.author} with ISBN ${isbn}: ==>${JSON.stringify(book)}`);
  
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
