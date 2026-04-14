import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  updateSubmission: vi.fn(),
  deleteSubmission: vi.fn(),
}));

import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';

const mockOnLogout = vi.fn();

function renderDashboard() {
  return render(
    <MemoryRouter>
      <AdminDashboard onLogout={mockOnLogout} />
    </MemoryRouter>
  );
}

const mockSubmissions = [
  {
    id: 'sub-1',
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: 'sub-2',
    fullName: 'Bob Smith',
    email: 'bob@example.com',
    mobile: '9876543210',
    department: 'Marketing',
    submittedAt: '2024-01-16T12:00:00.000Z',
  },
  {
    id: 'sub-3',
    fullName: 'Carol White',
    email: 'carol@example.com',
    mobile: '5551234567',
    department: 'Engineering',
    submittedAt: '2024-01-17T14:00:00.000Z',
  },
];

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSubmissions.mockReturnValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('rendering', () => {
    it('renders the dashboard title', () => {
      renderDashboard();
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('renders the dashboard subtitle', () => {
      renderDashboard();
      expect(screen.getByText('Manage onboarding interest submissions')).toBeInTheDocument();
    });

    it('renders the logout button', () => {
      renderDashboard();
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });

    it('renders the All Submissions section title', () => {
      renderDashboard();
      expect(screen.getByText('All Submissions')).toBeInTheDocument();
    });
  });

  describe('stat cards with empty submissions', () => {
    it('renders total submissions as 0 when no submissions', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    });

    it('renders unique departments as 0 when no submissions', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      const statValues = screen.getAllByText('0');
      expect(statValues.length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('Unique Departments')).toBeInTheDocument();
    });

    it('renders latest submission as N/A when no submissions', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      expect(screen.getByText('N/A')).toBeInTheDocument();
      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    });
  });

  describe('stat cards with submissions', () => {
    it('renders correct total submissions count', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
    });

    it('renders correct unique departments count', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Unique Departments')).toBeInTheDocument();
    });

    it('renders latest submission date', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      expect(screen.queryByText('N/A')).not.toBeInTheDocument();
    });
  });

  describe('submission table', () => {
    it('renders submission table with data', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      expect(screen.getByText('Carol White')).toBeInTheDocument();
    });

    it('renders all submission rows', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      const editButtons = screen.getAllByText('Edit');
      expect(editButtons).toHaveLength(3);
    });

    it('renders department badges', () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      renderDashboard();
      const engineeringBadges = screen.getAllByText('Engineering');
      expect(engineeringBadges).toHaveLength(2);
      expect(screen.getByText('Marketing')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    it('shows "No submissions yet." message when there are no submissions', () => {
      getSubmissions.mockReturnValue([]);
      renderDashboard();
      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });
  });

  describe('edit functionality', () => {
    it('opens edit modal when edit button is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Alice Johnson')).toBeInTheDocument();
    });

    it('closes edit modal when cancel is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('calls updateSubmission and reloads data on save', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      updateSubmission.mockReturnValue(undefined);
      const user = userEvent.setup();
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      const nameInput = screen.getByDisplayValue('Alice Johnson');
      await user.clear(nameInput);
      await user.type(nameInput, 'Alice Updated');

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      await user.click(saveButton);

      expect(updateSubmission).toHaveBeenCalledWith('sub-1', {
        fullName: 'Alice Updated',
        email: 'alice@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });
    });

    it('opens edit modal with correct data for second submission', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const user = userEvent.setup();
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[1]);

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Bob Smith')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('calls window.confirm when delete button is clicked', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(confirmSpy).toHaveBeenCalledWith(
        'Are you sure you want to delete Alice Johnson? This action cannot be undone.'
      );
      confirmSpy.mockRestore();
    });

    it('does not call deleteSubmission when confirm is cancelled', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(deleteSubmission).not.toHaveBeenCalled();
      confirmSpy.mockRestore();
    });

    it('calls deleteSubmission when confirm is accepted', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue(undefined);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(deleteSubmission).toHaveBeenCalledWith('sub-1');
      confirmSpy.mockRestore();
    });

    it('reloads submissions after successful delete', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockReturnValue(undefined);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const user = userEvent.setup();
      renderDashboard();

      const initialCallCount = getSubmissions.mock.calls.length;

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(getSubmissions.mock.calls.length).toBeGreaterThan(initialCallCount);
      confirmSpy.mockRestore();
    });
  });

  describe('logout', () => {
    it('calls onLogout when logout button is clicked', async () => {
      getSubmissions.mockReturnValue([]);
      const user = userEvent.setup();
      renderDashboard();

      await user.click(screen.getByText('Logout'));

      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('error handling', () => {
    it('handles deleteSubmission error gracefully', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      deleteSubmission.mockImplementation(() => {
        throw new Error('Storage error');
      });
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const user = userEvent.setup();
      renderDashboard();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to delete submission:', expect.any(Error));
      consoleSpy.mockRestore();
      confirmSpy.mockRestore();
    });

    it('handles updateSubmission error gracefully', async () => {
      getSubmissions.mockReturnValue(mockSubmissions);
      updateSubmission.mockImplementation(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const user = userEvent.setup();
      renderDashboard();

      const editButtons = screen.getAllByText('Edit');
      await user.click(editButtons[0]);

      const saveButton = screen.getByRole('button', { name: /Save Changes/i });
      await user.click(saveButton);

      expect(consoleSpy).toHaveBeenCalledWith('Failed to update submission:', expect.any(Error));
      consoleSpy.mockRestore();
    });
  });
});