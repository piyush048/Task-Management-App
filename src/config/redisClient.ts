import { createClient } from 'redis';
import {logger} from './logger';

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) =>{
//  console.error('Redis Error:', err);
 logger.error('Redis Error:', err);
});

redisClient.on('connect', () => {
  // console.log('Connected to Redis!');
  logger.info('Connected to Redis!');
});

export { redisClient };
