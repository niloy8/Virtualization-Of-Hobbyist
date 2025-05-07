/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const uri = process.env.MONGODB_URI || "mongodb+srv://niloybhuiyan321:9nwzefG3T98zaZBI@cluster0.gqjzz.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// Multer setup
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage }).fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'media', maxCount: 1 }
]);

// Helper functions
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isStrongPassword = (password) => password.length >= 8;

// Predefined communities with exact 1:1 hobby mapping
const COMMUNITIES = [
    { name: "Painting", icon: "palette", hobbies: ["Painting"] },
    { name: "Cooking", icon: "utensils", hobbies: ["Cooking"] },
    { name: "Wood Working", icon: "hammer", hobbies: ["Wood Working"] },
    { name: "Photography", icon: "camera", hobbies: ["Photography"] },
    { name: "Calligraphy", icon: "pen-fancy", hobbies: ["Calligraphy"] },
    { name: "Musical Instruments", icon: "music", hobbies: ["Musical Instruments"] },
    { name: "Hiking", icon: "mountain", hobbies: ["Hiking"] },
    { name: "Collecting", icon: "box-open", hobbies: ["Collecting"] },
    { name: "Gaming", icon: "gamepad", hobbies: ["Gaming"] },
    { name: "Pottery", icon: "jar", hobbies: ["Pottery"] },
    { name: "Cycling", icon: "bicycle", hobbies: ["Cycling"] },
    { name: "Blogging", icon: "blog", hobbies: ["Blogging"] },
    { name: "Chess", icon: "chess", hobbies: ["Chess"] },
    { name: "Fitness", icon: "dumbbell", hobbies: ["Fitness"] },
    { name: "Video Editing", icon: "video", hobbies: ["Video editing"] },
    { name: "DIY Crafting", icon: "tools", hobbies: ["DIY crafting"] },
    { name: "Yoga", icon: "spa", hobbies: ["Yoga"] }
];

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");

        const db = client.db("homiee");
        const usersCollection = db.collection("users");
        const communitiesCollection = db.collection("communities");
        const chatsCollection = db.collection("chats");

        // Initialize communities (one-time setup)
        const existingCount = await communitiesCollection.countDocuments();
        if (existingCount === 0) {
            await communitiesCollection.insertMany(COMMUNITIES);
        }

        // Signup Route
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
                hobbies: hobbies || [],
                description: "",
                profileImage: "",
                posts: [],
                communities: []
            });

            res.status(201).json({ message: "Signup successful!" });
        });

        // Login Route
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

            // Get communities that match user's hobbies
            let userCommunities = [];
            if (user.hobbies && user.hobbies.length > 0) {
                userCommunities = await communitiesCollection.find({
                    name: { $in: user.hobbies }
                }).toArray();

                // Update user's communities if not already set
                if (!user.communities || user.communities.length !== userCommunities.length) {
                    await usersCollection.updateOne(
                        { email },
                        { $set: { communities: userCommunities.map(c => c.name) } }
                    );
                }
            }

            const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
            res.json({
                message: "Login successful!",
                token,
                email: user.email,
                userName: user.userName,
                hobbies: user.hobbies,
                communities: userCommunities
            });
        });

        // Get user by email
        app.get("/users/:email", async (req, res) => {
            const { email } = req.params;

            try {
                const user = await usersCollection.findOne({ email });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                res.json(user);
            } catch (error) {
                console.error("Error fetching user:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Update user profile
        app.put("/users", (req, res, next) => {
            upload(req, res, async (err) => {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({ error: "File upload error" });
                } else if (err) {
                    return res.status(500).json({ error: "Unknown upload error" });
                }

                const { email, description, hobbies } = req.body;
                const profileImageFile = req.files && req.files['profileImage'] ? req.files['profileImage'][0] : null;

                let profileImage = profileImageFile ? `http://localhost:5000/uploads/${profileImageFile.filename}` : undefined;

                if (!email) {
                    return res.status(400).json({ error: "Email is required." });
                }

                const updateFields = {};
                if (description) updateFields.description = description;
                if (profileImage) updateFields.profileImage = profileImage;
                if (hobbies) {
                    updateFields.hobbies = hobbies;
                    // Update communities when hobbies change
                    const userCommunities = await communitiesCollection.find({
                        name: { $in: hobbies }
                    }).toArray();
                    updateFields.communities = userCommunities.map(c => c.name);
                }

                try {
                    const result = await usersCollection.updateOne(
                        { email },
                        { $set: updateFields }
                    );

                    if (result.modifiedCount === 0) {
                        return res.status(404).json({ error: "User not found or nothing changed." });
                    }

                    res.json({
                        message: "User updated successfully!",
                        updated: updateFields
                    });
                } catch (error) {
                    console.error("Error updating user:", error);
                    res.status(500).json({ error: "Internal server error." });
                }
            });
        });

        // Create post
        app.post("/users/:email/posts", (req, res, next) => {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ error: "File upload error" });
                }

                const { email } = req.params;
                const { text } = req.body;
                const mediaFile = req.files && req.files['media'] ? req.files['media'][0] : null;

                if (!email || !text) {
                    return res.status(400).json({ error: "Email and text are required." });
                }

                const postData = {
                    id: Date.now(),
                    text,
                    timestamp: new Date().toISOString(),
                    likes: 0,
                    comments: []
                };

                if (mediaFile) {
                    postData.media = `http://localhost:5000/uploads/${mediaFile.filename}`;
                    postData.mediaType = mediaFile.mimetype;
                }

                try {
                    const result = await usersCollection.updateOne(
                        { email },
                        { $push: { posts: postData } }
                    );

                    if (result.modifiedCount === 0) {
                        return res.status(404).json({ error: "User not found or post not created." });
                    }

                    res.json({
                        message: "Post created successfully!",
                        post: postData
                    });
                } catch (error) {
                    console.error("Error creating post:", error);
                    res.status(500).json({ error: "Internal server error." });
                }
            });
        });

        // Get all communities
        app.get("/communities", async (req, res) => {
            try {
                const communities = await communitiesCollection.find().toArray();
                res.json(communities);
            } catch (error) {
                console.error("Error fetching communities:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Get community chat messages
        app.get("/communities/:name/chat", async (req, res) => {
            const { name } = req.params;

            try {
                const chat = await chatsCollection.findOne({ communityName: name });
                if (!chat) {
                    return res.json({ messages: [] });
                }
                res.json(chat);
            } catch (error) {
                console.error("Error fetching chat messages:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Post message to community chat
        app.post("/communities/:name/chat", async (req, res) => {
            const { name } = req.params;
            const { userEmail, message } = req.body;

            if (!name || !userEmail || !message) {
                return res.status(400).json({ error: "Community name, user email and message are required" });
            }

            try {
                const user = await usersCollection.findOne({ email: userEmail });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                const newMessage = {
                    id: Date.now(),
                    user: {
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        avatar: user.profileImage
                    },
                    text: message,
                    timestamp: new Date().toISOString()
                };

                await chatsCollection.updateOne(
                    { communityName: name },
                    { $push: { messages: newMessage } },
                    { upsert: true }
                );

                res.json({
                    message: "Chat message added successfully",
                    newMessage
                });
            } catch (error) {
                console.error("Error posting chat message:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Get user's communities
        app.get("/users/:email/communities", async (req, res) => {
            const { email } = req.params;

            try {
                const user = await usersCollection.findOne({ email });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                const communities = await communitiesCollection.find({
                    name: { $in: user.communities || [] }
                }).toArray();

                res.json(communities);
            } catch (error) {
                console.error("Error fetching user communities:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Get all posts
        app.get("/posts", async (req, res) => {
            try {
                const users = await usersCollection.find({ posts: { $exists: true, $ne: [] } }).toArray();
                const allPosts = users.flatMap(user =>
                    user.posts.map(post => ({
                        ...post,
                        user: {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            profileImage: user.profileImage
                        }
                    }))
                );
                res.json(allPosts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Like/unlike post
        app.put("/posts/:postId/like", async (req, res) => {
            const { postId } = req.params;
            const { email, like } = req.body;

            if (!postId || !email || typeof like !== 'boolean') {
                return res.status(400).json({ error: "Post ID, user email and like status are required" });
            }

            try {
                const result = await usersCollection.updateOne(
                    { "posts.id": parseInt(postId) },
                    { $inc: { "posts.$.likes": like ? 1 : -1 } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "Post not found or like status unchanged" });
                }

                res.json({ message: like ? "Post liked" : "Post unliked" });
            } catch (error) {
                console.error("Error updating like status:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Add comment to post
        app.post("/posts/:postId/comment", async (req, res) => {
            const { postId } = req.params;
            const { email, text } = req.body;

            if (!postId || !email || !text) {
                return res.status(400).json({ error: "Post ID, user email and comment text are required" });
            }

            try {
                const user = await usersCollection.findOne({ email });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                const newComment = {
                    id: Date.now(),
                    user: {
                        email: user.email,
                        name: `${user.firstName} ${user.lastName}`,
                        avatar: user.profileImage
                    },
                    text,
                    timestamp: new Date().toISOString()
                };

                const result = await usersCollection.updateOne(
                    { "posts.id": parseInt(postId) },
                    { $push: { "posts.$.comments": newComment } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "Post not found" });
                }

                res.json({
                    message: "Comment added successfully",
                    comment: newComment
                });
            } catch (error) {
                console.error("Error adding comment:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });

        // Delete post
        app.delete("/users/:email/posts/:postId", async (req, res) => {
            const { email, postId } = req.params;

            try {
                const result = await usersCollection.updateOne(
                    { email },
                    { $pull: { posts: { id: parseInt(postId) } } }
                );

                if (result.modifiedCount === 0) {
                    return res.status(404).json({ error: "Post not found or already deleted" });
                }

                res.json({ message: "Post deleted successfully" });
            } catch (error) {
                console.error("Error deleting post:", error);
                res.status(500).json({ error: "Internal server error" });
            }
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