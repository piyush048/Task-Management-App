import amqp from 'amqplib';
import { logger } from '../index';

let channel: amqp.Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('project_logs');
    
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    
    logger.error('RabbitMQ connection error:', error);
    throw error;
  }
};

export const publishToQueue = async (queue: string, data: any) => {

  if (!channel) {
    logger.error('RabbitMQ channel is not established', new Error().stack);
    throw new Error('RabbitMQ channel is not established');
  }
  try{
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
    logger.info(`Published message to queue ${queue}`);
  }
  catch (error) {
    logger.error('Error publishing to RabbitMQ:', error);
    throw error;
  }
};
