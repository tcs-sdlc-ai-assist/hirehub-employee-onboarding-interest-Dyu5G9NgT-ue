import { useState } from 'react';
import PropTypes from 'prop-types';
import { validateName, validateMobile, validateDepartment, ALLOWED_DEPARTMENTS } from '../utils/validators';

function EditModal({ submission, onSave, onCancel }) {
  const [fullName, setFullName] = useState(submission.fullName || '');
  const [mobile, setMobile] = useState(submission.mobile || '');
  const [department, setDepartment] = useState(submission.department || '');
  const [errors, setErrors] = useState({});

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nameError = validateName(fullName);
    const mobileError = validateMobile(mobile);
    const departmentError = validateDepartment(department);

    const newErrors = {};
    if (nameError) newErrors.fullName = nameError;
    if (mobileError) newErrors.mobile = mobileError;
    if (departmentError) newErrors.department = departmentError;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSave({
      id: submission.id,
      fullName: fullName.trim(),
      email: submission.email,
      mobile: mobile.trim(),
      department: department.trim(),
      submittedAt: submission.submittedAt,
    });
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Edit Submission</h2>
          <button
            type="button"
            onClick={onCancel}
            style={styles.closeButton}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.fieldGroup}>
            <label htmlFor="edit-fullName" style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <input
              id="edit-fullName"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) {
                  setErrors((prev) => ({ ...prev, fullName: '' }));
                }
              }}
              style={{
                ...styles.input,
                ...(errors.fullName ? styles.inputError : {}),
              }}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <span style={styles.error} role="alert">{errors.fullName}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="edit-email" style={styles.label}>
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              value={submission.email}
              readOnly
              style={{ ...styles.input, ...styles.inputReadOnly }}
            />
            <span style={styles.hint}>Email cannot be changed.</span>
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="edit-mobile" style={styles.label}>
              Mobile <span style={styles.required}>*</span>
            </label>
            <input
              id="edit-mobile"
              type="text"
              value={mobile}
              onChange={(e) => {
                setMobile(e.target.value);
                if (errors.mobile) {
                  setErrors((prev) => ({ ...prev, mobile: '' }));
                }
              }}
              style={{
                ...styles.input,
                ...(errors.mobile ? styles.inputError : {}),
              }}
              placeholder="Enter mobile number"
            />
            {errors.mobile && (
              <span style={styles.error} role="alert">{errors.mobile}</span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="edit-department" style={styles.label}>
              Department <span style={styles.required}>*</span>
            </label>
            <select
              id="edit-department"
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                if (errors.department) {
                  setErrors((prev) => ({ ...prev, department: '' }));
                }
              }}
              style={{
                ...styles.select,
                ...(errors.department ? styles.inputError : {}),
              }}
            >
              <option value="">Select a department</option>
              {ALLOWED_DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <span style={styles.error} role="alert">{errors.department}</span>
            )}
          </div>

          <div style={styles.footer}>
            <button
              type="button"
              onClick={onCancel}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '520px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '700',
    color: '#1f2937',
  },
  closeButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#6b7280',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s, color 0.15s',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1f2937',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  inputReadOnly: {
    backgroundColor: '#f9fafb',
    color: '#6b7280',
    cursor: 'not-allowed',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '16px',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  error: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
    marginTop: '2px',
  },
  hint: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '2px',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  cancelButton: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    color: '#1f2937',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  saveButton: {
    padding: '8px 24px',
    fontSize: '14px',
    fontWeight: '600',
    borderRadius: '8px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
};

EditModal.propTypes = {
  submission: PropTypes.shape({
    id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    mobile: PropTypes.string.isRequired,
    department: PropTypes.string.isRequired,
    submittedAt: PropTypes.string.isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditModal;