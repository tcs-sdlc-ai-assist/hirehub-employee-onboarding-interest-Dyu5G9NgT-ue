import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
];

const INITIAL_FORM_STATE = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

const INITIAL_ERRORS_STATE = {
  fullName: '',
  email: '',
  mobile: '',
  department: '',
};

function InterestForm() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState(INITIAL_ERRORS_STATE);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let timer;
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [successMessage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      mobile: validateMobile(formData.mobile),
      department: validateDepartment(formData.department),
    };

    setErrors(newErrors);

    return !newErrors.fullName && !newErrors.email && !newErrors.mobile && !newErrors.department;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const emailTrimmed = formData.email.trim();
    if (isEmailDuplicate(emailTrimmed)) {
      setErrors((prev) => ({
        ...prev,
        email: 'This email has already been submitted. Please use a different email address.',
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      addSubmission({
        fullName: formData.fullName.trim(),
        email: emailTrimmed,
        mobile: formData.mobile.trim(),
        department: formData.department.trim(),
      });

      setFormData(INITIAL_FORM_STATE);
      setErrors(INITIAL_ERRORS_STATE);
      setSuccessMessage('Your interest has been submitted successfully! We will be in touch soon.');
    } catch (error) {
      console.error('Failed to submit interest form:', error);
      setErrors((prev) => ({
        ...prev,
        fullName: 'An unexpected error occurred. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Express Your Interest</h2>
        <p style={styles.subtitle}>
          Fill out the form below to let us know you are interested in joining HireHub.
        </p>

        {successMessage && (
          <div style={styles.successBanner} role="status">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.fieldGroup}>
            <label htmlFor="fullName" style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{
                ...styles.input,
                ...(errors.fullName ? styles.inputError : {}),
              }}
              autoComplete="name"
            />
            {errors.fullName && (
              <span style={styles.errorText} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>
              Email <span style={styles.required}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
              }}
              autoComplete="email"
            />
            {errors.email && (
              <span style={styles.errorText} role="alert">
                {errors.email}
              </span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="mobile" style={styles.label}>
              Mobile Number <span style={styles.required}>*</span>
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              style={{
                ...styles.input,
                ...(errors.mobile ? styles.inputError : {}),
              }}
              autoComplete="tel"
            />
            {errors.mobile && (
              <span style={styles.errorText} role="alert">
                {errors.mobile}
              </span>
            )}
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="department" style={styles.label}>
              Department of Interest <span style={styles.required}>*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{
                ...styles.select,
                ...(errors.department ? styles.inputError : {}),
              }}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <span style={styles.errorText} role="alert">
                {errors.department}
              </span>
            )}
          </div>

          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Interest'}
          </button>
        </form>

        <div style={styles.backLinkContainer}>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: 'calc(100vh - 80px)',
    padding: '40px 20px',
    backgroundColor: '#f9fafb',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '560px',
    border: '1px solid #e5e7eb',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '24px',
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    color: '#065f46',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #10b981',
    textAlign: 'center',
    marginBottom: '20px',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '20px',
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
    padding: '10px 12px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },
  select: {
    padding: '10px 12px',
    fontSize: '14px',
    border: '2px solid #e5e7eb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    width: '100%',
    boxSizing: 'border-box',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    fontWeight: '500',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.2s',
    marginTop: '8px',
  },
  backLinkContainer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  backLink: {
    fontSize: '14px',
    color: '#4f46e5',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};

export default InterestForm;