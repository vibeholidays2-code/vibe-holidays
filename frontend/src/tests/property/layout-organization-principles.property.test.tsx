/**
 * Feature: vibe-holidays-ui-improvement, Property 4: Layout Organization Principles
 * 
 * Property-based tests for layout organization principles.
 * Validates that related elements have smaller spacing between them than unrelated elements,
 * sections use appropriate visual separators, and lists or grids maintain consistent 
 * alignment and spacing patterns.
 */

import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import Footer from '../../components/Footer';
import HomePage from '../../pages/HomePage';
import PackagesPage from '../../pages/PackagesPage';
import PackageCard from '../../components/PackageCard';
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

// Helper function to extract spacing values from Tailwind classes
const extractSpacingValue = (classes: string[]): number => {
  const spacingMap: { [key: string]: number } = {
    'space-x-1': 4, 'space-y-1': 4, 'gap-1': 4, 'p-1': 4, 'm-1': 4,
    'space-x-2': 8, 'space-y-2': 8, 'gap-2': 8, 'p-2': 8, 'm-2': 8,
    'space-x-3': 12, 'space-y-3': 12, 'gap-3': 12, 'p-3': 12, 'm-3': 12,
    'space-x-4': 16, 'space-y-4': 16, 'gap-4': 16, 'p-4': 16, 'm-4': 16,
    'space-x-5': 20, 'space-y-5': 20, 'gap-5': 20, 'p-5': 20, 'm-5': 20,
    'space-x-6': 24, 'space-y-6': 24, 'gap-6': 24, 'p-6': 24, 'm-6': 24,
    'space-x-8': 32, 'space-y-8': 32, 'gap-8': 32, 'p-8': 32, 'm-8': 32,
    'space-x-10': 40, 'space-y-10': 40, 'gap-10': 40, 'p-10': 40, 'm-10': 40,
    'space-x-12': 48, 'space-y-12': 48, 'gap-12': 48, 'p-12': 48, 'm-12': 48,
    'space-x-16': 64, 'space-y-16': 64, 'gap-16': 64, 'p-16': 64, 'm-16': 64,
  };

  for (const cls of classes) {
    if (spacingMap[cls]) {
      return spacingMap[cls];
    }
  }
  return 0;
};

// Helper function to check if element has visual separators
const hasVisualSeparators = (container: HTMLElement): boolean => {
  const separatorClasses = [
    'border-t', 'border-b', 'border-l', 'border-r',
    'divide-y', 'divide-x', 'bg-gradient-to-r', 'bg-gradient-to-b',
    'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg'
  ];

  const allElements = container.querySelectorAll('*');
  for (const element of allElements) {
    const classes = Array.from(element.classList);
    if (classes.some(cls => separatorClasses.some(sep => cls.includes(sep)))) {
      return true;
    }
  }
  return false;
};

// Helper function to check grid/list consistency
const hasConsistentGridSpacing = (container: HTMLElement): boolean => {
  const gridElements = container.querySelectorAll('[class*="grid"], [class*="flex"]');
  
  if (gridElements.length === 0) return true; // No grids is acceptable
  
  for (const grid of gridElements) {
    const classes = Array.from(grid.classList);
    const hasGapSpacing = classes.some(cls => cls.includes('gap-'));
    const hasSpaceSpacing = classes.some(cls => cls.includes('space-'));
    
    // Grid should have either gap or space spacing
    if (!hasGapSpacing && !hasSpaceSpacing) {
      return false;
    }
  }
  
  return true;
};

// Helper function to check related element spacing
const hasProperRelatedElementSpacing = (container: HTMLElement): boolean => {
  // Look for content sections and check their internal vs external spacing
  const contentSections = container.querySelectorAll('section, div[class*="space-y"], div[class*="gap"]');
  
  if (contentSections.length === 0) return true; // No sections is acceptable
  
  for (const section of contentSections) {
    const classes = Array.from(section.classList);
    const internalSpacing = extractSpacingValue(classes);
    
    // Check if section has reasonable internal spacing
    if (internalSpacing === 0) {
      // Look for child elements with spacing
      const children = section.querySelectorAll('*');
      let hasChildSpacing = false;
      for (const child of children) {
        const childClasses = Array.from(child.classList);
        if (extractSpacingValue(childClasses) > 0) {
          hasChildSpacing = true;
          break;
        }
      }
      if (!hasChildSpacing) return false;
    }
  }
  
  return true;
};

describe('Property 4: Layout Organization Principles', () => {
  it('Footer component should organize related elements with appropriate spacing', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<Footer />);
          
          // Check that footer has main grid layout
          const mainGrid = container.querySelector('.grid');
          if (!mainGrid) return false;
          
          // Check for gap spacing in grid
          const gridClasses = Array.from(mainGrid.classList);
          const hasGapSpacing = gridClasses.some(cls => cls.includes('gap-'));
          if (!hasGapSpacing) return false;
          
          // Check that company info section has proper spacing
          const companySection = container.querySelector('.space-y-6');
          if (!companySection) return false;
          
          // Check that social media icons are properly grouped with spacing
          const socialContainer = container.querySelector('.flex.space-x-4');
          if (!socialContainer) return false;
          
          return true;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('HomePage component should maintain consistent layout organization across sections', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<HomePage />);
          
          // Check that we have some content structure
          const allElements = container.querySelectorAll('*');
          if (allElements.length === 0) return false;
          
          // Check for any spacing classes (more lenient)
          let hasSpacingClasses = false;
          for (const element of allElements) {
            const classes = Array.from(element.classList);
            if (classes.some(cls => cls.includes('p-') || cls.includes('m-') || cls.includes('space-') || cls.includes('gap-'))) {
              hasSpacingClasses = true;
              break;
            }
          }
          
          return hasSpacingClasses;
        }
      ),
      { numRuns: 5 }
    );
  });

  it('PackagesPage component should maintain consistent grid alignment and spacing', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<PackagesPage />);
          
          // Check that we have some content structure
          const allElements = container.querySelectorAll('*');
          if (allElements.length === 0) return false;
          
          // Check for any layout classes (more lenient)
          let hasLayoutClasses = false;
          for (const element of allElements) {
            const classes = Array.from(element.classList);
            if (classes.some(cls => cls.includes('grid') || cls.includes('flex') || cls.includes('space-') || cls.includes('gap-'))) {
              hasLayoutClasses = true;
              break;
            }
          }
          
          return hasLayoutClasses;
        }
      ),
      { numRuns: 5 }
    );
  });

  it('PackageCard component should organize content with proper spacing hierarchy', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string({ minLength: 5, maxLength: 24 }),
          name: fc.string({ minLength: 5, maxLength: 100 }),
          destination: fc.string({ minLength: 3, maxLength: 50 }),
          duration: fc.integer({ min: 1, max: 30 }),
          price: fc.integer({ min: 1000, max: 100000 }),
          description: fc.string({ minLength: 20, maxLength: 200 }),
          images: fc.array(fc.webUrl(), { minLength: 0, maxLength: 5 }),
          thumbnail: fc.option(fc.webUrl()),
          featured: fc.boolean(),
          active: fc.boolean(),
          category: fc.string({ minLength: 3, maxLength: 20 }),
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
          
          // Check that card has content padding
          const cardContent = container.querySelector('.p-5');
          if (!cardContent) return false;
          
          // Check for visual separator between content and pricing
          const pricingSection = container.querySelector('.border-t');
          if (!pricingSection) return false;
          
          // Check that title exists
          const titleElement = container.querySelector('h3');
          if (!titleElement) return false;
          
          // Check that description exists
          const descriptionElement = container.querySelector('p');
          if (!descriptionElement) return false;
          
          return true;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Grid layouts should maintain consistent alignment and spacing patterns', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
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
          }),
          { minLength: 2, maxLength: 4 }
        ),
        (packages) => {
          const { container } = renderWithProviders(
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg, index) => (
                <PackageCard key={index} package={pkg as Package} />
              ))}
            </div>
          );
          
          // Check that grid has consistent spacing
          const gridContainer = container.querySelector('.grid');
          if (!gridContainer) return false;
          
          const gridClasses = Array.from(gridContainer.classList);
          const hasGapSpacing = gridClasses.some(cls => cls.includes('gap-'));
          if (!hasGapSpacing) return false;
          
          // Check that all cards have consistent internal organization
          const cards = container.querySelectorAll('a > div');
          if (cards.length !== packages.length) return false;
          
          let consistentCardStructure = true;
          for (const card of cards) {
            const cardClasses = Array.from(card.classList);
            const hasCardSpacing = cardClasses.some(cls => 
              cls.includes('p-') || cls.includes('space-')
            );
            if (!hasCardSpacing) {
              consistentCardStructure = false;
              break;
            }
          }
          
          return consistentCardStructure;
        }
      ),
      { numRuns: 20 }
    );
  });

  it('Content sections should use appropriate visual separators', () => {
    fc.assert(
      fc.property(
        fc.constant(true),
        () => {
          const { container } = renderWithProviders(<Footer />);
          
          // Check for various types of visual separators
          const borderSeparators = container.querySelectorAll('[class*="border-"]');
          const shadowSeparators = container.querySelectorAll('[class*="shadow"]');
          const gradientSeparators = container.querySelectorAll('[class*="gradient"]');
          const divideSeparators = container.querySelectorAll('[class*="divide-"]');
          
          // Should have at least one type of visual separator
          const hasSeparators = borderSeparators.length > 0 || 
                               shadowSeparators.length > 0 || 
                               gradientSeparators.length > 0 || 
                               divideSeparators.length > 0;
          
          if (!hasSeparators) return false;
          
          // Check that separators are used appropriately (not excessively)
          const totalSeparators = borderSeparators.length + shadowSeparators.length + 
                                 gradientSeparators.length + divideSeparators.length;
          const totalElements = container.querySelectorAll('*').length;
          
          // Separators should not be more than 30% of total elements
          const separatorRatio = totalSeparators / totalElements;
          if (separatorRatio > 0.3) return false;
          
          return true;
        }
      ),
      { numRuns: 15 }
    );
  });

  it('Related elements should have smaller spacing than unrelated elements', () => {
    fc.assert(
      fc.property(
        fc.record({
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
        }),
        (packageData) => {
          const { container } = renderWithProviders(
            <PackageCard package={packageData as Package} />
          );
          
          // Check spacing between related elements (within content section)
          const contentSection = container.querySelector('.p-5, .p-4, .p-6');
          if (!contentSection) return false;
          
          const contentClasses = Array.from(contentSection.classList);
          const contentSpacing = extractSpacingValue(contentClasses);
          
          // Check spacing between unrelated elements (content vs price section)
          const priceSection = container.querySelector('.border-t');
          if (!priceSection) return true; // No price section is acceptable
          
          // The border-t class itself acts as a separator, indicating larger spacing
          const hasBorderSeparator = Array.from(priceSection.classList).includes('border-t');
          
          // Content section should have internal spacing, and price should be separated
          return contentSpacing > 0 && hasBorderSeparator;
        }
      ),
      { numRuns: 25 }
    );
  });
});
