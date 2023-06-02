const express = require("express");
const app = express();

require("dotenv").config();
// const cors = require("cors");
const dotenv = require("dotenv");

var bodyParser = require("body-parser");
const multer = require("multer");

dotenv.config();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
const connection = require("./config/db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.post("/create", upload.single("bookImage"), (req, res) => {
  console.log(req.body);
  const bookTitle = req.body.bookTitle;
  const authorName = req.body.authorName;
  const isbn = req.body.isbn;

  // Check if req.file exists before accessing its properties
  const bookImage = req.file ? req.file.filename : null;

  try {
    connection.query(
      "INSERT INTO books_table (bookTitle, authorName, isbn, bookImage) VALUES (?, ?, ?, ?)",
      [bookTitle, authorName, isbn, bookImage],
      (err, rows) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
});
app.post("/create-table", (req, res) => {
  const createTablequery =`USE book_database;
  CREATE TABLE IF NOT EXISTS books_table (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bookTitle VARCHAR(255) NOT NULL,
  authorName VARCHAR(255) NOT NULL,
  isbn VARCHAR(255) NOT NULL,
  bookImage VARCHAR(4455) NOT NULL
);`
  connection.query(createTablequery,
    (err) => {
      if (err) {
        console.log("Error creating the table", err);
        res.status(500).send("Error creating the table");
      } else {
        console.log("Table created successfully");
        res.status(201).send("Table created successfully");
      }
    }
  );
});

app.get("/", (req, res) => {
  res.redirect("/create.html");
});
app.get("/data", (req, res) => {
  connection.query("select * from books_table", (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      res.locals.message = "Book Data submitted successfully";
      res.render("read", { rows: rows });
    }
  });
});

app.listen(process.env.PORT || 4000, (error) => {
  if (error) throw error;
  console.log(` server is working at http://localhost:${process.env.PORT}`);
});
