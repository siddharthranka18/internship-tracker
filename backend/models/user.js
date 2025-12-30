const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    internships:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'internship'
    }]
});
module.exports=mongoose.model("user",userSchema);
