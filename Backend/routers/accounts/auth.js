import express from "express";
import { register, login } from "../../controller/accounts/authController.js";

const accountauth = express.Router();

accountauth.post("/register", register);
accountauth.post("/login", login);

export default accountauth;