const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/customerlogin-controller");
const {signupSchema , loginSchema } =require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware");
const  authMiddleware = require("../middlewares/auth-middleware");
const csvcontrollers = require("../controllers/csv-controller");


router.route("/").get(authcontrollers.home);

router
    .route("/customerregister")
    .post(validate(signupSchema),authcontrollers.register);

router.route("/customer-login").post(validate(loginSchema), authcontrollers.login);
router.route("/customerotpverify").post(authcontrollers.otp);
router.route("/customerresendverify").post(authcontrollers.resendverify);
router.route("/customerforgot").post(authcontrollers.forgot);
router.route("/customerresetpassword").post(authcontrollers.resetpassword);

router.route("/custuser").get(authMiddleware, authcontrollers.user);
module.exports = router;