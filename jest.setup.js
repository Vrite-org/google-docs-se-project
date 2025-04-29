import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Mock window.fetch
global.fetch = jest.fn();

// Mock toast functions
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));
