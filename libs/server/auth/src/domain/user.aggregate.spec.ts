import { User } from './user.aggregate';

describe('User Aggregate', () => {
  describe('create', () => {
    it('should create a new user with valid data', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.state.type).toBe('active');
      expect(user.state.email).toBe('test@example.com');
      expect(user.state.hashedPassword).not.toBe('password123'); // Password should be hashed
      expect(user.state.id).toBeDefined();
    });

    it('should throw an error if email is invalid', () => {
      expect(() =>
        User.create({
          email: 'invalid-email',
          password: 'password123',
        }),
      ).toThrow('Invalid email');
    });

    it('should throw an error if password is too short', () => {
      expect(() =>
        User.create({
          email: 'test@example.com',
          password: 'short',
        }),
      ).toThrow('Password must be at least 8 characters long');
    });
  });

  describe('validateCredentials', () => {
    it('should return true for valid credentials', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.validateCredentials('password123')).toBe(true);
    });

    it('should return false for invalid credentials', () => {
      const user = User.create({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.validateCredentials('wrongpassword')).toBe(false);
    });
  });
});
