import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';

describe('storage utilities', () => {
  let getItemSpy;
  let setItemSpy;

  beforeEach(() => {
    getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      getItemSpy.mockReturnValue(null);
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage has an empty array', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when localStorage has valid data', () => {
      const submissions = [
        {
          id: 'abc-123',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
          submittedAt: '2024-01-15T10:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));
      const result = getSubmissions();
      expect(result).toEqual(submissions);
      expect(result).toHaveLength(1);
      expect(result[0].fullName).toBe('John Doe');
    });

    it('resets and returns empty array when localStorage contains corrupted JSON', () => {
      getItemSpy.mockReturnValue('not valid json{{{');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(setItemSpy).toHaveBeenCalledWith('hirehub_submissions', JSON.stringify([]));
      consoleSpy.mockRestore();
    });

    it('resets and returns empty array when localStorage contains a non-array value', () => {
      getItemSpy.mockReturnValue(JSON.stringify({ not: 'an array' }));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(setItemSpy).toHaveBeenCalledWith('hirehub_submissions', JSON.stringify([]));
      consoleSpy.mockRestore();
    });

    it('resets and returns empty array when localStorage contains a string value', () => {
      getItemSpy.mockReturnValue(JSON.stringify('just a string'));
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = getSubmissions();
      expect(result).toEqual([]);
      consoleSpy.mockRestore();
    });
  });

  describe('saveSubmissions', () => {
    it('saves an array of submissions to localStorage', () => {
      const data = [
        {
          id: 'abc-123',
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          mobile: '9876543210',
          department: 'Marketing',
          submittedAt: '2024-01-15T10:00:00.000Z',
        },
      ];
      saveSubmissions(data);
      expect(setItemSpy).toHaveBeenCalledWith('hirehub_submissions', JSON.stringify(data));
    });

    it('throws an error when called with a non-array argument', () => {
      expect(() => saveSubmissions('not an array')).toThrow('saveSubmissions expects an array');
    });

    it('saves an empty array without error', () => {
      saveSubmissions([]);
      expect(setItemSpy).toHaveBeenCalledWith('hirehub_submissions', JSON.stringify([]));
    });
  });

  describe('addSubmission', () => {
    it('adds a new submission with a generated UUID and timestamp', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      const input = {
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        mobile: '5551234567',
        department: 'Engineering',
      };

      const result = addSubmission(input);

      expect(result).toHaveProperty('id');
      expect(result.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
      expect(result.fullName).toBe('Alice Smith');
      expect(result.email).toBe('alice@example.com');
      expect(result.mobile).toBe('5551234567');
      expect(result.department).toBe('Engineering');
      expect(result).toHaveProperty('submittedAt');
      expect(new Date(result.submittedAt).getTime()).not.toBeNaN();

      expect(setItemSpy).toHaveBeenCalled();
      const savedData = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe(result.id);
    });

    it('appends to existing submissions', () => {
      const existing = [
        {
          id: 'existing-1',
          fullName: 'Bob Jones',
          email: 'bob@example.com',
          mobile: '1112223333',
          department: 'Sales',
          submittedAt: '2024-01-10T08:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(existing));

      const input = {
        fullName: 'Carol White',
        email: 'carol@example.com',
        mobile: '4445556666',
        department: 'Design',
      };

      const result = addSubmission(input);

      const savedData = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(savedData).toHaveLength(2);
      expect(savedData[0].id).toBe('existing-1');
      expect(savedData[1].id).toBe(result.id);
    });
  });

  describe('updateSubmission', () => {
    it('updates fields of an existing submission by id', () => {
      const submissions = [
        {
          id: 'update-1',
          fullName: 'Dave Brown',
          email: 'dave@example.com',
          mobile: '7778889999',
          department: 'Finance',
          submittedAt: '2024-01-12T09:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      const result = updateSubmission('update-1', {
        fullName: 'David Brown',
        department: 'Operations',
      });

      expect(result.fullName).toBe('David Brown');
      expect(result.department).toBe('Operations');
      expect(result.email).toBe('dave@example.com');
      expect(result.id).toBe('update-1');

      const savedData = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(savedData[0].fullName).toBe('David Brown');
      expect(savedData[0].department).toBe('Operations');
    });

    it('preserves the original id even if updates try to override it', () => {
      const submissions = [
        {
          id: 'preserve-id',
          fullName: 'Eve Green',
          email: 'eve@example.com',
          mobile: '1231231234',
          department: 'Marketing',
          submittedAt: '2024-01-13T10:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      const result = updateSubmission('preserve-id', {
        id: 'hacked-id',
        fullName: 'Eve Updated',
      });

      expect(result.id).toBe('preserve-id');
      expect(result.fullName).toBe('Eve Updated');
    });

    it('throws an error when the submission id is not found', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      expect(() => updateSubmission('nonexistent-id', { fullName: 'Nobody' })).toThrow(
        'Submission with id "nonexistent-id" not found.'
      );
    });
  });

  describe('deleteSubmission', () => {
    it('removes a submission by id', () => {
      const submissions = [
        {
          id: 'delete-1',
          fullName: 'Frank Lee',
          email: 'frank@example.com',
          mobile: '9998887777',
          department: 'Engineering',
          submittedAt: '2024-01-14T11:00:00.000Z',
        },
        {
          id: 'delete-2',
          fullName: 'Grace Kim',
          email: 'grace@example.com',
          mobile: '6665554444',
          department: 'Design',
          submittedAt: '2024-01-14T12:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      deleteSubmission('delete-1');

      const savedData = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0].id).toBe('delete-2');
    });

    it('throws an error when the submission id is not found', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      expect(() => deleteSubmission('nonexistent-id')).toThrow(
        'Submission with id "nonexistent-id" not found.'
      );
    });

    it('removes the only submission leaving an empty array', () => {
      const submissions = [
        {
          id: 'only-one',
          fullName: 'Hank Solo',
          email: 'hank@example.com',
          mobile: '1110002222',
          department: 'Sales',
          submittedAt: '2024-01-15T13:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      deleteSubmission('only-one');

      const savedData = JSON.parse(setItemSpy.mock.calls[setItemSpy.mock.calls.length - 1][1]);
      expect(savedData).toEqual([]);
    });
  });

  describe('isEmailDuplicate', () => {
    it('returns true when the email already exists (exact match)', () => {
      const submissions = [
        {
          id: 'dup-1',
          fullName: 'Ivy Chen',
          email: 'ivy@example.com',
          mobile: '3334445555',
          department: 'Engineering',
          submittedAt: '2024-01-15T14:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      expect(isEmailDuplicate('ivy@example.com')).toBe(true);
    });

    it('returns true when the email matches case-insensitively', () => {
      const submissions = [
        {
          id: 'dup-2',
          fullName: 'Jack Park',
          email: 'Jack@Example.COM',
          mobile: '2223334444',
          department: 'Marketing',
          submittedAt: '2024-01-15T15:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      expect(isEmailDuplicate('jack@example.com')).toBe(true);
      expect(isEmailDuplicate('JACK@EXAMPLE.COM')).toBe(true);
      expect(isEmailDuplicate('Jack@Example.COM')).toBe(true);
    });

    it('returns true when the email has leading/trailing whitespace', () => {
      const submissions = [
        {
          id: 'dup-3',
          fullName: 'Kate Lin',
          email: 'kate@example.com',
          mobile: '5556667777',
          department: 'Finance',
          submittedAt: '2024-01-15T16:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      expect(isEmailDuplicate('  kate@example.com  ')).toBe(true);
    });

    it('returns false when the email does not exist', () => {
      const submissions = [
        {
          id: 'nodup-1',
          fullName: 'Leo Tan',
          email: 'leo@example.com',
          mobile: '8889990000',
          department: 'Operations',
          submittedAt: '2024-01-15T17:00:00.000Z',
        },
      ];
      getItemSpy.mockReturnValue(JSON.stringify(submissions));

      expect(isEmailDuplicate('different@example.com')).toBe(false);
    });

    it('returns false when there are no submissions', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      expect(isEmailDuplicate('anyone@example.com')).toBe(false);
    });

    it('returns false when email is null or undefined', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      expect(isEmailDuplicate(null)).toBe(false);
      expect(isEmailDuplicate(undefined)).toBe(false);
    });

    it('returns false when email is an empty string', () => {
      getItemSpy.mockReturnValue(JSON.stringify([]));

      expect(isEmailDuplicate('')).toBe(false);
    });
  });
});