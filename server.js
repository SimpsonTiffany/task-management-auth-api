// ---------------------------------------------------
// IMPORTS
// ---------------------------------------------------
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const { db, User, Project, Task } = require("./database/models");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------
// MIDDLEWARE
// ---------------------------------------------------
app.use(express.json());

// Sessions
app.use(
    session({
        secret: "supersecretkey123",
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 } // 1 hour
    })
);

// ---------------------------------------------------
// AUTH MIDDLEWARE
// ---------------------------------------------------
function isAuthenticated(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    req.user = req.session.user; // attach user data to request
    next();
}

// ---------------------------------------------------
// TEST ROUTE
// ---------------------------------------------------
app.get("/test", (req, res) => {
    res.json({ message: "Server is running." });
});

// ---------------------------------------------------
// USER REGISTRATION
// POST /api/register
// ---------------------------------------------------
app.post("/api/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const existing = await User.findOne({ where: { email } });
        if (existing) {
            return res.status(400).json({ error: "Email already exists." });
        }

        const hashed = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email,
            password: hashed,
        });

        res.json({ message: "User registered successfully." });

    } catch (error) {
        console.error("REGISTRATION ERROR:", error);
        res.status(500).json({ error: "Server error during registration." });
    }
});

// ---------------------------------------------------
// USER LOGIN
// POST /api/login
// ---------------------------------------------------
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: "Invalid email." });
        }

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) {
            return res.status(401).json({ error: "Incorrect password." });
        }

        req.session.user = {
            id: user.id,
            email: user.email,
            username: user.username
        };

        res.json({ message: "Login successful." });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({ error: "Server error during login." });
    }
});

// ---------------------------------------------------
// LOGOUT
// POST /api/logout
// ---------------------------------------------------
app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ message: "Logged out successfully." });
    });
});

// ---------------------------------------------------
// PROTECTED ROUTE (REQUIRED BY ASSIGNMENT)
// GET /api/projects
// ---------------------------------------------------
app.get("/api/projects", isAuthenticated, async (req, res) => {
    try {
        const projects = await Project.findAll({
            where: { userId: req.user.id },
            include: Task
        });

        res.json(projects);

    } catch (error) {
        console.error("PROJECT ERROR:", error);
        res.status(500).json({ error: "Could not fetch projects." });
    }
});

// ---------------------------------------------------
// SERVER START
// ---------------------------------------------------
db.sync().then(() => {
    console.log("Database synced.");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
