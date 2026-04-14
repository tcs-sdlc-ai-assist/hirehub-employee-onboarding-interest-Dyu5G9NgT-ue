import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { SubmissionTable } from './SubmissionTable';
import EditModal from './EditModal';
import { getSubmissions, updateSubmission, deleteSubmission } from '../utils/storage';

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'N/A';
  }
}

function AdminDashboard({ onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [editingSubmission, setEditingSubmission] = useState(null);

  const loadSubmissions = useCallback(() => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const totalSubmissions = submissions.length;

  const uniqueDepartments = new Set(
    submissions.map((sub) => sub.department).filter(Boolean)
  ).size;

  const latestSubmission = submissions.length > 0
    ? submissions.reduce((latest, sub) => {
        if (!latest) return sub;
        return new Date(sub.submittedAt) > new Date(latest.submittedAt) ? sub : latest;
      }, null)
    : null;

  const latestSubmissionDate = latestSubmission
    ? formatDate(latestSubmission.submittedAt)
    : 'N/A';

  const handleEdit = (submission) => {
    setEditingSubmission(submission);
  };

  const handleSave = (updatedSubmission) => {
    try {
      updateSubmission(updatedSubmission.id, {
        fullName: updatedSubmission.fullName,
        email: updatedSubmission.email,
        mobile: updatedSubmission.mobile,
        department: updatedSubmission.department,
      });
      setEditingSubmission(null);
      loadSubmissions();
    } catch (error) {
      console.error('Failed to update submission:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSubmission(null);
  };

  const handleDelete = (id) => {
    const submission = submissions.find((sub) => sub.id === id);
    const name = submission ? submission.fullName : 'this submission';
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }
    try {
      deleteSubmission(id);
      loadSubmissions();
    } catch (error) {
      console.error('Failed to delete submission:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p style={styles.subtitle}>Manage onboarding interest submissions</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statIconPrimary }}>📋</div>
          <div style={styles.statValue}>{totalSubmissions}</div>
          <div style={styles.statLabel}>Total Submissions</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statIconSuccess }}>🏢</div>
          <div style={styles.statValue}>{uniqueDepartments}</div>
          <div style={styles.statLabel}>Unique Departments</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statIconWarning }}>🕒</div>
          <div style={styles.statValue} title={latestSubmissionDate}>
            {latestSubmissionDate}
          </div>
          <div style={styles.statLabel}>Latest Submission</div>
        </div>
      </div>

      <div style={styles.tableSection}>
        <div style={styles.tableSectionHeader}>
          <h2 style={styles.tableSectionTitle}>All Submissions</h2>
        </div>
        <SubmissionTable
          submissions={submissions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleSave}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  title: {
    margin: '0 0 4px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
  },
  subtitle: {
    margin: 0,
    fontSize: '14px',
    color: '#6b7280',
  },
  logoutButton: {
    padding: '8px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    transition: 'transform 0.15s, box-shadow 0.15s',
  },
  statIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    fontSize: '20px',
    marginBottom: '8px',
  },
  statIconPrimary: {
    backgroundColor: '#eff6ff',
    color: '#4f46e5',
  },
  statIconSuccess: {
    backgroundColor: '#ecfdf5',
    color: '#10b981',
  },
  statIconWarning: {
    backgroundColor: '#fffbeb',
    color: '#f59e0b',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1f2937',
    lineHeight: '1.2',
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: '500',
    marginTop: '4px',
  },
  tableSection: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  tableSectionHeader: {
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
  },
  tableSectionTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '600',
    color: '#1f2937',
  },
};

AdminDashboard.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default AdminDashboard;