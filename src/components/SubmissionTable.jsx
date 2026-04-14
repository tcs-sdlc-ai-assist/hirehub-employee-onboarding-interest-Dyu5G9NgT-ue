import React from 'react';
import PropTypes from 'prop-types';

const DEPARTMENT_COLORS = {
  Engineering: { background: '#dbeafe', color: '#1e40af' },
  Marketing: { background: '#fce7f3', color: '#9d174d' },
  Sales: { background: '#d1fae5', color: '#065f46' },
  'Human Resources': { background: '#fef3c7', color: '#92400e' },
  Finance: { background: '#ede9fe', color: '#5b21b6' },
  Operations: { background: '#ffedd5', color: '#9a3412' },
  Design: { background: '#cffafe', color: '#155e75' },
  'Customer Support': { background: '#f3e8ff', color: '#6b21a8' },
};

const DEFAULT_BADGE_STYLE = { background: '#f3f4f6', color: '#374151' };

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Invalid Date';
  }
}

function getDepartmentBadgeStyle(department) {
  return DEPARTMENT_COLORS[department] || DEFAULT_BADGE_STYLE;
}

export function SubmissionTable({ submissions, onEdit, onDelete }) {
  if (!submissions || submissions.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.tableContainer}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Mobile</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Submitted At</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => {
            const badgeStyle = getDepartmentBadgeStyle(submission.department);
            return (
              <tr key={submission.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{submission.fullName}</td>
                <td style={styles.td}>{submission.email}</td>
                <td style={styles.td}>{submission.mobile}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: badgeStyle.background,
                      color: badgeStyle.color,
                    }}
                  >
                    {submission.department}
                  </span>
                </td>
                <td style={styles.td}>{formatDate(submission.submittedAt)}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => onEdit(submission)}
                      aria-label={`Edit ${submission.fullName}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => onDelete(submission.id)}
                      aria-label={`Delete ${submission.fullName}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  tableContainer: {
    width: '100%',
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '700px',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    backgroundColor: '#f9fafb',
    borderBottom: '2px solid #e5e7eb',
    fontWeight: '600',
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#1f2937',
    verticalAlign: 'middle',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9fafb',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'nowrap',
  },
  editButton: {
    padding: '6px 14px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '6px 14px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  emptyContainer: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '16px',
    margin: 0,
  },
};

SubmissionTable.propTypes = {
  submissions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      mobile: PropTypes.string.isRequired,
      department: PropTypes.string.isRequired,
      submittedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default SubmissionTable;