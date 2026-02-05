import { describe, it } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Textarea from '../../components/Textarea';
import PackageCard from '../../components/PackageCard';
import Navbar from '../../components/Navbar';
import { Package } from '../../types/package';

// **Feature: vibe-holidays-ui-improvement, Property 2: Interactive Element Feedback**

describe('Property 2: Interactive Element Feedback', () => {
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

  // Helper function to check if element has hover feedback classes
  const hasHoverFeedback = (classes: string[]): boolean => {
    const hoverTokens = [
      'hover:bg-', 'hover:text-', 'hover:border-', 'hover:shadow-',
      'hover:scale-', 'hover:-translate-y-', 'hover:translate-x-',
      'group-hover:', 'hover:opacity-'
    ];
    
    return classes.some(cls => 
      hoverTokens.some(token => cls.includes(token))
    );
  };

  // Helper function to check if element has transition classes
  const hasTransitions = (classes: string[]): boolean => {
    const transitionTokens = [
      'transition', 'duration-', 'ease-', 'animate-'
    ];
    
    return classes.some(cls => 
      transitionTokens.some(token => cls.includes(token))
    );
  };

  // Helper function to check if element has focus states
  const hasFocusStates = (classes: string[]): boolean => {
    const focusTokens = [
      'focus:outline-', 'focus:ring-', 'focus:border-', 'focus:bg-'
    ];
    
    return classes.some(cls => 
      focusTokens.some(token => cls.includes(token))
    );
  };

  // Helper function to check if element has active/pressed states
  const hasActiveStates = (classes: string[]): boolean => {
    const activeTokens = [
      'active:scale-', 'active:bg-', 'active:text-', 'active:transform'
    ];
    
    return classes.some(cls => 
      activeTokens.some(token => cls.includes(token))
    );
  };

  it('Button component should provide immediate visual feedback on hover', () => {
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
          
          // Should have hover feedback
          const hasHover = hasHoverFeedback(classes);
          
          // Should have smooth transitions
          const hasTransition = hasTransitions(classes);
          
          // Should have focus states for accessibility
          const hasFocus = hasFocusStates(classes);
          
          // Should have active/pressed states
          const hasActive = hasActiveStates(classes);
          
          return hasHover && hasTransition && hasFocus && hasActive;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Form input elements should provide appropriate transition effects', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.option(fc.string({ minLength: 1, maxLength: 50 })),
        fc.option(fc.string({ minLength: 1, maxLength: 100 })),
        fc.boolean(),
        (label, error, helperText, required) => {
          const { container: inputContainer } = render(
            <Input 
              label={label} 
              error={error} 
              helperText={helperText} 
              required={required}
            />
          );
          
          const { container: textareaContainer } = render(
            <Textarea 
              label={label} 
              error={error} 
              helperText={helperText} 
              required={required}
            />
          );
          
          const input = inputContainer.querySelector('input');
          const textarea = textareaContainer.querySelector('textarea');
          
          if (!input || !textarea) return false;
          
          const inputClasses = getElementClasses(input);
          const textareaClasses = getElementClasses(textarea);
          
          // Both should have focus states
          const inputHasFocus = hasFocusStates(inputClasses);
          const textareaHasFocus = hasFocusStates(textareaClasses);
          
          // Both should have transitions
          const inputHasTransition = hasTransitions(inputClasses);
          const textareaHasTransition = hasTransitions(textareaClasses);
          
          // Both should have proper border states for error/normal
          const inputHasBorderStates = inputClasses.some(cls => 
            cls.includes('border-') && (cls.includes('gray-') || cls.includes('red-'))
          );
          const textareaHasBorderStates = textareaClasses.some(cls => 
            cls.includes('border-') && (cls.includes('gray-') || cls.includes('red-'))
          );
          
          return inputHasFocus && textareaHasFocus && 
                 inputHasTransition && textareaHasTransition &&
                 inputHasBorderStates && textareaHasBorderStates;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Select component should provide consistent interactive feedback', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.array(
          fc.record({
            value: fc.string({ minLength: 1, maxLength: 10 }),
            label: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 5 }
        ),
        fc.option(fc.string({ minLength: 1, maxLength: 50 })),
        (label, options, error) => {
          const { container } = render(
            <Select 
              label={label} 
              options={options}
              error={error}
            />
          );
          
          const select = container.querySelector('select');
          if (!select) return false;
          
          const classes = getElementClasses(select);
          
          // Should have focus states
          const hasFocus = hasFocusStates(classes);
          
          // Should have transitions
          const hasTransition = hasTransitions(classes);
          
          // Should have proper border states
          const hasBorderStates = classes.some(cls => 
            cls.includes('border-') && (cls.includes('gray-') || cls.includes('red-'))
          );
          
          return hasFocus && hasTransition && hasBorderStates;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('PackageCard component should provide hover animations and feedback', () => {
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
          const { container } = renderWithRouter(
            <PackageCard package={packageData as Package} />
          );
          
          const link = container.querySelector('a');
          if (!link) return false;
          
          const linkClasses = getElementClasses(link);
          
          // Link should have group class for hover effects
          const hasGroupClass = linkClasses.includes('group');
          
          // Check for hover effects in the card structure
          const cardDiv = container.querySelector('a > div');
          if (!cardDiv) return false;
          
          const cardClasses = getElementClasses(cardDiv);
          
          // Card should have hover effects
          const cardHasHover = hasHoverFeedback(cardClasses);
          
          // Card should have transitions
          const cardHasTransition = hasTransitions(cardClasses);
          
          // Check for image hover effects
          const image = container.querySelector('img');
          if (!image) return false;
          
          const imageClasses = getElementClasses(image);
          const imageHasHover = hasHoverFeedback(imageClasses) || hasTransitions(imageClasses);
          
          // Check for group-hover effects in child elements
          const hasGroupHoverEffects = container.innerHTML.includes('group-hover:');
          
          return hasGroupClass && cardHasHover && cardHasTransition && 
                 imageHasHover && hasGroupHoverEffects;
        }
      ),
      { numRuns: 50 } // Reduced runs for complex component
    );
  });

  it('Navbar component should provide consistent interactive feedback for navigation elements', () => {
    fc.assert(
      fc.property(
        fc.constant(true), // Simple property to test navbar consistency
        () => {
          const { container } = renderWithRouter(<Navbar />);
          
          // Check that navbar has at least one link with interactive classes
          const allLinks = container.querySelectorAll('a');
          if (allLinks.length === 0) return false;
          
          let hasInteractiveLinks = false;
          allLinks.forEach(link => {
            const linkClasses = getElementClasses(link as HTMLElement);
            const hasHover = hasHoverFeedback(linkClasses);
            const hasTransition = hasTransitions(linkClasses);
            
            if (hasHover || hasTransition) {
              hasInteractiveLinks = true;
            }
          });
          
          // Check mobile menu button exists and has interactive feedback
          const mobileButton = container.querySelector('button');
          if (!mobileButton) return false;
          
          const buttonClasses = getElementClasses(mobileButton);
          const buttonHasInteractivity = hasHoverFeedback(buttonClasses) || 
                                       hasTransitions(buttonClasses) || 
                                       hasFocusStates(buttonClasses);
          
          // Check that the navbar has proper structure
          const nav = container.querySelector('nav');
          if (!nav) return false;
          
          return hasInteractiveLinks && buttonHasInteractivity;
        }
      ),
      { numRuns: 20 } // Reduced runs for static component
    );
  });

  it('All interactive elements should have smooth CSS transitions with appropriate duration', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const, 'danger' as const),
        fc.constantFrom('sm' as const, 'md' as const, 'lg' as const),
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.array(
          fc.record({
            value: fc.string({ minLength: 1, maxLength: 10 }),
            label: fc.string({ minLength: 1, maxLength: 20 })
          }),
          { minLength: 1, maxLength: 3 }
        ),
        (variant, size, inputLabel, selectOptions) => {
          const { container: buttonContainer } = render(
            <Button variant={variant} size={size}>Test Button</Button>
          );
          
          const { container: inputContainer } = render(
            <Input label={inputLabel} />
          );
          
          const { container: selectContainer } = render(
            <Select label={inputLabel} options={selectOptions} />
          );
          
          const button = buttonContainer.querySelector('button');
          const input = inputContainer.querySelector('input');
          const select = selectContainer.querySelector('select');
          
          if (!button || !input || !select) return false;
          
          const buttonClasses = getElementClasses(button);
          const inputClasses = getElementClasses(input);
          const selectClasses = getElementClasses(select);
          
          // All should have transition classes
          const buttonHasTransition = hasTransitions(buttonClasses);
          const inputHasTransition = hasTransitions(inputClasses);
          const selectHasTransition = hasTransitions(selectClasses);
          
          // Check for appropriate duration classes (should be reasonable, not too fast or slow)
          const hasReasonableDuration = (classes: string[]) => {
            return classes.some(cls => 
              cls.includes('duration-200') || 
              cls.includes('duration-300') || 
              cls.includes('duration-150') ||
              cls.includes('transition-all') ||
              cls.includes('transition-colors')
            );
          };
          
          const buttonHasGoodDuration = hasReasonableDuration(buttonClasses);
          const inputHasGoodDuration = hasReasonableDuration(inputClasses);
          const selectHasGoodDuration = hasReasonableDuration(selectClasses);
          
          return buttonHasTransition && inputHasTransition && selectHasTransition &&
                 buttonHasGoodDuration && inputHasGoodDuration && selectHasGoodDuration;
        }
      ),
      { numRuns: 10 }
    );
  });

  it('Interactive elements should maintain consistent feedback patterns across different states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('primary' as const, 'secondary' as const, 'ghost' as const, 'danger' as const),
        fc.boolean(),
        fc.option(fc.string({ minLength: 1, maxLength: 50 })),
        (variant, disabled, error) => {
          const { container: buttonContainer } = render(
            <Button variant={variant} disabled={disabled}>Test Button</Button>
          );
          
          const { container: inputContainer } = render(
            <Input label="Test Input" error={error} disabled={disabled} />
          );
          
          const button = buttonContainer.querySelector('button');
          const input = inputContainer.querySelector('input');
          
          if (!button || !input) return false;
          
          const buttonClasses = getElementClasses(button);
          const inputClasses = getElementClasses(input);
          
          // Both should have transitions regardless of state
          const buttonHasTransition = hasTransitions(buttonClasses);
          const inputHasTransition = hasTransitions(inputClasses);
          
          // Disabled elements should have appropriate disabled styling
          if (disabled) {
            const buttonHasDisabledStyling = buttonClasses.some(cls => 
              cls.includes('disabled:') || cls.includes('opacity-')
            );
            const inputHasDisabledStyling = input.disabled;
            
            if (!buttonHasDisabledStyling || !inputHasDisabledStyling) {
              return false;
            }
          } else {
            // Non-disabled elements should have hover and focus states
            const buttonHasHover = hasHoverFeedback(buttonClasses);
            const buttonHasFocus = hasFocusStates(buttonClasses);
            const inputHasFocus = hasFocusStates(inputClasses);
            
            if (!buttonHasHover || !buttonHasFocus || !inputHasFocus) {
              return false;
            }
          }
          
          // Error state should be reflected in input styling
          if (error) {
            const inputHasErrorStyling = inputClasses.some(cls => 
              cls.includes('border-red-') || cls.includes('ring-red-')
            );
            if (!inputHasErrorStyling) {
              return false;
            }
          }
          
          return buttonHasTransition && inputHasTransition;
        }
      ),
      { numRuns: 10 }
    );
  });
});
