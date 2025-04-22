import { logger } from '@/config';
import { IUser, userModel } from '@/models';

export const getAllUsers = async () => {
  return await userModel.find().select('-password');
};

export const getProfile = async (userId : string): Promise<IUser> => {
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
        logger.error("User not found!");
        throw new Error("User not found!");
    }
    return user;
}

export const updateUser = async (id: string, data: IUser): Promise<IUser | null> => {
  const user = await userModel.findByIdAndUpdate(id, data, { new: true }).select('-password');
  return user;
};

// for sending email
export const getUserById = async (id: string): Promise<IUser | null> => {
  return await userModel.findById(id);
};
