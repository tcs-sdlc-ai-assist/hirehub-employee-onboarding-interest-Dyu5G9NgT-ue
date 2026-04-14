import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import InterestForm from './InterestForm';

vi.mock('../utils/storage', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn(),
}));

import { addSubmission, isEmailDuplicate } from '../utils/storage';

function renderInterestForm() {
  return render(
    <MemoryRouter>
      <InterestForm />
    </MemoryRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isEmailDuplicate.mockReturnValue(false);
    addSubmission.mockReturnValue({
      id: 'test-uuid-123',
      fullName: 'John Doe',
      email: 'john@example.com',
      mobile: '1234567890',
      department: 'Engineering',
      submittedAt: '2024-01-15T10:00:00.000Z',
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the form title', () => {
      renderInterestForm();
      expect(screen.getByText('Express Your Interest')).toBeInTheDocument();
    });

    it('renders the form subtitle', () => {
      renderInterestForm();
      expect(
        screen.getByText(/Fill out the form below to let us know you are interested in joining HireHub/)
      ).toBeInTheDocument();
    });

    it('renders the Full Name input field', () => {
      renderInterestForm();
      const input = screen.getByLabelText(/Full Name/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('placeholder', 'Enter your full name');
    });

    it('renders the Email input field', () => {
      renderInterestForm();
      const input = screen.getByLabelText(/Email/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'email');
      expect(input).toHaveAttribute('placeholder', 'Enter your email address');
    });

    it('renders the Mobile Number input field', () => {
      renderInterestForm();
      const input = screen.getByLabelText(/Mobile Number/);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'tel');
      expect(input).toHaveAttribute('placeholder', 'Enter your mobile number');
    });

    it('renders the Department select field', () => {
      renderInterestForm();
      const select = screen.getByLabelText(/Department of Interest/);
      expect(select).toBeInTheDocument();
    });

    it('renders department options', () => {
      renderInterestForm();
      expect(screen.getByText('Select a department')).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('Human Resources')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
      expect(screen.getByText('Operations')).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderInterestForm();
      expect(screen.getByRole('button', { name: /Submit Interest/i })).toBeInTheDocument();
    });

    it('renders the back to home link', () => {
      renderInterestForm();
      const link = screen.getByText(/Back to Home/);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('validation errors on empty submit', () => {
    it('shows validation errors when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Full name is required.')).toBeInTheDocument();
      expect(screen.getByText('Email is required.')).toBeInTheDocument();
      expect(screen.getByText('Mobile number is required.')).toBeInTheDocument();
      expect(screen.getByText('Please select a department.')).toBeInTheDocument();
    });

    it('does not call addSubmission when form is invalid', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(addSubmission).not.toHaveBeenCalled();
    });

    it('shows name validation error for single character name', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'A');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Full name must be at least 2 characters.')).toBeInTheDocument();
    });

    it('shows email validation error for invalid email format', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Email/), 'notanemail');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });

    it('shows mobile validation error for too few digits', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Mobile Number/), '123');
      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Mobile number must contain at least 7 digits.')).toBeInTheDocument();
    });
  });

  describe('duplicate email error', () => {
    it('shows duplicate email error when email already exists', async () => {
      isEmailDuplicate.mockReturnValue(true);
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'John Doe');
      await user.type(screen.getByLabelText(/Email/), 'john@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '1234567890');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Engineering');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(isEmailDuplicate).toHaveBeenCalledWith('john@example.com');
      expect(
        screen.getByText('This email has already been submitted. Please use a different email address.')
      ).toBeInTheDocument();
      expect(addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('successful submission', () => {
    it('calls addSubmission with correct data on valid submit', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(addSubmission).toHaveBeenCalledWith({
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        mobile: '9876543210',
        department: 'Marketing',
      });
    });

    it('shows success banner after successful submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(
        screen.getByText('Your interest has been submitted successfully! We will be in touch soon.')
      ).toBeInTheDocument();
    });

    it('clears form fields after successful submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByLabelText(/Full Name/)).toHaveValue('');
      expect(screen.getByLabelText(/Email/)).toHaveValue('');
      expect(screen.getByLabelText(/Mobile Number/)).toHaveValue('');
      expect(screen.getByLabelText(/Department of Interest/)).toHaveValue('');
    });
  });

  describe('success banner auto-dismiss', () => {
    it('auto-dismisses success banner after timeout', async () => {
      vi.useFakeTimers({ shouldAdvanceTime: true });
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(
        screen.getByText('Your interest has been submitted successfully! We will be in touch soon.')
      ).toBeInTheDocument();

      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        expect(
          screen.queryByText('Your interest has been submitted successfully! We will be in touch soon.')
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('error handling', () => {
    it('shows error message when addSubmission throws', async () => {
      addSubmission.mockImplementation(() => {
        throw new Error('Storage full');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/Full Name/), 'Jane Smith');
      await user.type(screen.getByLabelText(/Email/), 'jane@example.com');
      await user.type(screen.getByLabelText(/Mobile Number/), '9876543210');
      await user.selectOptions(screen.getByLabelText(/Department of Interest/), 'Marketing');

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
      expect(
        screen.queryByText('Your interest has been submitted successfully! We will be in touch soon.')
      ).not.toBeInTheDocument();

      consoleSpy.mockRestore();
    });
  });

  describe('field error clearing on input change', () => {
    it('clears field error when user starts typing', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /Submit Interest/i }));

      expect(screen.getByText('Full name is required.')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Full Name/), 'J');

      expect(screen.queryByText('Full name is required.')).not.toBeInTheDocument();
    });
  });
});