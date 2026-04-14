const STORAGE_KEY = 'hirehub_submissions';

/**
 * Generates a UUID v4 string
 * @returns {string} A UUID string
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Reads and parses submissions from localStorage.
 * Resets to empty array on parse failure or corruption.
 * @returns {Array<Object>} Array of submission objects
 */
export function getSubmissions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('Storage corruption detected: submissions is not an array. Resetting.');
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Failed to parse submissions from localStorage. Resetting.', error);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    } catch (writeError) {
      console.error('Failed to reset localStorage.', writeError);
    }
    return [];
  }
}

/**
 * Stringifies and saves the submissions array to localStorage.
 * @param {Array<Object>} data - Array of submission objects to save
 */
export function saveSubmissions(data) {
  try {
    if (!Array.isArray(data)) {
      throw new Error('saveSubmissions expects an array');
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save submissions to localStorage.', error);
    throw error;
  }
}

/**
 * Adds a new submission with a generated UUID and submittedAt timestamp.
 * @param {Object} submission - Submission data (fullName, email, mobile, department)
 */
export function addSubmission(submission) {
  const submissions = getSubmissions();
  const newSubmission = {
    id: generateUUID(),
    fullName: submission.fullName,
    email: submission.email,
    mobile: submission.mobile,
    department: submission.department,
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  saveSubmissions(submissions);
  return newSubmission;
}

/**
 * Finds a submission by id and merges the provided updates.
 * @param {string} id - The UUID of the submission to update
 * @param {Object} updates - Partial submission fields to merge
 */
export function updateSubmission(id, updates) {
  const submissions = getSubmissions();
  let found = false;
  const updated = submissions.map(function (sub) {
    if (sub.id === id) {
      found = true;
      return { ...sub, ...updates, id: sub.id };
    }
    return sub;
  });
  if (!found) {
    throw new Error('Submission with id "' + id + '" not found.');
  }
  saveSubmissions(updated);
  return updated.find(function (sub) {
    return sub.id === id;
  });
}

/**
 * Deletes a submission by filtering out the matching id.
 * @param {string} id - The UUID of the submission to delete
 */
export function deleteSubmission(id) {
  const submissions = getSubmissions();
  const filtered = submissions.filter(function (sub) {
    return sub.id !== id;
  });
  if (filtered.length === submissions.length) {
    throw new Error('Submission with id "' + id + '" not found.');
  }
  saveSubmissions(filtered);
}

/**
 * Checks if an email already exists in submissions (case-insensitive).
 * @param {string} email - The email address to check
 * @returns {boolean} True if the email already exists
 */
export function isEmailDuplicate(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }
  const submissions = getSubmissions();
  const normalizedEmail = email.trim().toLowerCase();
  return submissions.some(function (sub) {
    return sub.email && sub.email.trim().toLowerCase() === normalizedEmail;
  });
}