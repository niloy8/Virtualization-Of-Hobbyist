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
        app.post("/signup", async (req, res) => {
            const { firstName, lastName, userName, email, password } = req.body;

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
            await usersCollection.insertOne({ firstName, lastName, userName, email, password: hashedPassword });

            res.status(201).json({ message: "Signup successful!" });
        });

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
            res.json({ message: "Login successful!", token, email: user.email, userName: user.userName });



        });

        app.put("/users/hobbies", async (req, res) => {
            let { email, hobbies } = req.body;

            if (!email || !Array.isArray(hobbies)) {
                return res.status(400).json({ error: "Email and hobbies are required." });
            }

            email = email.trim().toLowerCase(); // normalize email

            const user = await client.db("homiee").collection("users").findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found." });
            }

            const result = await client
                .db("homiee")
                .collection("users")
                .updateOne(
                    { email },
                    { $set: { hobbies } }
                );

            if (result.modifiedCount === 0) {
                return res.status(400).json({ error: "Failed to update hobbies." });
            }

            res.json({ message: "Hobbies updated successfully!" });
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
