import { createEmailTransporter, getEmailFrom, getAdminEmail } from '../config/email';
import {
  generateBookingConfirmationEmail,
  generateBookingAdminNotificationEmail,
  generateInquiryAcknowledgmentEmail,
  generateInquiryAdminNotificationEmail,
} from './emailTemplates';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send booking confirmation email to customer
 */
export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  bookingData: {
    customerName: string;
    packageName: string;
    destination: string;
    travelDate: string;
    numberOfTravelers: number;
    totalPrice: number;
    bookingId: string;
  }
): Promise<EmailResult> => {
  try {
    const transporter = createEmailTransporter();
    const emailContent = generateBookingConfirmationEmail(bookingData);

    const info = await transporter.sendMail({
      from: getEmailFrom(),
      to: customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending booking confirmation email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send booking notification email to admin
 */
export const sendBookingAdminNotificationEmail = async (
  bookingData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    packageName: string;
    destination: string;
    travelDate: string;
    numberOfTravelers: number;
    totalPrice: number;
    bookingId: string;
  }
): Promise<EmailResult> => {
  try {
    const transporter = createEmailTransporter();
    const emailContent = generateBookingAdminNotificationEmail(bookingData);

    const info = await transporter.sendMail({
      from: getEmailFrom(),
      to: getAdminEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending booking admin notification email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send inquiry acknowledgment email to customer
 */
export const sendInquiryAcknowledgmentEmail = async (
  customerEmail: string,
  inquiryData: {
    customerName: string;
    message: string;
    inquiryId: string;
  }
): Promise<EmailResult> => {
  try {
    const transporter = createEmailTransporter();
    const emailContent = generateInquiryAcknowledgmentEmail(inquiryData);

    const info = await transporter.sendMail({
      from: getEmailFrom(),
      to: customerEmail,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending inquiry acknowledgment email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Send inquiry notification email to admin
 */
export const sendInquiryAdminNotificationEmail = async (
  inquiryData: {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    message: string;
    packageName?: string;
    inquiryId: string;
  }
): Promise<EmailResult> => {
  try {
    const transporter = createEmailTransporter();
    const emailContent = generateInquiryAdminNotificationEmail(inquiryData);

    const info = await transporter.sendMail({
      from: getEmailFrom(),
      to: getAdminEmail(),
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error: any) {
    console.error('Error sending inquiry admin notification email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
