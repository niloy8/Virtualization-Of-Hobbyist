/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = "1354c4beeca480b1569d729d147fc39f45ac545eab7746ef6ae8215d4f0c924a"; // Change this to a secure key

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://niloybhuiyan321:9nwzefG3T98zaZBI@cluster0.gqjzz.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const usersCollection = client.db("homiee").collection("users");

        // ✅ User Signup
        app.post("/signup", async (req, res) => {
            const { firstName, lastName, userName, email, password } = req.body;

            if (!firstName || !lastName || !userName || !email || !password) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            const existingUser = await usersCollection.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "Email already exists!" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = { firstName, lastName, userName, email, password: hashedPassword };
            await usersCollection.insertOne(newUser);

            res.status(201).json({ message: "Signup successful!" });
        });

        //  User Login
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

            res.json({ message: "Login successful!", token, userName: user.userName });
        });

    } finally {
        // Don't close connection immediately
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// ✅ Get all users (for testing)
app.get("/users", async (req, res) => {
    try {
        const usersCollection = client.db("homiee").collection("users");
        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users!" });
    }
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
