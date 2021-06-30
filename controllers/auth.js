const authRouter = require("express").Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const { JsonWebTokenError } = require("jsonwebtoken");


// REGISTRATION
authRouter.post("/register", async(req, res) => {
    try {
        // Step One - destruct req.body (name, email, password)
        const { name, email, password } = req.body;
        console.log(req.body);
        // Step Two - check if user exists (then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).send("Email is already in use.");
        }
        // Step Three - Bcrypt user's password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // Step Four - Enter user in database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [name, email, bcryptPassword])

        // Step Five - Generate JWT token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token})

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// LOGIN
authRouter.post("/login", async(req, res) => {
    try {
        // Step One - destructure req.body
        const { email, password } = req.body;
        // Step Two - check if user doesn't exist (if not, throw err)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length === 0) {
            return res.status(401).json("Email or password is incorrect.")
        }
        // Step Three - Check if incoming password matches password on database
        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);

        if (!validPassword) {
            res.status(401).json("Email or password is incorrect");
        }

        // Step Four - Return JWT Token
        const token = jwtGenerator(user.rows[0].user_id);

        res.json({ token})
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = authRouter;