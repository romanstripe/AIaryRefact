const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { OAuth2Client } = require("google-auth-library");
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const authController = {};

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateToken();
        return res.status(200).json({ status: "success", token, user });
      }
    }
    throw new Error("이메일 혹은 패스워드가 일치하지 않습니다.");
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

authController.loginWithGoogle = async (req, res) => {
  try {
    const { token } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).substring(2, 15);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      user = new User({
        email,
        name,
        profile: picture,
        password: hashedPassword,
      });
      await user.save();
    }
    const newToken = await user.generateToken();
    return res.status(200).json({ status: "success", token: newToken, user });
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

authController.authenticate = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error("Token not found");
    const token = tokenString.split(" ")[1];
    jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
      if (err) throw new Error("invalid token");
      req.userId = payload._id;
    });

    next();
  } catch (error) {
    return res.status(400).json({ status: "fail", message: error.message });
  }
};

module.exports = authController;
