/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI || "mongodb+srv://niloybhuiyan321:9nwzefG3T98zaZBI@cluster0.gqjzz.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// Helper function for email format validation
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Helper function for password strength
const isStrongPassword = (password) => password.length >= 8;

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const usersCollection = client.db("homiee").collection("users");

        // 🔐 Signup Route with Validations
        // 🔐 Signup Route with Hobbies
        app.post("/signup", async (req, res) => {
            const { firstName, lastName, userName, email, password, hobbies } = req.body;

            if (!firstName || !lastName || !userName || !email || !password) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            if (!isValidEmail(email)) {
                return res.status(400).json({ error: "Invalid email format!" });
            }

            if (!isStrongPassword(password)) {
                return res.status(400).json({ error: "Password must be at least 8 characters long!" });
            }

            const existingEmail = await usersCollection.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({ error: "Email already exists!" });
            }

            const existingUserName = await usersCollection.findOne({ userName });
            if (existingUserName) {
                return res.status(400).json({ error: "Username already taken!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await usersCollection.insertOne({
                firstName,
                lastName,
                userName,
                email,
                password: hashedPassword,
                hobbies: hobbies || [] // Store hobbies if provided
            });

            res.status(201).json({ message: "Signup successful!" });
        });


        // 🔐 Login Route
        // 🔐 Login Route
        app.post("/login", async (req, res) => {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            const user = await usersCollection.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "User not found!" });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: "Invalid credentials!" });
            }

            const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
            res.json({
                message: "Login successful!",
                token,
                email: user.email,
                userName: user.userName,
                hobbies: user.hobbies // Send the hobbies with the response
            });
        });

        // 🔄 Update hobbies using PUT /users
        app.put("/users", async (req, res) => {
            const { email, hobbies } = req.body;

            if (!email || !Array.isArray(hobbies)) {
                return res.status(400).json({ error: "Email and hobbies array are required." });
            }

            try {
                const result = await usersCollection.updateOne(
                    { email },
                    { $set: { hobbies } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "User not found or hobbies unchanged." });
                }

                res.json({ message: "Hobbies updated successfully!" });
            } catch (error) {
                console.error("Error updating hobbies:", error);
                res.status(500).json({ error: "Internal server error." });
            }
        });


        // For testing - get all users
        app.get("/users", async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.json(users);
        });

    } finally {
        // Keep connection open
    }
}

run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
