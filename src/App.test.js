import { render, screen } from '@testing-library/react';
import App from './App';

// Mock axios to avoid actual API calls during testing
jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn(),
}));

test('renders SmartHire header', () => {
  render(<App />);
  const headerElement = screen.getByText(/SmartHire/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders upload resume section', () => {
  render(<App />);
  const uploadElement = screen.getByText(/Upload Resume/i);
  expect(uploadElement).toBeInTheDocument();
});

test('renders recruiter dashboard button', () => {
  render(<App />);
  const dashboardButton = screen.getByText(/Recruiter Dashboard/i);
  expect(dashboardButton).toBeInTheDocument();
});

test('renders job posting form', () => {
  render(<App />);
  const jobFormElement = screen.getByText(/Post New Job/i);
  expect(jobFormElement).toBeInTheDocument();
}); 