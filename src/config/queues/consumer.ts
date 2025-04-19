import amqp from 'amqplib';
import { logger } from '../index';
import { sendNotificationToUser } from '../../notifications';

export const consumeTaskQueue = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
    const channel = await connection.createChannel();
    
    const queue = 'task_logs';
    await channel.assertQueue(queue, { durable: true });

    logger.info(`Waiting for messages in queue: ${queue}`);

    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const content = msg.content.toString();
        const data = JSON.parse(content);

        logger.info(`Received message from ${queue}: ${content}`);

        // for new Task creation
        if (data.type === 'TASK_CREATED' && data.data?.assignedTo) {
          
          const assignedUserId = data.data.assignedTo;
          const taskTitle = data.data.title;

          await sendNotificationToUser(assignedUserId, `You have been assigned a new task: ${taskTitle}`);
        }

        // for Task update
        if (data.type === 'TASK_UPDATED' && data.data?.assignedTo) {
          
          const assignedUserId = data.data.assignedTo;
          const taskTitle = data.data.title;

          await sendNotificationToUser(assignedUserId, `Your task has been updated: ${taskTitle}`);
        }

        channel.ack(msg);
      }
    });
  } catch (error) {
    logger.error('Error consuming task queue', error);
    throw error;
  }
};
