import { describe, it } from 'vitest';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Button from '../../components/Button';
import Card from '../../components/Card';
import PackageCard from '../../components/PackageCard';
import Navbar from '../../components/Navbar';
import { Package } from '../../types/package';

// **Feature: vibe-holidays-ui-improvement, Property 1: Design System Consistency**

describe('Property 1: Design System Consistency', () => {
  // Helper function to wrap components with router for testing
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  // Helper function to extract classes from rendered element
  const getElementClasses = (element: HTMLElement): string[] => {
    return Array.from(element.classList);
  };

  // Helper function to check if classes contain design system tokens
  const hasDesignSystemColors = (classes: string[]): boolean => {
    const colorTokens = [
      'primary-', 'secondary-', 'neutral-', 'success-', 'error-',
      'bg-white', 'text-white', 'text-neutral-', 'text-primary-', 'text-secondary-',
      'border-primary-', 'border-neutral-', 'hover:bg-', 'hover:text-',
      'focus:ring-', 'bg-gradient-', 'text-transparent'
    ];
    
    return classes.some(cls => 
      colorTokens.some(token => cls.includes(token))
    );
  };

  const hasConsistentSpacing = (classes: string[]): boolean => {
    const spacingTokens = [
      'p-', 'px-', 'py-', 'pt-', 'pb-', 'pl-', 'pr-',
      'm-', 'mx-', 'my-', 'mt-', 'mb-', 'ml-', 'mr-',
      'space-', 'gap-'
    ];
    
    return classes.some(cls => 
      spacingTokens.some(token => cls.includes(token))
    );
  };

  const hasConsistentTypography = (classes: string[]): boolean => {
    const typographyTokens = [
      'text-', 'font-', 'leading-', 'tracking-'
    ];
    
    return classes.some(cls => 
      typographyTokens.some(token => cls.includes(token))
    );
  };

  it('Button component should consistently use design system tokens', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'outline' as const, 'danger' as const),
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
          
          // Should have design system colors
          const hasColors = hasDesignSystemColors(classes);
          
          // Should have consistent spacing
          const hasSpacing = hasConsistentSpacing(classes);
          
          // Should have typography tokens
          const hasTypography = hasConsistentTypography(classes);
          
          // Should have transition classes for consistency
          const hasTransitions = classes.some(cls => 
            cls.includes('transition') || cls.includes('duration')
          );
          
          // Should have focus states for accessibility
          const hasFocusStates = classes.some(cls => 
            cls.includes('focus:')
          );
          
          return hasColors && hasSpacing && hasTypography && hasTransitions && hasFocusStates;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Card component should consistently use design system tokens', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('none' as const, 'sm' as const, 'md' as const, 'lg' as const),
        fc.boolean(),
        fc.string({ minLength: 1, maxLength: 50 }),
        (padding, hover, content) => {
          const { container } = render(
            <Card padding={padding} hover={hover}>
              <div>{content}</div>
            </Card>
          );
          
          const card = container.firstChild as HTMLElement;
          if (!card) return false;
          
          const classes = getElementClasses(card);
          
          // Should have consistent background colors
          const hasBackground = classes.includes('bg-white');
          
          // Should have consistent spacing based on padding prop
          const hasSpacing = padding === 'none' || hasConsistentSpacing(classes);
          
          // Should have shadow tokens
          const hasShadow = classes.some(cls => cls.includes('shadow'));
          
          // Should have border radius consistency
          const hasBorderRadius = classes.some(cls => cls.includes('rounded'));
          
          // If hover is true, should have hover effects
          const hasHoverEffects = !hover || classes.some(cls => 
            cls.includes('hover:') || cls.includes('transition')
          );
          
          return hasBackground && hasSpacing && hasShadow && hasBorderRadius && hasHoverEffects;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('PackageCard component should consistently use design system tokens', () => {
    fc.assert(
      fc.property(
        fc.record({
          _id: fc.hexaString({ minLength: 24, maxLength: 24 }),
          name: fc.string({ minLength: 5, maxLength: 100 }).filter(s => s.trim().length > 0),
          destination: fc.string({ minLength: 3, maxLength: 50 }).filter(s => s.trim().length > 0),
          duration: fc.integer({ min: 1, max: 30 }),
          price: fc.integer({ min: 1000, max: 100000 }),
          description: fc.string({ minLength: 20, maxLength: 200 }).filter(s => s.trim().length > 10),
          images: fc.array(fc.webUrl(), { minLength: 1, maxLength: 5 }),
          thumbnail: fc.option(fc.webUrl()),
          featured: fc.boolean(),
          active: fc.boolean(),
          category: fc.string({ minLength: 3, maxLength: 20 }).filter(s => s.trim().length > 0),
          itinerary: fc.array(fc.string({ minLength: 10, maxLength: 100 })),
          inclusions: fc.array(fc.string({ minLength: 5, maxLength: 50 })),
          exclusions: fc.array(fc.string({ minLength: 5, maxLength: 50 })),
          createdAt: fc.date().map(d => d.toISOString()),
          updatedAt: fc.date().map(d => d.toISOString())
        }),
        (packageData) => {
          const { container } = renderWithRouter(
            <PackageCard package={packageData as Package} />
          );
          
          const card = container.querySelector('a > div') as HTMLElement;
          if (!card) return false;
          
          const classes = getElementClasses(card);
          
          // Should use Card component which has consistent styling
          const hasCardStyling = classes.some(cls => cls.includes('bg-white')) && 
                                classes.some(cls => cls.includes('shadow')) &&
                                classes.some(cls => cls.includes('rounded'));
          
          // Should have hover effects for interactivity
          const hasHoverEffects = classes.some(cls => 
            cls.includes('hover:') || cls.includes('transition')
          );
          
          // Check for design system color usage in the component
          const allElements = container.querySelectorAll('*');
          let hasDesignSystemUsage = false;
          
          allElements.forEach(element => {
            const elementClasses = getElementClasses(element as HTMLElement);
            if (hasDesignSystemColors(elementClasses)) {
              hasDesignSystemUsage = true;
            }
          });
          
          return hasCardStyling && hasHoverEffects && hasDesignSystemUsage;
        }
      ),
      { numRuns: 30 } // Reduced runs for complex component
    );
  });

  it('Navbar component should consistently use design system tokens', () => {
    fc.assert(
      fc.property(
        fc.constant(true), // Simple property to test navbar consistency
        () => {
          const { container } = renderWithRouter(<Navbar />);
          
          const nav = container.querySelector('nav');
          if (!nav) return false;
          
          const classes = getElementClasses(nav);
          
          // Should have consistent background (bg-white or backdrop-blur)
          const hasBackground = classes.some(cls => cls.includes('bg-white'));
          
          // Should have shadow for elevation
          const hasShadow = classes.some(cls => cls.includes('shadow'));
          
          // Check for design system usage throughout the component
          const allElements = container.querySelectorAll('*');
          let hasDesignSystemUsage = false;
          let hasTransitions = false;
          
          allElements.forEach(element => {
            const elementClasses = getElementClasses(element as HTMLElement);
            if (hasDesignSystemColors(elementClasses)) {
              hasDesignSystemUsage = true;
            }
            if (elementClasses.some(cls => cls.includes('transition'))) {
              hasTransitions = true;
            }
          });
          
          // Check that the component has responsive design tokens
          const navContent = container.innerHTML;
          const hasResponsiveTokens = navContent.includes('md:') || 
                                    navContent.includes('sm:') ||
                                    navContent.includes('lg:');
          
          return hasBackground && hasShadow && hasDesignSystemUsage && hasTransitions && hasResponsiveTokens;
        }
      ),
      { numRuns: 10 } // Reduced runs for static component
    );
  });

  it('All components should use consistent color palette from design system', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'outline' as const, 'danger' as const),
        fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        (variant, size) => {
          const { container: buttonContainer } = render(
            <Button variant={variant} size={size}>Test</Button>
          );
          
          const { container: cardContainer } = render(
            <Card padding={size}>Test Content</Card>
          );
          
          const button = buttonContainer.querySelector('button');
          const card = cardContainer.querySelector('div');
          
          if (!button || !card) return false;
          
          const buttonClasses = getElementClasses(button);
          const cardClasses = getElementClasses(card);
          
          // Both should use consistent color tokens
          const buttonHasColors = hasDesignSystemColors(buttonClasses);
          const cardHasColors = cardClasses.includes('bg-white'); // Card uses white background consistently
          
          // Both should use consistent spacing scale
          const buttonHasSpacing = hasConsistentSpacing(buttonClasses);
          const cardHasSpacing = hasConsistentSpacing(cardClasses);
          
          return buttonHasColors && cardHasColors && buttonHasSpacing && cardHasSpacing;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Components should maintain consistent styling patterns across different props', () => {
    fc.assert(
      fc.property(
        fc.record({
          buttonVariant: fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const, 'danger' as const),
          buttonSize: fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
          cardPadding: fc.constantFrom('none' as const, 'sm' as const, 'md' as const, 'lg' as const),
          cardHover: fc.boolean()
        }),
        ({ buttonVariant, buttonSize, cardPadding, cardHover }) => {
          const { container: buttonContainer } = render(
            <Button variant={buttonVariant} size={buttonSize}>Test Button</Button>
          );
          
          const { container: cardContainer } = render(
            <Card padding={cardPadding} hover={cardHover}>
              <Button variant={buttonVariant} size={buttonSize}>Card Button</Button>
            </Card>
          );
          
          const standaloneButton = buttonContainer.querySelector('button');
          const cardButton = cardContainer.querySelector('button');
          
          if (!standaloneButton || !cardButton) return false;
          
          const standaloneClasses = getElementClasses(standaloneButton);
          const cardButtonClasses = getElementClasses(cardButton);
          
          // Both buttons should have design system colors
          const standaloneHasColors = hasDesignSystemColors(standaloneClasses);
          const cardButtonHasColors = hasDesignSystemColors(cardButtonClasses);
          
          // Both should have consistent transition classes
          const bothHaveTransitions = standaloneClasses.some(cls => cls.includes('transition')) &&
                                    cardButtonClasses.some(cls => cls.includes('transition'));
          
          // Both should have consistent spacing
          const bothHaveSpacing = hasConsistentSpacing(standaloneClasses) &&
                                hasConsistentSpacing(cardButtonClasses);
          
          return standaloneHasColors && cardButtonHasColors && bothHaveTransitions && bothHaveSpacing;
        }
      ),
      { numRuns: 50 }
    );
  });
});
