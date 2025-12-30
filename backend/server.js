require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const cookieParser=require('cookie-parser');
const jwt= require('jsonwebtoken');
const bcrypt=require('bcrypt')
const userModel=require("./models/user")
const app = express();
const PORT=process.env.PORT||5000;
app.use(cors({
    origin:"https://my-intern-tracker.vercel.app",
    credentials:true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
const URI=process.env.MONGODB_URI;
mongoose.connect(URI,{});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("mongo db database connection established successfully");
})
connection.on("error",(err)=>{
    console.error("mongodb connection error:", err);
})
function isLoggedin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("No token provided");

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded JWT Data:", data); // Check if this shows 'userid' or 'id'
        req.user = data;
        next();
    } catch (err) {
        res.status(401).send("Invalid token");
    }
}
app.post('/api/register', async (req, res) => {
    try {
        // Removed 'age' from here
        let { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await userModel.create({
            username,
            email,
            password: hashedPassword
            // Removed 'age' from here too
        });

        const token = jwt.sign({ email: user.email, userid: user._id }, process.env.JWT_SECRET);
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Set to false for localhost
            sameSite: 'none', 
            maxAge: 3600000,
            path: '/' // Ensures the cookie is available for ALL routes
        });

        res.status(201).json(user);
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        
        // Use JSON responses instead of .send() for better frontend handling
        if (!user) return res.status(400).json({ message: "User not found" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Wrong password" });

        const token = jwt.sign({ email: user.email, userid: user._id },  process.env.JWT_SECRET);

        // --- UPDATED COOKIE SETTINGS ---
        res.cookie('token', token, {
            httpOnly: true,
            secure: true, // Set to true only if using HTTPS
            sameSite: 'none', // Needed for cross-origin requests on localhost
            maxAge: 3600000, // 1 hour
            path: '/'
        });

        // Send back user data so the frontend can use it
        res.status(200).json({
            message: "Logged in successfully",
            user: { username: user.username, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
// Backend server.js
app.get('/api/logout', (req, res) => {
    // Clear the cookie named "token"
    res.cookie("token", "", { 
        expires: new Date(0), 
        httpOnly: true,
        sameSite: 'lax'
    });
    res.status(200).json({ message: "Logged out successfully" });
});
// backend/server.js (or wherever your routes are)
// backend/server.js
// backend/server.js
app.get('/api/check-auth', isLoggedin, async (req, res) => {
    try {
        // Use 'userid' specifically because that's what you set in your Login sign function
        const user = await userModel.findById(req.user.userid); 
        
        if (!user) {
            // This is likely why you get a 401 on reload
            return res.status(401).json({ authenticated: false, message: "User not in database" });
        }

        // If found, send the user object to fill the AuthContext state
        res.status(200).json({ 
            authenticated: true, 
            user: {
                username: user.username,
                email: user.email,
                userid: user._id
            } 
        });
    } catch (err) {
        console.error("Auth check error:", err);
        res.status(401).json({ authenticated: false });
    }
});
// --- INTERNSHIP ROUTES ---
const internshipRouter = require('./routes/internships');
// Add isLoggedIn here if you want to protect the entire router
app.use('/api/internships', isLoggedin, internshipRouter); 

app.get('/', (req, res) => {
    res.send("InternTrack backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}`);
});