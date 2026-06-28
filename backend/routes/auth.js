
const { Signup, Login, Logout, verfiyEmail, resendOTP, forgetPassword, updateProfile, deleteAccount } = require('../Controllers/AuthController')
const { userVerification } = require("../middleware")
const router = require('express').Router()
const { verfiyEmailMiddleware } = require("../verifyEmailMiddleware")

//home page route
router.get('/', userVerification, (req, res) => {
    res.json({ status: true, user: req.user.username });
});

router.post('/signup', Signup);
router.post('/verifyEmail', verfiyEmail);
router.post('/resend-otp', resendOTP);
router.post('/login', verfiyEmailMiddleware, Login);

router.post('/forgetPassword', verfiyEmailMiddleware, forgetPassword);
router.post('/logout', Logout);
router.patch('/api/user/profile', updateProfile);
router.delete('/api/user/account', deleteAccount);

module.exports = router
