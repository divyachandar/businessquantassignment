const express = require("express");
const bodyParser = require('body-parser')
const mysql = require("mysql");
// Create a MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // MySQL username
  password: null, //MySQL password
  database: "businessquant",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});

// Create Express app
const app = express();
// Parsing middleware
// Parse application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: false })); // Remove 
app.use(express.urlencoded({extended: true})); // New
// Parse application/json
// app.use(bodyParser.json()); // Remove

// Middleware to parse JSON bodies
app.use(express.json());

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

// Routes

app.get('/AAPL', (req, res) => {
  const sql_query = `select * from sample_data_historic where ticker="AAPL"`;
  connection.query(sql_query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/AAPLREVENUEGP', (req, res) => {
  const sql_query = `select revenue,gp from sample_data_historic where ticker="AAPL"`;
  connection.query(sql_query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.get('/periodfiveyears', (req, res) => {
  const sql_query = `SELECT revenue,gp,
       STR_TO_DATE(date, '%m/%d/%Y') AS formatted_date
FROM sample_data_historic
WHERE ticker="AAPL" AND YEAR(STR_TO_DATE(date, '%m/%d/%Y')) >= YEAR(DATE_SUB(NOW(), INTERVAL 5 YEAR))`;
  connection.query(sql_query, (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

