import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Username is required"]
    },
    email: {
        type: String,
        required: [true , "Email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true , "Password is required"],
        minlength: [6 , "Password must be at least 6 characters long"]
    },
 
    avatar: {
        type: String,
        default: ""
    },

    resetPasswordToken: String,
    resetTokenExpiry: Date,

    favourites: [{
        id : {type: String , required: true},
        name : String, 
        artist_name : String,
        image : String,
        audio : String,
        duration : String,
    },],
});

userSchema.pre('save' , async function() {
    if(!this.isModified('password')) return; 
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password , this.password);
}

const User = mongoose.model("User" , userSchema);

export default User;