import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, register, requestPhoneLogin, verifyPhoneLogin } from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";

const r = Router();
r.post("/register", [body("name").notEmpty(), body("phone").notEmpty(), body("password").isLength({ min: 6 })], register);
r.post("/login", login);
r.post("/phone/request", requestPhoneLogin);
r.post("/phone/verify", verifyPhoneLogin);
r.post("/logout", logout);
r.get("/me", authRequired, me);

export default r;
