import { Router } from "express";
import { login, register } from "../controllers";
import { validate } from "../middlewares";
import { registerSchema, loginSchema } from "../validations";

const Authrouter = Router();

Authrouter.post("/register", validate(registerSchema), register);
Authrouter.post("/login", validate(loginSchema), login);

export { Authrouter };