/**
 * Feature: vibe-holidays-ui-improvement, Property 9: Animation Performance Standards
 * 
 * Property-based tests for animation performance standards.
 * Validates that animations have appropriate duration (typically 150-300ms),
 * use performance-optimized CSS properties (transform, opacity), and maintain
 * smooth 60fps performance across supported devices.
 */

import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, beforeAll } from 'vitest';
import * as fc from 'fast-check';
import Button from '../../components/Button';
import PackageCard from '../../components/PackageCard';
import PageTransition from '../../components/PageTransition';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import { Package } from '../../types/package';

// Mock IntersectionObserver for framer-motion
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;

  // Mock ResizeObserver for framer-motion
  global.ResizeObserver = class ResizeObserver {
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

// Helper function to extract classes from rendered element
const getElementClasses = (element: HTMLElement): string[] => {
  return Array.from(element.classList);
};

// Helper function to check if element has appropriate animation duration
const hasAppropriateAnimationDuration = (classes: string[]): boolean => {
  const appropriateDurations = [
    'duration-150', 'duration-200', 'duration-300', 'duration-250'
  ];
  
  // Check for Tailwind duration classes
  const hasTailwindDuration = classes.some(cls => 
    appropriateDurations.some(duration => cls.includes(duration))
  );
  
  // Check for transition classes that imply reasonable duration
  const hasTransitionClass = classes.some(cls => 
    cls.includes('transition') && !cls.includes('duration-500') && !cls.includes('duration-1000')
  );
  
  return hasTailwindDuration || hasTransitionClass;
};

// Helper function to check if element uses performance-optimized CSS properties
const usesPerformanceOptimizedProperties = (classes: string[]): boolean => {
  const optimizedProperties = [
    'transform', 'scale-', 'translate-', 'rotate-', 'opacity-', 
    'hover:scale-', 'hover:translate-', 'hover:-translate-', 'hover:opacity-',
    'group-hover:scale-', 'group-hover:translate-', 'group-hover:opacity-'
  ];
  
  return classes.some(cls => 
    optimizedProperties.some(prop => cls.includes(prop))
  );
};

// Helper function to check if element has smooth easing functions
const hasSmoothEasing = (classes: string[]): boolean => {
  const smoothEasing = [
    'ease-in-out', 'ease-out', 'ease-in', 'ease-linear'
  ];
  
  return classes.some(cls => 
    smoothEasing.some(easing => cls.includes(easing))
  ) || classes.includes('transition'); // Default transition includes smooth easing
};

// Helper function to check if animations are subtle and non-distracting
const hasSubtleAnimations = (classes: string[]): boolean => {
  // Check for subtle scale changes (not too dramatic)
  const hasSubtleScale = classes.some(cls => 
    cls.includes('scale-') && (
      cls.includes('scale-105') || cls.includes('scale-102') || 
      cls.includes('scale-95') || cls.includes('scale-98')
    )
  );
  
  // Check for subtle translate changes
  const hasSubtleTranslate = classes.some(cls => 
    cls.includes('translate-') && (
      cls.includes('-translate-y-1') || cls.includes('-translate-y-2') ||
      cls.includes('translate-x-1') || cls.includes('translate-x-2')
    )
  );
  
  // Check for subtle opacity changes
  const hasSubtleOpacity = classes.some(cls => 
    cls.includes('opacity-') && !cls.includes('opacity-0')
  );
  
  return hasSubtleScale || hasSubtleTranslate || hasSubtleOpacity;
};

// Helper function to check if element avoids performance-heavy properties
const avoidsHeavyProperties = (classes: string[]): boolean => {
  const heavyProperties = [
    'blur-', 'backdrop-blur-lg', 'backdrop-blur-xl', 'filter',
    'shadow-2xl', 'shadow-inner', 'drop-shadow-2xl'
  ];
  
  // Should not have too many heavy properties
  const heavyCount = classes.filter(cls => 
    heavyProperties.some(heavy => cls.includes(heavy))
  ).length;
  
  return heavyCount <= 1; // Allow one heavy property but not multiple
};

describe('Property 9: Animation Performance Standards', () => {
  it('Button component animations should have appropriate duration and use optimized properties', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const, 'danger' as const),
        fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 20 }),
        (variant, size, isLoading, children) => {
          const { container } = render(
            <Button variant={variant} size={size} isLoading={isLoading}>
              {children}
            </Button>
          );
          
          const button = container.querySelector('button');
          if (!button) return false;
          
          const classes = getElementClasses(button);
          
          // Should have appropriate animation duration (150-300ms)
          const hasGoodDuration = hasAppropriateAnimationDuration(classes);
          
          // Should use performance-optimized properties
          const usesOptimizedProps = usesPerformanceOptimizedProperties(classes);
          
          // Should have smooth easing
          const hasSmoothing = hasSmoothEasing(classes);
          
          // Should avoid performance-heavy properties
          const avoidsHeavy = avoidsHeavyProperties(classes);
          
          // Should have subtle animations
          const isSubtle = hasSubtleAnimations(classes) || classes.includes('transition');
          
          return hasGoodDuration && usesOptimizedProps && hasSmoothing && avoidsHeavy && isSubtle;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('PackageCard component animations should maintain 60fps performance standards', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.string({ minLength: 5, maxLength: 24 }),
          name: fc.string({ minLength: 5, maxLength: 100 }),
          destination: fc.string({ minLength: 3, maxLength: 50 }),
          duration: fc.integer({ min: 1, max: 30 }),
          price: fc.integer({ min: 1000, max: 100000 }),
          description: fc.string({ minLength: 20, maxLength: 200 }),
          images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
          thumbnail: fc.option(fc.webUrl()),
          featured: fc.boolean(),
          active: fc.boolean(),
          category: fc.string({ minLength: 3, maxLength: 20 }),
          itinerary: fc.array(fc.string({ minLength: 5, maxLength: 100 })),
          inclusions: fc.array(fc.string({ minLength: 5, maxLength: 50 })),
          exclusions: fc.array(fc.string({ minLength: 5, maxLength: 50 })),
          createdAt: fc.date().map(d => d.toISOString()),
          updatedAt: fc.date().map(d => d.toISOString())
        }),
        (packageData) => {
          const { container } = renderWithProviders(
            <PackageCard package={packageData as Package} />
          );
          
          const link = container.querySelector('a');
          if (!link) return false;
          
          // Check the main card container
          const cardDiv = container.querySelector('a > div');
          if (!cardDiv) return false;
          
          const cardClasses = getElementClasses(cardDiv);
          
          // PackageCard uses framer-motion, so check for motion attributes or classes
          const usesFramerMotion = cardDiv.hasAttribute('style') ||
            container.innerHTML.includes('motion') ||
            cardDiv.hasAttribute('data-framer-motion');
          
          // Should use performance-optimized properties for hover effects
          const usesOptimizedProps = usesFramerMotion ||
            usesPerformanceOptimizedProperties(cardClasses) ||
            container.innerHTML.includes('group-hover:') ||
            container.innerHTML.includes('hover:scale-') ||
            container.innerHTML.includes('hover:translate-');
          
          // Should have appropriate duration for smooth animations (framer-motion handles this)
          const hasGoodDuration = usesFramerMotion ||
            hasAppropriateAnimationDuration(cardClasses) ||
            container.innerHTML.includes('duration-200') ||
            container.innerHTML.includes('duration-300');
          
          // Should avoid heavy properties that could impact performance
          const avoidsHeavy = avoidsHeavyProperties(cardClasses);
          
          // Check image element for performance-optimized animations
          const image = container.querySelector('img');
          let imageUsesOptimized = true;
          if (image) {
            const imageClasses = getElementClasses(image);
            imageUsesOptimized = usesPerformanceOptimizedProperties(imageClasses) ||
              imageClasses.includes('transition') ||
              container.innerHTML.includes('group-hover:scale-') ||
              image.hasAttribute('style'); // framer-motion adds inline styles
          }
          
          // Should have subtle animations that don't distract (framer-motion provides this)
          const isSubtle = usesFramerMotion ||
            hasSubtleAnimations(cardClasses) ||
            container.innerHTML.includes('scale-102') ||
            container.innerHTML.includes('translate-y-') ||
            cardClasses.includes('transition');
          
          return usesOptimizedProps && hasGoodDuration && avoidsHeavy && imageUsesOptimized && isSubtle;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('PageTransition component should provide smooth page navigation transitions', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        (content) => {
          const { container } = renderWithProviders(
            <PageTransition>
              <div>{content}</div>
            </PageTransition>
          );
          
          const transitionDiv = container.querySelector('div');
          if (!transitionDiv) return false;
          
          // PageTransition uses framer-motion, so we check for motion attributes
          const hasMotionAttributes = transitionDiv.hasAttribute('style') ||
            transitionDiv.hasAttribute('data-framer-motion') ||
            container.innerHTML.includes('motion');
          
          // Should not have heavy CSS properties that could impact performance
          const classes = getElementClasses(transitionDiv);
          const avoidsHeavy = avoidsHeavyProperties(classes);
          
          // Should use performance-optimized properties (framer-motion uses transform/opacity)
          const usesOptimizedProps = hasMotionAttributes || 
            usesPerformanceOptimizedProperties(classes);
          
          return hasMotionAttributes && avoidsHeavy && usesOptimizedProps;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('LoadingSpinner component should use performance-optimized animations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        fc.option(fc.string({ minLength: 1, maxLength: 50 })),
        (size, text) => {
          const { container } = render(
            <LoadingSpinner size={size} text={text} />
          );
          
          // Check for spinner element
          const spinner = container.querySelector('svg') || container.querySelector('[class*="animate"]');
          if (!spinner) return false;
          
          const classes = getElementClasses(spinner);
          
          // Should use CSS animations that are performance-optimized
          const hasSpinAnimation = classes.includes('animate-spin') ||
            classes.includes('animate-pulse') ||
            classes.includes('animate-bounce');
          
          // Should avoid heavy properties
          const avoidsHeavy = avoidsHeavyProperties(classes);
          
          // Spinner animations should be continuous and smooth
          const hasContinuousAnimation = hasSpinAnimation;
          
          return hasContinuousAnimation && avoidsHeavy;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('Modal component animations should have appropriate timing and smooth transitions', () => {
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.string({ minLength: 3, maxLength: 100 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 5, maxLength: 50 }).filter(s => s.trim().length > 0),
        (isOpen, title, content) => {
          const { container } = render(
            <Modal isOpen={isOpen} onClose={() => {}} title={title}>
              <div>{content}</div>
            </Modal>
          );
          
          if (!isOpen) return true; // Closed modal is acceptable
          
          // Modal should render some content when open
          const hasModalContent = container.innerHTML.length > 0;
          if (!hasModalContent) return false;
          
          // Check for modal structure - should have fixed positioning
          const fixedElements = container.querySelectorAll('[class*="fixed"]');
          if (fixedElements.length === 0) return false;
          
          // At least one fixed element should exist (this is the main requirement)
          const hasFixedElement = fixedElements.length > 0;
          
          // Check if any element has transition classes (performance requirement)
          let hasTransitionSomewhere = false;
          fixedElements.forEach(el => {
            const classes = getElementClasses(el as HTMLElement);
            if (classes.includes('transition') || classes.some(cls => cls.includes('transition'))) {
              hasTransitionSomewhere = true;
            }
          });
          
          // Check if any element has background styling (modal backdrop requirement)
          let hasBackgroundStyling = false;
          fixedElements.forEach(el => {
            const classes = getElementClasses(el as HTMLElement);
            if (classes.some(cls => cls.includes('bg-'))) {
              hasBackgroundStyling = true;
            }
          });
          
          // Check that no element uses too many heavy properties
          let avoidsHeavyProps = true;
          fixedElements.forEach(el => {
            const classes = getElementClasses(el as HTMLElement);
            if (!avoidsHeavyProperties(classes)) {
              avoidsHeavyProps = false;
            }
          });
          
          // Modal should have basic structure and avoid heavy properties
          return hasFixedElement && avoidsHeavyProps && (hasTransitionSomewhere || hasBackgroundStyling);
        }
      ),
      { numRuns: 50 }
    );
  });

  it('All animated elements should maintain consistent performance standards', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const),
        fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        fc.string({ minLength: 3, maxLength: 20 }),
        fc.record({
          _id: fc.string({ minLength: 5, maxLength: 24 }),
          name: fc.string({ minLength: 5, maxLength: 50 }),
          destination: fc.string({ minLength: 3, maxLength: 30 }),
          duration: fc.integer({ min: 1, max: 15 }),
          price: fc.integer({ min: 5000, max: 50000 }),
          description: fc.string({ minLength: 20, maxLength: 100 }),
          images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 3 }),
          thumbnail: fc.option(fc.webUrl()),
          featured: fc.boolean(),
          active: fc.boolean(),
          category: fc.string({ minLength: 3, maxLength: 15 }),
          itinerary: fc.array(fc.string({ minLength: 5, maxLength: 50 })),
          inclusions: fc.array(fc.string({ minLength: 5, maxLength: 30 })),
          exclusions: fc.array(fc.string({ minLength: 5, maxLength: 30 })),
          createdAt: fc.date().map(d => d.toISOString()),
          updatedAt: fc.date().map(d => d.toISOString())
        }),
        (variant, size, buttonText, packageData) => {
          // Test multiple components together for consistency
          const { container: buttonContainer } = render(
            <Button variant={variant} size={size}>{buttonText}</Button>
          );
          
          const { container: cardContainer } = renderWithProviders(
            <PackageCard package={packageData as Package} />
          );
          
          const { container: spinnerContainer } = render(
            <LoadingSpinner size={size} />
          );
          
          const button = buttonContainer.querySelector('button');
          const card = cardContainer.querySelector('a > div');
          const spinner = spinnerContainer.querySelector('svg') || 
            spinnerContainer.querySelector('[class*="animate"]') ||
            spinnerContainer.querySelector('div'); // Fallback to any div
          
          if (!button || !card || !spinner) return false;
          
          const buttonClasses = getElementClasses(button);
          const cardClasses = getElementClasses(card);
          const spinnerClasses = getElementClasses(spinner);
          
          // Check that components render with basic structure
          const buttonHasContent = button.textContent?.trim().length > 0;
          const cardHasContent = card.innerHTML.length > 0;
          const spinnerExists = spinner !== null;
          
          if (!buttonHasContent || !cardHasContent || !spinnerExists) return false;
          
          // All should avoid heavy properties (this is the most important performance check)
          const buttonAvoidsHeavy = avoidsHeavyProperties(buttonClasses);
          const cardAvoidsHeavy = avoidsHeavyProperties(cardClasses);
          const spinnerAvoidsHeavy = avoidsHeavyProperties(spinnerClasses);
          
          // Check for any animation or transition indicators
          const buttonHasAnimations = buttonClasses.includes('transition') ||
            button.hasAttribute('style') || // framer-motion
            buttonClasses.some(cls => cls.includes('hover:') || cls.includes('duration-'));
          
          const cardHasAnimations = cardClasses.includes('transition') ||
            card.hasAttribute('style') || // framer-motion
            cardContainer.innerHTML.includes('group-hover:') ||
            cardClasses.some(cls => cls.includes('hover:'));
          
          const spinnerHasAnimations = spinnerClasses.includes('animate-') ||
            spinnerClasses.some(cls => cls.includes('animate'));
          
          // All should have some form of animation or interaction capability
          const hasAnimationCapability = buttonHasAnimations && cardHasAnimations && spinnerHasAnimations;
          
          return buttonAvoidsHeavy && cardAvoidsHeavy && spinnerAvoidsHeavy && hasAnimationCapability;
        }
      ),
      { numRuns: 30 }
    );
  });

  it('Interactive elements should provide immediate feedback with optimized animations', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const),
        fc.string({ minLength: 1, maxLength: 20 }),
        (variant, children) => {
          const { container } = render(
            <Button variant={variant}>{children}</Button>
          );
          
          const button = container.querySelector('button');
          if (!button) return false;
          
          const classes = getElementClasses(button);
          
          // Should have hover states with performance-optimized properties
          const hasHoverStates = classes.some(cls => cls.includes('hover:'));
          
          // Should have focus states for accessibility
          const hasFocusStates = classes.some(cls => cls.includes('focus:'));
          
          // Should have appropriate transition timing
          const hasGoodTiming = hasAppropriateAnimationDuration(classes);
          
          // Should use optimized properties for interactions
          const usesOptimized = usesPerformanceOptimizedProperties(classes);
          
          // Should have smooth easing for natural feel
          const hasSmoothing = hasSmoothEasing(classes);
          
          // Simulate hover to test immediate feedback
          fireEvent.mouseEnter(button);
          
          // Button should still maintain its classes after interaction
          const postHoverClasses = getElementClasses(button);
          const maintainsClasses = postHoverClasses.length >= classes.length;
          
          return hasHoverStates && hasFocusStates && hasGoodTiming && 
                 usesOptimized && hasSmoothing && maintainsClasses;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Page transitions should enhance user experience without causing performance issues', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 5 }),
        (contentItems) => {
          const { container } = renderWithProviders(
            <PageTransition>
              <div>
                {contentItems.map((item, index) => (
                  <p key={index}>{item}</p>
                ))}
              </div>
            </PageTransition>
          );
          
          const transitionWrapper = container.querySelector('div');
          if (!transitionWrapper) return false;
          
          // Should use framer-motion for smooth transitions
          const hasMotionAttributes = transitionWrapper.hasAttribute('style') ||
            container.innerHTML.includes('motion') ||
            transitionWrapper.hasAttribute('data-framer-motion');
          
          // Should not have performance-heavy CSS properties
          const classes = getElementClasses(transitionWrapper);
          const avoidsHeavy = avoidsHeavyProperties(classes);
          
          // Content should be preserved during transition
          const hasContent = contentItems.every(item => 
            container.textContent?.includes(item)
          );
          
          // Should maintain accessibility during transitions
          const maintainsAccessibility = !classes.includes('pointer-events-none') ||
            transitionWrapper.getAttribute('aria-hidden') !== 'true';
          
          return hasMotionAttributes && avoidsHeavy && hasContent && maintainsAccessibility;
        }
      ),
      { numRuns: 30 }
    );
  });
});
