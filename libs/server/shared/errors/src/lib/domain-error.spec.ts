import { DomainError } from './domain-error';

describe('DomainError', () => {
  it('should be an instance of Error', () => {
    const error = new DomainError('Test error');
    expect(error).toBeInstanceOf(Error);
  });

  it('should have a name property set to "DomainError"', () => {
    const error = new DomainError('Test error');
    expect(error.name).toBe('DomainError');
  });

  it('should have a message property set to the provided message', () => {
    const error = new DomainError('Test error');
    expect(error.message).toBe('Test error');
  });
});
