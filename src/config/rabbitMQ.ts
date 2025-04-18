import amqp from 'amqplib';
import { logger } from './logger';

let channel: amqp.Channel;

export const connectRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    channel = await connection.createChannel();
    await channel.assertQueue('project_logs');
    // console.log('Connected to RabbitMQ');
    logger.info('Connected to RabbitMQ');
  } catch (error) {
    // console.error('RabbitMQ connection error:', error);
    logger.error('RabbitMQ connection error:', error);
    throw error;
  }
};

export const publishToQueue = async (queue: string, data: any) => {
  // if (!channel) return;
  // channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));

  if (!channel) {
    logger.error('RabbitMQ channel is not established', new Error().stack);
    throw new Error('RabbitMQ channel is not established');
  }

  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
};
