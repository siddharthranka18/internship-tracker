require('dotenv').config();
const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');
const app = express();
const PORT=process.env.PORT||5000;
app.use(cors({
    origin:"https://internship-tracker-one.vercel.app"
}));
app.use(express.json());
const URI=process.env.MONGODB_URI;
mongoose.connect(URI,{});
const connection=mongoose.connection;
connection.once('open',()=>{
    console.log("mongo db database connection established successfully");
})
connection.on("error",(err)=>{
    console.error("mongodb connection error:", err);
})
const internshipRouter=require('./routes/internships')
app.use('/api/internships', internshipRouter);
app.get('/',(req,res)=>{
    res.send("InternTrack backend is running");
})
app.listen(PORT,()=>{
    console.log(`Server is running on port: http://localhost:${PORT}`);
})