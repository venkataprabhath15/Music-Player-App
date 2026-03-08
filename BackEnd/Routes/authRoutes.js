import express from 'express';
import { signup } from '../controllers/authController.js';
import { login } from '../controllers/authController.js';
import { getme } from '../controllers/authController.js';
import { forgotpassword } from '../controllers/authController.js';
import { resetPassword } from '../controllers/authController.js';
import { editProfile } from '../controllers/authController.js';
import { protect as protect } from '../Middleware/authmiddleware.js';


const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/me',protect,  getme);  
router.post('/forgotpassword',  forgotpassword);
router.post('/resetpassword/:token',  resetPassword);
router.patch('/editprofile', protect, editProfile);


export default router;

