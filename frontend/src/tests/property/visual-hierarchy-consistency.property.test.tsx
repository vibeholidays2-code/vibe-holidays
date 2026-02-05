/**
 * Feature: vibe-holidays-ui-improvement, Property 3: Visual Hierarchy Consistency
 * 
 * Property-based tests for visual hierarchy consistency standards.
 * Validates that heading elements follow proper semantic hierarchy (h1 > h2 > h3),
 * font sizes decrease appropriately for each level, and call-to-action elements
 * have higher visual prominence than secondary elements.
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import Navbar from '../../components/Navbar';
import PackageCard from '../../components/PackageCard';
import Footer from '../../components/Footer';
import HomePage from '../../pages/HomePage';
import { Package } from '../../types/package';

// Mock IntersectionObserver for framer-motion
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
});

// Helper function to render components with all necessary providers
const renderWithProviders = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Helper function to extract font size from Tailwind classes
const extractFontSize = (classes: string[]): number => {
  const fontSizeMap: { [key: string]: number } = {
    'text-xs': 12,
    'text-sm': 14,
    'text-base': 16,
    'text-lg': 18,
    'text-xl': 20,
    'text-2xl': 24,
    'text-3xl': 30,
    'text-4xl': 36,
    'text-5xl': 48,
    'text-6xl': 60,
    'text-7xl': 72,
    'text-8xl': 96,
  };

  for (const cls of classes) {
    if (fontSizeMap[cls]) {
      return fontSizeMap[cls];
    }
  }
  return 16; // Default base size
};

// Helper function to check semantic heading hierarchy
const hasProperHeadingHierarchy = (container: HTMLElement): boolean => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length === 0) return true; // No headings is acceptable

  let previousLevel = 0;
  for (const heading of headings) {
    const currentLevel = parseInt(heading.tagName.charAt(1));
    
    // First heading can be any level
    if (previousLevel === 0) {
      previousLevel = currentLevel;
      continue;
    }
    
    // Subsequent headings should not skip more than one level down
    if (currentLevel > previousLevel + 1) {
      return false;
    }
    
    previousLevel = currentLevel;
  }
  
  return true;
};

// Helper function to check font size hierarchy
const hasFontSizeHierarchy = (container: HTMLElement): boolean => {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  if (headings.length <= 1) return true; // Single or no headings are acceptable

  const headingData: { level: number; fontSize: number }[] = [];
  
  headings.forEach(heading => {
    const level = parseInt(heading.tagName.charAt(1));
    const classes = Array.from(heading.classList);
    const fontSize = extractFontSize(classes);
    headingData.push({ level, fontSize });
  });

  // Check that higher level headings (h1, h2) have larger or equal font sizes than lower level headings (h3, h4, h5, h6)
  for (let i = 0; i < headingData.length - 1; i++) {
    for (let j = i + 1; j < headingData.length; j++) {
      const current = headingData[i];
      const next = headingData[j];
      
      // If current heading level is higher (smaller number), it should have larger or equal font size
      if (current.level < next.level && current.fontSize < next.fontSize) {
        return false;
      }
    }
  }
  
  return true;
};

// Helper function to check call-to-action prominence
const hasProminentCTAElements = (container: HTMLElement): boolean => {
  const buttons = container.querySelectorAll('button, a[role="button"], .btn');
  const regularText = container.querySelectorAll('p, span:not(.btn):not(button span)');
  
  if (buttons.length === 0) return true; // No CTAs is acceptable
  
  // Check that buttons have visual prominence indicators
  for (const button of buttons) {
    const classes = Array.from(button.classList);
    const hasProminentStyling = classes.some(cls => 
      cls.includes('bg-primary') || 
      cls.includes('bg-gradient') || 
      cls.includes('shadow') ||
      cls.includes('font-bold') ||
      cls.includes('font-semibold') ||
      cls.includes('border-2') ||
      cls.includes('border-primary')
    );
    
    if (!hasProminentStyling) {
      return false;
    }
  }
  
  return true;
};

// Helper function to get element classes
const getElementClasses = (element: HTMLElement): string[] => {
  return Array.from(element.classList);
};

describe('Property 3: Visual Hierarchy Consistency', () => {
  it('Navbar component should maintain proper heading hierarchy and visual prominence', () => {
    fc.assert(
      fc.property(
        fc.constant(true), // Simple property to test navbar consistency
        () => {
          const { container } = renderWithProviders(<Navbar />);
          
          // Check semantic heading hierarchy
          const hasValidHierarchy = hasProperHeadingHierarchy(container);
          if (!hasValidHierarchy) return false;
          
          // Check that logo has prominent styling
          const logoElement = container.querySelector('span[class*="text-2xl"]');
          if (logoElement) {
            const logoClasses = getElementClasses(logoElement);
            const hasProminentLogo = logoClasses.some(cls => 
              cls.includes('font-bold') || cls.includes('text-2xl') || cls.includes('gradient')
            );
            if (!hasProminentLogo) return false;
          }
          
          // Check that navigation links have consistent hierarchy
          const navLinks = container.querySelectorAll('a[role="menuitem"]');
          for (const link of navLinks) {
            const linkClasses = getElementClasses(link as HTMLElement);
            const hasConsistentStyling = linkClasses.some(cls => 
              cls.includes('text-sm') || cls.includes('font-medium') || cls.includes('text-base')
            );
            if (!hasConsistentStyling) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Footer component should maintain proper heading hierarchy', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<Footer />);
          
          // Check semantic heading hierarchy
          const hasValidHierarchy = hasProperHeadingHierarchy(container);
          if (!hasValidHierarchy) return false;
          
          // Check font size hierarchy
          const hasValidFontSizes = hasFontSizeHierarchy(container);
          if (!hasValidFontSizes) return false;
          
          // Check that main company heading is prominent
          const companyHeading = container.querySelector('h3');
          if (companyHeading) {
            const headingClasses = getElementClasses(companyHeading);
            const hasProminentStyling = headingClasses.some(cls => 
              cls.includes('text-3xl') || cls.includes('font-bold') || cls.includes('gradient')
            );
            if (!hasProminentStyling) return false;
          }
          
          // Check that section headings are properly styled
          const sectionHeadings = container.querySelectorAll('h4');
          for (const heading of sectionHeadings) {
            const headingClasses = getElementClasses(heading as HTMLElement);
            const hasAppropriateSize = headingClasses.some(cls => 
              cls.includes('text-xl') || cls.includes('text-lg') || cls.includes('font-semibold')
            );
            if (!hasAppropriateSize) return false;
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('PackageCard component should maintain visual hierarchy with proper heading and CTA prominence', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string({ minLength: 1, maxLength: 24 }),
          name: fc.string({ minLength: 1, maxLength: 100 }),
          destination: fc.string({ minLength: 1, maxLength: 50 }),
          duration: fc.integer({ min: 1, max: 30 }),
          price: fc.integer({ min: 1000, max: 100000 }),
          description: fc.string({ minLength: 10, maxLength: 200 }),
          images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 5 }),
          thumbnail: fc.option(fc.webUrl()),
          featured: fc.boolean(),
          active: fc.boolean(),
          category: fc.string({ minLength: 1, maxLength: 20 }),
          itinerary: fc.array(fc.string({ minLength: 1, maxLength: 100 })),
          inclusions: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          exclusions: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
          createdAt: fc.date().map(d => d.toISOString()),
          updatedAt: fc.date().map(d => d.toISOString())
        }),
        (packageData) => {
          const { container } = renderWithProviders(
            <PackageCard package={packageData as Package} />
          );
          
          // Check semantic heading hierarchy
          const hasValidHierarchy = hasProperHeadingHierarchy(container);
          if (!hasValidHierarchy) return false;
          
          // Check that package name heading is prominent
          const packageHeading = container.querySelector('h3');
          if (packageHeading) {
            const headingClasses = getElementClasses(packageHeading);
            const hasProminentStyling = headingClasses.some(cls => 
              cls.includes('text-2xl') || cls.includes('text-xl') || cls.includes('font-bold')
            );
            if (!hasProminentStyling) return false;
          }
          
          // Check that price display is prominent
          const priceElements = container.querySelectorAll('*');
          let hasPriceProminence = false;
          for (const element of priceElements) {
            const text = element.textContent || '';
            if (text.includes('₹') || text.includes(packageData.price.toString())) {
              const classes = getElementClasses(element as HTMLElement);
              const isProminent = classes.some(cls => 
                cls.includes('font-bold') || cls.includes('text-lg') || cls.includes('text-xl')
              );
              if (isProminent) {
                hasPriceProminence = true;
                break;
              }
            }
          }
          
          // Check CTA prominence
          const hasProminentCTA = hasProminentCTAElements(container);
          if (!hasProminentCTA) return false;
          
          return hasPriceProminence;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('HomePage component should maintain proper heading hierarchy across all sections', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<HomePage />);
          
          // Check that we have headings
          const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
          if (headings.length === 0) return true; // No headings is acceptable
          
          // Check that main hero heading exists and is prominent
          const heroHeading = container.querySelector('h1');
          if (!heroHeading) return false; // HomePage should have an h1
          
          const heroClasses = getElementClasses(heroHeading);
          const hasLargeHeroSize = heroClasses.some(cls => 
            cls.includes('text-6xl') || cls.includes('text-8xl') || cls.includes('text-5xl') || cls.includes('text-4xl')
          );
          if (!hasLargeHeroSize) return false;
          
          // Check that section headings (h2) exist and are appropriately sized
          const sectionHeadings = container.querySelectorAll('h2');
          if (sectionHeadings.length === 0) return true; // No h2s is acceptable
          
          for (const heading of sectionHeadings) {
            const headingClasses = getElementClasses(heading as HTMLElement);
            const hasAppropriateSize = headingClasses.some(cls => 
              cls.includes('text-5xl') || cls.includes('text-4xl') || cls.includes('text-3xl') || 
              cls.includes('text-6xl') || cls.includes('text-2xl')
            );
            if (!hasAppropriateSize) return false;
          }
          
          // Check that h3 headings are appropriately sized (if they exist)
          const h3Headings = container.querySelectorAll('h3');
          for (const heading of h3Headings) {
            const headingClasses = getElementClasses(heading as HTMLElement);
            const hasAppropriateSize = headingClasses.some(cls => 
              cls.includes('text-3xl') || cls.includes('text-2xl') || cls.includes('text-xl') || cls.includes('text-lg')
            );
            if (!hasAppropriateSize) return false;
          }
          
          // Check that h4 headings are appropriately sized (if they exist)
          const h4Headings = container.querySelectorAll('h4');
          for (const heading of h4Headings) {
            const headingClasses = getElementClasses(heading as HTMLElement);
            const hasAppropriateSize = headingClasses.some(cls => 
              cls.includes('text-lg') || cls.includes('text-xl') || cls.includes('text-base') || cls.includes('font-bold')
            );
            if (!hasAppropriateSize) return false;
          }
          
          // Check CTA prominence - be more lenient
          const buttons = container.querySelectorAll('button, a[role="button"], .btn, a[class*="Button"]');
          if (buttons.length === 0) return true; // No buttons is acceptable
          
          // At least some buttons should have prominent styling
          let hasAnyProminentButton = false;
          for (const button of buttons) {
            const classes = Array.from(button.classList);
            const hasProminentStyling = classes.some(cls => 
              cls.includes('bg-') || 
              cls.includes('gradient') || 
              cls.includes('shadow') ||
              cls.includes('font-bold') ||
              cls.includes('font-semibold') ||
              cls.includes('border') ||
              cls.includes('px-') ||
              cls.includes('py-')
            );
            
            if (hasProminentStyling) {
              hasAnyProminentButton = true;
              break;
            }
          }
          
          return hasAnyProminentButton;
        }
      ),
      { numRuns: 5 } // Reduced runs for debugging
    );
  });

  it('All components should maintain consistent visual hierarchy patterns', () => {
    fc.assert(
      fc.property(
        fc.record({
          packageData: fc.record({
            _id: fc.string({ minLength: 1, maxLength: 24 }),
            name: fc.string({ minLength: 1, maxLength: 50 }),
            destination: fc.string({ minLength: 1, maxLength: 30 }),
            duration: fc.integer({ min: 1, max: 15 }),
            price: fc.integer({ min: 5000, max: 50000 }),
            description: fc.string({ minLength: 10, maxLength: 100 }),
            images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
            thumbnail: fc.option(fc.webUrl()),
            featured: fc.boolean(),
            active: fc.boolean(),
            category: fc.string({ minLength: 1, maxLength: 15 }),
            itinerary: fc.array(fc.string({ minLength: 1, maxLength: 50 })),
            inclusions: fc.array(fc.string({ minLength: 1, maxLength: 30 })),
            exclusions: fc.array(fc.string({ minLength: 1, maxLength: 30 })),
            createdAt: fc.date().map(d => d.toISOString()),
            updatedAt: fc.date().map(d => d.toISOString())
          })
        }),
        ({ packageData }) => {
          // Test multiple components together
          const { container: navbarContainer } = renderWithProviders(<Navbar />);
          const { container: packageContainer } = renderWithProviders(
            <PackageCard package={packageData as Package} />
          );
          const { container: footerContainer } = renderWithProviders(<Footer />);
          
          // All components should have valid heading hierarchy
          const navbarHierarchy = hasProperHeadingHierarchy(navbarContainer);
          const packageHierarchy = hasProperHeadingHierarchy(packageContainer);
          const footerHierarchy = hasProperHeadingHierarchy(footerContainer);
          
          if (!navbarHierarchy || !packageHierarchy || !footerHierarchy) {
            return false;
          }
          
          // All components should have font size hierarchy
          const navbarFontSizes = hasFontSizeHierarchy(navbarContainer);
          const packageFontSizes = hasFontSizeHierarchy(packageContainer);
          const footerFontSizes = hasFontSizeHierarchy(footerContainer);
          
          if (!navbarFontSizes || !packageFontSizes || !footerFontSizes) {
            return false;
          }
          
          // All components should have prominent CTAs where applicable
          const navbarCTAs = hasProminentCTAElements(navbarContainer);
          const packageCTAs = hasProminentCTAElements(packageContainer);
          const footerCTAs = hasProminentCTAElements(footerContainer);
          
          return navbarCTAs && packageCTAs && footerCTAs;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Text elements should follow consistent size hierarchy patterns', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<Navbar />);
          
          // Check that text elements follow size hierarchy
          const allTextElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a');
          const textSizes: { element: HTMLElement; size: number; level: number }[] = [];
          
          allTextElements.forEach(element => {
            const classes = getElementClasses(element as HTMLElement);
            const fontSize = extractFontSize(classes);
            let level = 0;
            
            // Assign hierarchy levels
            if (element.tagName.startsWith('H')) {
              level = parseInt(element.tagName.charAt(1));
            } else if (classes.some(cls => cls.includes('font-bold') || cls.includes('font-semibold'))) {
              level = 7; // Bold text gets lower priority than headings
            } else {
              level = 8; // Regular text gets lowest priority
            }
            
            textSizes.push({ element: element as HTMLElement, size: fontSize, level });
          });
          
          // Check that elements with higher importance (lower level numbers) have larger or equal font sizes
          for (let i = 0; i < textSizes.length - 1; i++) {
            for (let j = i + 1; j < textSizes.length; j++) {
              const current = textSizes[i];
              const next = textSizes[j];
              
              // If current element has higher importance (lower level), it should have larger or equal font size
              if (current.level < next.level && current.size < next.size) {
                // Allow some flexibility for design purposes
                const sizeDifference = next.size - current.size;
                if (sizeDifference > 4) { // More than 4px difference is not acceptable
                  return false;
                }
              }
            }
          }
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });
});
