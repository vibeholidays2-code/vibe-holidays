export interface BookingConfirmationData {
  customerName: string;
  packageName: string;
  destination: string;
  travelDate: string;
  numberOfTravelers: number;
  totalPrice: number;
  bookingId: string;
}

export interface BookingAdminNotificationData {
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

export interface InquiryAcknowledgmentData {
  customerName: string;
  message: string;
  inquiryId: string;
}

export interface InquiryAdminNotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  message: string;
  packageName?: string;
  inquiryId: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Generate booking confirmation email for customer
 */
export const generateBookingConfirmationEmail = (
  data: BookingConfirmationData
): EmailTemplate => {
  return {
    subject: `Booking Confirmation - ${data.packageName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Booking Confirmed!</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for booking with Vibe Holidays! Your booking has been confirmed.</p>
              
              <div class="details">
                <h3>Booking Details</h3>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                <p><strong>Package:</strong> ${data.packageName}</p>
                <p><strong>Destination:</strong> ${data.destination}</p>
                <p><strong>Travel Date:</strong> ${data.travelDate}</p>
                <p><strong>Number of Travelers:</strong> ${data.numberOfTravelers}</p>
                <p><strong>Total Price:</strong> $${data.totalPrice}</p>
              </div>
              
              <p>We will contact you shortly with further details about your trip.</p>
              <p>If you have any questions, please don't hesitate to contact us.</p>
            </div>
            <div class="footer">
              <p>© 2024 Vibe Holidays. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Generate booking notification email for admin
 */
export const generateBookingAdminNotificationEmail = (
  data: BookingAdminNotificationData
): EmailTemplate => {
  return {
    subject: `New Booking: ${data.packageName} - ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2196F3; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Booking Received</h1>
            </div>
            <div class="content">
              <div class="details">
                <h3>Booking Information</h3>
                <p><strong>Booking ID:</strong> ${data.bookingId}</p>
                <p><strong>Package:</strong> ${data.packageName}</p>
                <p><strong>Destination:</strong> ${data.destination}</p>
                <p><strong>Travel Date:</strong> ${data.travelDate}</p>
                <p><strong>Number of Travelers:</strong> ${data.numberOfTravelers}</p>
                <p><strong>Total Price:</strong> $${data.totalPrice}</p>
              </div>
              
              <div class="details">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> ${data.customerEmail}</p>
                <p><strong>Phone:</strong> ${data.customerPhone}</p>
              </div>
              
              <p>Please follow up with the customer to confirm details.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Generate inquiry acknowledgment email for customer
 */
export const generateInquiryAcknowledgmentEmail = (
  data: InquiryAcknowledgmentData
): EmailTemplate => {
  return {
    subject: 'Thank you for your inquiry - Vibe Holidays',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Inquiry Received</h1>
            </div>
            <div class="content">
              <p>Dear ${data.customerName},</p>
              <p>Thank you for your inquiry! We have received your message and will get back to you within 24 hours.</p>
              
              <div class="details">
                <h3>Your Message</h3>
                <p>${data.message}</p>
                <p><strong>Reference ID:</strong> ${data.inquiryId}</p>
              </div>
              
              <p>Our team is reviewing your inquiry and will respond shortly.</p>
            </div>
            <div class="footer">
              <p>© 2024 Vibe Holidays. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};

/**
 * Generate inquiry notification email for admin
 */
export const generateInquiryAdminNotificationEmail = (
  data: InquiryAdminNotificationData
): EmailTemplate => {
  const packageInfo = data.packageName
    ? `<p><strong>Package Interest:</strong> ${data.packageName}</p>`
    : '';
  const phoneInfo = data.customerPhone
    ? `<p><strong>Phone:</strong> ${data.customerPhone}</p>`
    : '';

  return {
    subject: `New Inquiry from ${data.customerName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #FF9800; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .details { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Inquiry Received</h1>
            </div>
            <div class="content">
              <div class="details">
                <h3>Customer Information</h3>
                <p><strong>Name:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> ${data.customerEmail}</p>
                ${phoneInfo}
                ${packageInfo}
                <p><strong>Inquiry ID:</strong> ${data.inquiryId}</p>
              </div>
              
              <div class="details">
                <h3>Message</h3>
                <p>${data.message}</p>
              </div>
              
              <p>Please respond to this inquiry within 24 hours.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};
