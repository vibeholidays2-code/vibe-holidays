import nodemailer from 'nodemailer';

/**
 * Create email transporter
 */
export const createEmailTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Get email from address
 */
export const getEmailFrom = (): string => {
  return process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@vibeholidays.com';
};

/**
 * Get admin email address
 */
export const getAdminEmail = (): string => {
  return process.env.ADMIN_EMAIL || 'vibesholidays.9@gmail.com';
};
