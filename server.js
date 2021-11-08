const express = require('express')
const app = express()
const httpPort = 3000
const cors = require('cors')
const db = require("./database.js")
app.use(cors())
app.use(express.static('public'))
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.listen(httpPort, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", httpPort))
});

app.get('/', (req, res) => res.send('Hello World!'))

// endpoint for creating new user
app.post("/createuser", (req, res, next) => {
    let newUsername = req.body.username.toLowerCase()
    let newPassword = req.body.password
    let newEmail = req.body.email.toLowerCase()

    let sql = `INSERT INTO users_table (user_name, user_password, user_email) 
    VALUES ("${newUsername}", "${newPassword}", "${newEmail}");`

    let params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            if (err.message.includes("user_name")) {
                res.status(200).json({"createUserStatus": "Username: " + newUsername + " is already in use"});
                return;
            } else if (err.message.includes("user_email"))
                res.status(200).json({"createUserStatus": "Email-address: " + newEmail + " is already in use"});
            return;
        }
        res.json({
            "createUserStatus": "User: " + newUsername + " created",
        })
    });
});

// endpoint for login in user
app.post("/login", (req, res, next) => {
    let loginUsername = req.body.username.toLowerCase()
    let loginPassword = req.body.password

    let sql = `SELECT *
                FROM users_table
                WHERE user_name="${loginUsername}"
                AND user_password="${loginPassword}";`

    let params = []
    db.all(sql, params, (err, rows) => {
        if (rows[0] == null) {
            res.json({"userInfo": "userNotFound",})
        } else {
            res.json({"userInfo": rows[0],})
        }
    });
});

// endpoint for starting game
app.post("/startgame", (req, res, next) => {
    let quizId = req.body.quizId

    let sql = `SELECT * 
    FROM questions_table
    WHERE quiz_id="${quizId}";`

    let params = []
    db.all(sql, params, (err, rows) => {
        if (rows[0] == null) {
            res.json({"response:": "error error rows",})
        } else {
            res.json({"quizdata": rows})
        }
    });
});

// endpoint for submitting score after game

app.post("/endgame", (req, res, next) => {
    let quizId = req.body.quizId
    let userId = req.body.userId
    let userScore = req.body.userScore

    let sql = `SELECT *
                FROM highscores_table
                WHERE user_id="${userId}"
                AND quiz_id="${quizId}";`
    let params = []
    db.all(sql, params, (err, rows) => {
        if (rows[0] == null) {
            sql = `INSERT INTO highscores_table (user_id, quiz_id, user_score)
                   VALUES ("${userId}", "${quizId}", "${userScore}");`
            db.all(sql, params, (err, rows) => {

            });

        }

    });


});

// For testing purposes
app.post("/test", (req, res, next) => {
    let request = req.body
    res.send("username : " + req.body.username)


});