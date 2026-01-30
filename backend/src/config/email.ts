import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export const createEmailTransporter = () => {
  const config: EmailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  };

  return nodemailer.createTransport(config);
};

export const getEmailFrom = (): string => {
  return process.env.EMAIL_FROM || 'noreply@vibeholidays.com';
};

export const getAdminEmail = (): string => {
  return process.env.ADMIN_EMAIL || 'admin@vibeholidays.com';
};
