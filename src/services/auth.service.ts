import { userModel, IUser } from "../models";
import jwt from "jsonwebtoken";
import { hashPassword, comparePassword, ErrorMessages } from "@/common";
import { redisClient, logger } from "@/config";

const CACHE_EXPIRATION = 60 * 5;

interface LoginResponse {
    user: IUser;
    token: string;
}


export const register = async (data : IUser): Promise<IUser> => {
    const exitingUser = await userModel.findOne({email : data.email});
    if ( exitingUser ){
        logger.error(ErrorMessages.USER_EXISTS);
        throw new Error(ErrorMessages.USER_EXISTS);
    }

    const {password, ...rest} = data;
    data.password = await hashPassword(password);
    const user = await userModel.create(data);
    logger.info('User registered in MongoDB');
    await redisClient.set(`user:${user._id}`,user.role );
    logger.info('User registered in Redis');
    return user;
}

export const login = async (email : string , password : string): Promise<LoginResponse> => {
    const user = await userModel.findOne({email}).select("+password");

    if (!user) {
        logger.error(ErrorMessages.USER_NOT_FOUND);
        throw new Error(ErrorMessages.USER_NOT_FOUND);
    }
    
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        logger.error(ErrorMessages.INVALID_CREDENTIALS);
        throw new Error(ErrorMessages.INVALID_CREDENTIALS);
    }
   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: "24h" });

    return {user, token};
}
