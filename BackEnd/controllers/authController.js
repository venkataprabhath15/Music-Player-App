import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import imagekit from '../config/imageKit.js';
import crypto from 'crypto';
import sendEmail from '../Utils/sendEmail.js';

dotenv.config();
const createToken= (userid)=>{
    return jwt.sign({userid},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN});
}

const signup = async(req, res) => {
    try {
        const {name, email, password, avatar} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        const existingUser = await User.findOne({ email: email });

        if(existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        let avatarUrl = "";
        if(avatar) {
            const imagekitResponse = await imagekit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder : "/mern-music-player",
            });
            avatarUrl = imagekitResponse.url;
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: avatarUrl
        });

        const token = createToken(user._id);
    
        res.status(200).json({ 
            message: "User signed up successfully" ,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            token,
        });
    } catch (error) {
        res.status(500).json({ message: "Error during signup", error: error.message });
    }
}

const login = async(req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User.findOne({ email: email });

        if(user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);  

            if(isPasswordValid) {
                const token = createToken(user._id);
                return res.status(200).json({ 
                    message: "User logged in successfully",
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        avatar: user.avatar
                    },
                     token,
                });
            } else {
                return res.status(401).json({ message: "Invalid  password" });
            }
        } else {
            return res.status(401).json({ message: "Invalid email" });  
        }
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });   
    }
}

const getme = async(req, res) => {
    try {
        if(!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({
            message: "authorized" ,
            user: req.user
        })
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user data", error: error.message });   
    }
}

const forgotpassword = async(req, res) => {
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({message: "Email is required"});
        }
        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        const  resetToken  = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetTokenExpiry = Date.now() + 600000;

        await user.save();
        const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;   
     

     await sendEmail({
        to: user.email,
        subject : "Password Reset Request",
        html :  `<p>You requested a password reset. Click <a href="${resetUrl}">here</a> to reset your password. This link is valid for 10 minutes.</p>`
     }
     );
        res.status(200).json({message: "Password reset email sent"});
    }
    catch(error){
        res.status(500).json({message: "Error in sending password reset email", error: error.message});
        console.log(error)
    }
}

const resetPassword = async(req, res) => {
    try{
        const {token} = req.params;
        const {newPassword} = req.body;

        if(!newPassword || newPassword.length < 6){
            return res.status(400).json({message: "New password is required and must be at least 6 characters long"});
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if(!user){
            return res.status(400).json({message: "Invalid or expired token"});
        }

        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({message: "Password reset successful"});
    }
    catch(error){
        res.status(500).json({message: "Error in resetting password", error: error.message});
    }
}

const editProfile = async (req, res) => {
    try {
        const userid = req.user._id;
        if (!userid) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, email, avatar, currentpassword, newpassword } = req.body;

        const user = await User.findById(userid);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (currentpassword && !newpassword) {
            return res.status(400).json({
                message: "New password is required when providing current password"
            });
        }

        if (!currentpassword && newpassword) {
            return res.status(400).json({
                message: "Current password is required to set a new password"
            });
        }

        if (currentpassword && newpassword) {
            const isMatch = await user.comparePassword(currentpassword);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }

            if (newpassword.length < 6) {
                return res.status(400).json({
                    message: "New password must be at least 6 characters long"
                });
            }

            user.password = newpassword;
        }

        if (avatar) {
            const imagekitResponse = await imagekit.upload({
                file: avatar,
                fileName: `avatar_${Date.now()}.jpg`,
                folder: "/mern-music-player",
            });
            user.avatar = imagekitResponse.url;
        }

        await user.save();

        res.status(200).json({ message: "Profile updated successfully" });

        await res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Error during profile update", error: error.message });
    }
};

  

export { signup , login , getme , forgotpassword ,resetPassword , editProfile };
