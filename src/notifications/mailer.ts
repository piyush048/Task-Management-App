import nodemailer from 'nodemailer';
import { logger } from '../config';

let transporter: nodemailer.Transporter;

export const initializeMailer = (): void => {
  transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  logger.info('Email transporter initialized');
};


export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    if (!transporter) {
      throw new Error('Email transporter not initialized');
    }

    const info = await transporter.sendMail({
      from: `"Task Manager App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });

    logger.info(`Email sent: ${info.messageId}`);
  } catch (error) {
    logger.error('Error sending email', error);
    throw error;
  }
};
