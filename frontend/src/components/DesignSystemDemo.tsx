import React from 'react';
import Button from './Button';
import Card from './Card';

/**
 * Design System Demo Component
 * 
 * This component demonstrates the new professional design system foundation
 * including colors, typography, spacing, shadows, and component variants.
 */
const DesignSystemDemo: React.FC = () => {
  return (
    <div className="p-8 bg-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Typography System */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Typography System</h2>
          <div className="space-y-4">
            <h1 className="text-heading-1">Heading 1 - Professional Travel Experiences</h1>
            <h2 className="text-heading-2">Heading 2 - Discover Amazing Destinations</h2>
            <h3 className="text-heading-3">Heading 3 - Package Features</h3>
            <h4 className="text-heading-4">Heading 4 - Itinerary Details</h4>
            <p className="text-body-large">Large body text for important descriptions and introductory content.</p>
            <p className="text-body">Regular body text for general content and package descriptions.</p>
            <p className="text-body-small">Small body text for additional details and fine print.</p>
            <p className="text-caption">Caption text for image descriptions and metadata.</p>
          </div>
        </Card>

        {/* Color Palette */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Professional Color Palette</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-heading-4 mb-3">Primary Colors (Trust & Professionalism)</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-600 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Primary 600</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-500 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Primary 500</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary-400 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Primary 400</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-heading-4 mb-3">Secondary Colors (Call-to-Action)</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary-600 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Secondary 600</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary-500 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Secondary 500</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-secondary-400 rounded-lg shadow-soft"></div>
                  <span className="text-caption mt-2">Secondary 400</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-heading-4 mb-3">Neutral Palette</h3>
              <div className="flex flex-wrap gap-3">
                {[50, 200, 400, 600, 800].map(shade => (
                  <div key={shade} className="flex flex-col items-center">
                    <div className={`w-16 h-16 bg-neutral-${shade} rounded-lg shadow-soft border border-neutral-200`}></div>
                    <span className="text-caption mt-2">Neutral {shade}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Button Variants */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Button System</h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="lg">Primary Large</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="sm">Primary Small</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="outline" size="md">Outline</Button>
              <Button variant="danger" size="md">Danger</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="md" disabled>Disabled</Button>
              <Button variant="primary" size="md" isLoading>Loading</Button>
            </div>
          </div>
        </Card>

        {/* Shadow System */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Shadow & Elevation System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-subtle">
              <h4 className="text-heading-4 mb-2">Subtle</h4>
              <p className="text-body-small">For subtle elevation</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-soft">
              <h4 className="text-heading-4 mb-2">Soft</h4>
              <p className="text-body-small">For cards and containers</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-medium">
              <h4 className="text-heading-4 mb-2">Medium</h4>
              <p className="text-body-small">For hover states</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-large">
              <h4 className="text-heading-4 mb-2">Large</h4>
              <p className="text-body-small">For modals and overlays</p>
            </div>
          </div>
        </Card>

        {/* Gradient System */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Gradient System</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-primary p-8 rounded-xl text-white">
              <h3 className="text-heading-3 mb-2">Primary Gradient</h3>
              <p className="text-body">Perfect for hero sections and primary CTAs</p>
            </div>
            <div className="bg-gradient-secondary p-8 rounded-xl text-white">
              <h3 className="text-heading-3 mb-2">Secondary Gradient</h3>
              <p className="text-body">Great for accent elements and highlights</p>
            </div>
          </div>
        </Card>

        {/* Animation Examples */}
        <Card className="space-y-6">
          <h2 className="text-heading-2">Animation System</h2>
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary-100 p-4 rounded-lg animate-fade-in">
              <span className="text-body-small">Fade In Animation</span>
            </div>
            <div className="bg-secondary-100 p-4 rounded-lg animate-slide-up">
              <span className="text-body-small">Slide Up Animation</span>
            </div>
            <div className="bg-success-100 p-4 rounded-lg animate-scale-in">
              <span className="text-body-small">Scale In Animation</span>
            </div>
            <div className="bg-neutral-100 p-4 rounded-lg animate-pulse-subtle">
              <span className="text-body-small">Subtle Pulse</span>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DesignSystemDemo;