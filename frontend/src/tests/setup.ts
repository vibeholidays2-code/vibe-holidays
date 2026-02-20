import '@testing-library/jest-dom';
import { afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import React from 'react';

// Mock react-helmet-async to avoid HelmetProvider issues in tests
vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }: { children?: React.ReactNode }) =>
    React.createElement('div', { 'data-testid': 'helmet-mock' }, children),
  HelmetProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Polyfill ResizeObserver (used by @react-three/fiber and other libs)
globalThis.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};

// Global framer-motion mock — strips motion-only props so they don't pollute DOM
const MOTION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants', 'layout', 'layoutId',
  'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
  'drag', 'dragConstraints', 'dragElastic', 'dragMomentum', 'dragTransition',
  'onDragStart', 'onDragEnd', 'onDrag', 'viewport', 'onUpdate', 'onAnimationStart',
  'onAnimationComplete', 'style',
]);

const makeMotionEl = (tag: string) =>
  ({ children, ...props }: any) => {
    const domProps: Record<string, any> = {};
    for (const key of Object.keys(props)) {
      if (!MOTION_PROPS.has(key)) domProps[key] = props[key];
    }
    return React.createElement(tag, domProps, children);
  };

vi.mock('framer-motion', () => ({
  motion: {
    div: makeMotionEl('div'),
    span: makeMotionEl('span'),
    button: makeMotionEl('button'),
    section: makeMotionEl('section'),
    p: makeMotionEl('p'),
    h2: makeMotionEl('h2'),
    li: makeMotionEl('li'),
    ul: makeMotionEl('ul'),
    a: makeMotionEl('a'),
    img: makeMotionEl('img'),
    svg: makeMotionEl('svg'),
  },
  AnimatePresence: ({ children }: any) => children,
  useInView: () => true,
  useMotionValue: (init: number) => ({ get: () => init, set: vi.fn() }),
  animate: vi.fn((_from: any, _to: any, _opts: any) => ({ stop: vi.fn() })),
  useAnimationControls: () => ({ start: vi.fn(), stop: vi.fn() }),
  useTransform: (v: any) => v,
  useSpring: (v: any) => v,
}));

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true });
});

// Cleanup after each test
afterEach(() => {
  cleanup();
  localStorageMock.clear();
});

