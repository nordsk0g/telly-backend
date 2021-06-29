const authRouter = require("express").Router();
const pool = require("../db/db");

// REGISTRATION
authRouter.post("/register", async(req, res) => {
    try {
        // Step One - destruct req.body (name, email, password)
        const { name, email, password } = req.body;
        console.log(req.body);
        // Step Two - check if user exists (then throw error)
        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);

        res.json(user.rows)
        // Step Three - Bcrypt user's password

        // Step Four - Enter user in database

        // Step Five - Generate JWT token

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})


module.exports = authRouter;