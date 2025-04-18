import * as authservice from "../services";
import { Request, Response, NextFunction } from "express";
import { HTTP_CODES } from "../common";
import { logger } from "../config";

export const register = async (req : Request, res : Response, next : NextFunction): Promise<void> => {
    try {
        const user = await authservice.register(req.body);
        res.status(HTTP_CODES.CREATED).json({ success: true, user });
    } catch (error) {
        logger.error('Error in registration',error);
        next(error);
    }
};


export const login = async (req : Request, res : Response, next : NextFunction): Promise<void> => {
    try {
        const {email, password} = req.body;
        const {user, token} = await authservice.login(email, password);
        res.status(HTTP_CODES.OK).json({ success: true, user, token });
    } catch (error) {
        logger.error('Error in login',error);
        next(error);
    }
};

