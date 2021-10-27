const express = require('express')
const app = express()
const httpPort = 3000
const cors = require('cors')
const db = require("./database.js")
app.use(cors())
app.use(express.static('public'))
const  bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(httpPort, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",httpPort))
});

app.get('/', (req, res) => res.send('Hello World!'))

// DB only accepts numbers (bug)
app.post("/createuser", (req, res, next) => {
    let newUsername = req.body.username
    let newPassword = req.body.password
    let newEmail = req.body.email

    let sql = `INSERT INTO users_table (user_name, user_password, user_email) 
    VALUES (${newUsername}, ${newPassword}, ${newEmail});`

    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "message":"success",
            "quiz":rows
        })
    });
});

// For testing purposes
app.post("/test", (req, res, next) => {
    let request= req.body
    res.send("username : " + req.body.username)

});