// Google Analytics Event Tracking Utilities

import { trackEvent } from '../components/GoogleAnalytics';

// Track package view
export const trackPackageView = (packageId: string, packageName: string) => {
  trackEvent('view_package', {
    package_id: packageId,
    package_name: packageName,
  });
};

// Track inquiry submission
export const trackInquirySubmit = (packageId?: string) => {
  trackEvent('submit_inquiry', {
    package_id: packageId || 'general',
  });
};

// Track booking attempt
export const trackBookingAttempt = (packageId: string, packageName: string) => {
  trackEvent('begin_booking', {
    package_id: packageId,
    package_name: packageName,
  });
};

// Track WhatsApp click
export const trackWhatsAppClick = (source: string) => {
  trackEvent('click_whatsapp', {
    source: source, // e.g., 'contact_page', 'package_detail', 'footer'
  });
};

// Track phone click
export const trackPhoneClick = (source: string) => {
  trackEvent('click_phone', {
    source: source,
  });
};

// Track search
export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

// Track filter usage
export const trackFilter = (filterType: string, filterValue: string) => {
  trackEvent('use_filter', {
    filter_type: filterType, // e.g., 'destination', 'price', 'duration'
    filter_value: filterValue,
  });
};

// Track social media click
export const trackSocialClick = (platform: string) => {
  trackEvent('click_social', {
    platform: platform, // e.g., 'facebook', 'instagram', 'twitter'
  });
};

// Track contact form submission
export const trackContactSubmit = () => {
  trackEvent('submit_contact_form');
};

// Track gallery image view
export const trackGalleryView = (imageCategory: string) => {
  trackEvent('view_gallery_image', {
    category: imageCategory,
  });
};
