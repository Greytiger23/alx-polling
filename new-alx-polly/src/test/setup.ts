// src/test/setup.ts
import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Next.js modules that aren't available in test environment
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// Reset mocks before each test
beforeEach(() => {
  jest.resetAllMocks();
});