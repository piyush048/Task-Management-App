import { logger } from '../config';
import { sendEmail } from './mailer';
import { getUserById } from '../services';


export const sendNotificationToUser = async (userId: string, message: string): Promise<void> => {
  try {
    const user = await getUserById(userId);
    if (!user || !user.email) {
        logger.error('Assigned user not found or has no email');
        throw new Error('Assigned user not found or has no email');
    }

    await sendEmail(
      user.email,
      'New Task Assigned | Task Updated',
      message,
    );

    logger.info(`Notification email sent to user ${user.email}`);
  } catch (error) {
    logger.error('Error sending notification to user', error);
  }
};
