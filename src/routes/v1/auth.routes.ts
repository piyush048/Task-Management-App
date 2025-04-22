import { Router } from "express";
import { login, register } from "@/controllers";
import { validate } from "@/middlewares";
import { registerSchema, loginSchema } from '@/validations'

const authrouter = Router();

authrouter.post("/register", validate(registerSchema), register);
authrouter.post("/login", validate(loginSchema), login);

export { authrouter };