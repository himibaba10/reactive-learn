import { auth } from '@/auth';
import { getCoursesByInstructor } from '@/queries/courses.queries';
import { getUserByEmail } from '@/queries/user.queries';
import { getLoggedInUser, myStats } from '../my-helpers';

jest.mock('@/auth', () => ({
  auth: jest.fn(),
}));
jest.mock('@/queries/courses.queries', () => ({
  getCoursesByInstructor: jest.fn(),
}));
jest.mock('@/queries/user.queries', () => ({
  getUserByEmail: jest.fn(),
}));

describe('my-helpers suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('myStats suite', () => {
    it('should return the correct stats', async () => {
      auth.mockResolvedValue({ user: { id: 'user-123' } });
      getCoursesByInstructor.mockResolvedValue(['Course 1', 'Course 2']);

      const stats = await myStats();

      expect(auth).toHaveBeenCalled();
      expect(getCoursesByInstructor).toHaveBeenCalledWith('user-123');
      expect(stats).toEqual(['Course 1', 'Course 2']);
    });

    it('should throw an error if session is not found', async () => {
      auth.mockResolvedValue(null);

      await expect(myStats()).rejects.toThrow('Session not found');
    });
  });

  describe('getLoggedInUser suite', () => {
    it('should return the correct user', async () => {
      auth.mockResolvedValue({ user: { email: 'test@test.com' } });
      getUserByEmail.mockResolvedValue({ name: 'John', email: 'test@test.com' });

      const user = await getLoggedInUser();

      expect(getUserByEmail).toHaveBeenCalledWith('test@test.com');
      expect(user.name).toBe('John');
    });

    it('should throw an error if session is not found', async () => {
      auth.mockResolvedValue(null);
      await expect(getLoggedInUser()).rejects.toThrow('Session not found');
    });

    it('should throw an error if user is not found', async () => {
      auth.mockResolvedValue({ user: { email: 'ghost@test.com' } });
      getUserByEmail.mockResolvedValue(null);

      await expect(getLoggedInUser()).rejects.toThrow('User not found');
    });
  });
});
