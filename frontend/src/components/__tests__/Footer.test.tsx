import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Footer from '../Footer';

const renderFooter = () => {
  return render(
    <BrowserRouter>
      <Footer />
    </BrowserRouter>
  );
};

describe('Footer', () => {
  describe('Company Branding', () => {
    it('renders enhanced company logo with gradient styling', () => {
      renderFooter();
      
      const logoIcon = screen.getByText('V');
      expect(logoIcon).toHaveClass('text-white', 'font-bold', 'text-xl');
      
      const logoText = screen.getByText('Vibes Holidays');
      expect(logoText).toHaveClass('bg-gradient-primary', 'bg-clip-text', 'text-transparent');
    });

    it('displays enhanced company description', () => {
      renderFooter();
      
      const description = screen.getByText(/Your gateway to unforgettable travel experiences/);
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass('text-neutral-300', 'text-lg', 'leading-relaxed');
    });

    it('includes background pattern and gradient', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('bg-gradient-to-br', 'from-neutral-900', 'via-neutral-800', 'to-neutral-900');
    });
  });

  describe('Enhanced Social Media Icons', () => {
    it('renders all social media links with enhanced styling', () => {
      renderFooter();
      
      const socialLinks = [
        { label: 'Follow us on Facebook', platform: 'Facebook' },
        { label: 'Follow us on Instagram', platform: 'Instagram' },
        { label: 'Follow us on Twitter', platform: 'Twitter' },
        { label: 'Subscribe to our YouTube channel', platform: 'YouTube' }
      ];

      socialLinks.forEach(({ label }) => {
        const link = screen.getByLabelText(label);
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass('group', 'w-12', 'h-12', 'rounded-xl', 'transition-all', 'duration-200');
      });
    });

    it('applies different gradient backgrounds for social icons', () => {
      renderFooter();
      
      const facebookLink = screen.getByLabelText('Follow us on Facebook');
      expect(facebookLink).toHaveClass('hover:bg-gradient-primary');
      
      const instagramLink = screen.getByLabelText('Follow us on Instagram');
      expect(instagramLink).toHaveClass('hover:bg-gradient-secondary');
      
      const twitterLink = screen.getByLabelText('Follow us on Twitter');
      expect(twitterLink).toHaveClass('hover:bg-gradient-primary');
      
      const youtubeLink = screen.getByLabelText('Subscribe to our YouTube channel');
      expect(youtubeLink).toHaveClass('hover:bg-gradient-secondary');
    });

    it('includes hover animations for social icons', () => {
      renderFooter();
      
      const socialLinks = screen.getAllByRole('link', { name: /Follow us|Subscribe/ });
      socialLinks.forEach(link => {
        expect(link).toHaveClass('hover:shadow-soft', 'hover:-translate-y-1');
      });
    });
  });

  describe('Enhanced Quick Links', () => {
    it('renders section header with visual accent', () => {
      renderFooter();
      
      const quickLinksHeader = screen.getByText('Quick Links');
      expect(quickLinksHeader).toHaveClass('text-xl', 'font-semibold', 'text-white');
    });

    it('renders all navigation links with enhanced styling', () => {
      renderFooter();
      
      const expectedLinks = [
        { text: 'Home', href: '/' },
        { text: 'Travel Packages', href: '/packages' },
        { text: 'Photo Gallery', href: '/gallery' },
        { text: 'About Us', href: '/about' },
        { text: 'Contact Us', href: '/contact' }
      ];

      expectedLinks.forEach(({ text, href }) => {
        const link = screen.getByRole('link', { name: text });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', href);
        expect(link).toHaveClass('group', 'text-neutral-300', 'hover:text-white', 'transition-all');
      });
    });

    it('includes animated bullet points for links', () => {
      renderFooter();
      
      const homeLink = screen.getByRole('link', { name: 'Home' });
      const bulletPoint = homeLink.querySelector('div');
      expect(bulletPoint).toHaveClass('w-2', 'h-2', 'bg-primary-400', 'rounded-full', 'group-hover:scale-125');
    });
  });

  describe('Enhanced Contact Information', () => {
    it('renders contact section header with visual accent', () => {
      renderFooter();
      
      const contactHeader = screen.getByText('Get In Touch');
      expect(contactHeader).toHaveClass('text-xl', 'font-semibold', 'text-white');
    });

    it('displays phone contact with enhanced styling', () => {
      renderFooter();
      
      const phoneLabel = screen.getByText('Call us');
      expect(phoneLabel).toHaveClass('text-sm', 'text-neutral-400');
      
      const phoneLink = screen.getByRole('link', { name: '+91 7048505128' });
      expect(phoneLink).toHaveAttribute('href', 'tel:+917048505128');
      expect(phoneLink).toHaveClass('text-white', 'font-medium', 'hover:text-primary-400');
    });

    it('displays email contact with enhanced styling', () => {
      renderFooter();
      
      const emailLabel = screen.getByText('Email us');
      expect(emailLabel).toHaveClass('text-sm', 'text-neutral-400');
      
      const emailLink = screen.getByRole('link', { name: 'vibesholidays.9@gmail.com' });
      expect(emailLink).toHaveAttribute('href', 'mailto:vibesholidays.9@gmail.com');
      expect(emailLink).toHaveClass('text-white', 'font-medium', 'hover:text-secondary-400');
    });

    it('displays address with enhanced styling', () => {
      renderFooter();
      
      const addressLabel = screen.getByText('Visit us');
      expect(addressLabel).toHaveClass('text-sm', 'text-neutral-400');
      
      const address = screen.getByText(/Vejalpur, Ahmedabad/);
      expect(address).toHaveClass('text-white', 'font-medium', 'not-italic', 'leading-relaxed');
    });

    it('includes colored icon backgrounds for contact items', () => {
      renderFooter();
      
      // Check that contact items have proper container styling
      const contactItems = screen.getAllByText(/Call us|Email us|Visit us/).map(label => 
        label.closest('.group')
      );
      
      contactItems.forEach(item => {
        expect(item).toHaveClass('group');
        const container = item?.querySelector('div');
        expect(container).toHaveClass('bg-neutral-800/50', 'hover:bg-neutral-800', 'rounded-xl');
      });
    });
  });

  describe('Enhanced Bottom Bar', () => {
    it('displays copyright with current year', () => {
      renderFooter();
      
      const currentYear = new Date().getFullYear();
      const copyright = screen.getByText(`© ${currentYear} Vibes Holidays. All rights reserved.`);
      expect(copyright).toBeInTheDocument();
      expect(copyright).toHaveClass('text-neutral-400', 'text-sm');
    });

    it('includes crafted with love message', () => {
      renderFooter();
      
      const craftedMessage = screen.getByText('Crafted with ❤️ for unforgettable journeys');
      expect(craftedMessage).toBeInTheDocument();
      expect(craftedMessage).toHaveClass('text-neutral-500', 'text-xs');
    });

    it('renders policy links with proper styling', () => {
      renderFooter();
      
      const privacyLink = screen.getByRole('link', { name: 'Privacy Policy' });
      expect(privacyLink).toHaveAttribute('href', '/privacy');
      expect(privacyLink).toHaveClass('text-neutral-400', 'hover:text-primary-400', 'transition-colors');
      
      const termsLink = screen.getByRole('link', { name: 'Terms of Service' });
      expect(termsLink).toHaveAttribute('href', '/terms');
      expect(termsLink).toHaveClass('text-neutral-400', 'hover:text-primary-400', 'transition-colors');
    });

    it('includes visual dividers between sections', () => {
      renderFooter();
      
      // Check for divider elements (they don't have specific text content)
      const footer = screen.getByRole('contentinfo');
      const dividers = footer.querySelectorAll('.w-px.h-4.bg-neutral-700');
      expect(dividers.length).toBeGreaterThan(0);
    });
  });

  describe('Professional Styling', () => {
    it('applies professional gradient background', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('bg-gradient-to-br', 'from-neutral-900', 'via-neutral-800', 'to-neutral-900');
    });

    it('includes proper spacing and layout', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      const container = footer.querySelector('.max-w-7xl');
      expect(container).toHaveClass('mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-16');
    });

    it('uses consistent transition animations', () => {
      renderFooter();
      
      const animatedElements = screen.getAllByRole('link');
      animatedElements.forEach(element => {
        const classes = element.className;
        if (classes.includes('transition')) {
          expect(classes).toMatch(/transition-(?:all|colors|transform)/);
          expect(classes).toMatch(/duration-200/);
        }
      });
    });

    it('maintains responsive grid layout', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      const gridContainer = footer.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-12');
    });
  });

  describe('Accessibility', () => {
    it('uses semantic footer element', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('includes proper ARIA labels for social links', () => {
      renderFooter();
      
      const socialLabels = [
        'Follow us on Facebook',
        'Follow us on Instagram', 
        'Follow us on Twitter',
        'Subscribe to our YouTube channel'
      ];

      socialLabels.forEach(label => {
        const link = screen.getByLabelText(label);
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('uses proper address element for location', () => {
      renderFooter();
      
      const address = screen.getByText(/Vejalpur, Ahmedabad/);
      expect(address.tagName).toBe('ADDRESS');
      expect(address).toHaveClass('not-italic');
    });

    it('includes proper link attributes for external links', () => {
      renderFooter();
      
      const externalLinks = screen.getAllByRole('link', { name: /Follow us|Subscribe/ });
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });
});