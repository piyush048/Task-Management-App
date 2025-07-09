import { redisClient } from "@/config";
import { IProject } from "@/models";

export const updateRedisUser = async (userId: string, updates: Partial<{ role: string; name: string; email: string }>) => {
    const key = `user:${userId}`;
  
    const existing = await redisClient.get(key);
    
    let existingData = {};
  
    if (existing) {
      existingData = JSON.parse(existing);
    }

    const updatedData = {
      ...existingData,
      ...updates,
    };

    await redisClient.set(key, JSON.stringify(updatedData));
};

export const updateRedisProject = async (projectId: string, updates: Partial<IProject>) => {
    const key = `project:${projectId}`;
  
    const existing = await redisClient.get(key);
    
    let existingData = {};
  
    if (existing) {
      existingData = JSON.parse(existing);
    }

    const updatedData = {
        ...existingData,
        ...updates,
      };

    await redisClient.set(key, JSON.stringify(updatedData));
}