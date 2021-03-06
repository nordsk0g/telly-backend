const authRouter = require("express").Router();
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../utils/jwtGenerator");
const joi = require("joi")
const passwordComplexity = require("joi-password-complexity");
const authorisation = require("../middleware/authorisation")

// REGISTRATION
authRouter.post("/register", async(req, res) => {
    try {
        console.log(req.body);
        // destruct req.body (name, email, password)
        const { username, email, password } = req.body;
        // check if user exists (then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        if (user.rows.length !== 0) {
            return res.status(401).send("Email is already in use.");
        }

        const result = await validateUser({username, email, password});
        console.log(result);

        if (result.error) {
            res.status(422).send(result.error.details[0].message)
        }

        // Bcrypt user's password
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);

        const bcryptPassword = await bcrypt.hash(password, salt);

        // Enter user in database
        const newUser = await pool.query("INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *", [username, email, bcryptPassword])

        // Generate JWT token
        const token = jwtGenerator(newUser.rows[0].user_id);

        res.json({ token })

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
        const token = await jwtGenerator(user.rows[0].user_id);
        
        res.json({ token })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// VERIFY JWT
authRouter.get('/verified', authorisation, async(req, res) => {
    try {
        res.json(true);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

const complexityOptions = {
    min: 6,
    max: 1024
    // lowerCase: 1,
    // upperCase: 1,
    // numeric: 1,
    // symbol: 1,
    // requirementCount: 4,
}

function validateUser(user) {
    const schema = joi.object({
        username: joi.string().alphanum().min(3).required(),
        email: joi.string().email().required(),
        password: passwordComplexity(complexityOptions).required()
    })

    return schema.validate(user);
}



module.exports = authRouter;