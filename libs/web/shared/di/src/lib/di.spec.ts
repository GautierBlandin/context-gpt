import { singletonFactory } from './di';

describe('injectableFactory', () => {
  it('should return an object with getInstance, reset, and setOverride methods', () => {
    const factory = singletonFactory({ factory: () => 'test' });

    expect(factory).toHaveProperty('getInstance');
    expect(factory).toHaveProperty('reset');
    expect(factory).toHaveProperty('setOverride');
  });

  it('should return the factory result when getInstance is called', () => {
    const factory = singletonFactory({ factory: () => 'test value' });

    expect(factory.getInstance()).toBe('test value');
  });

  it('should return the override value when setOverride is called', () => {
    const factory = singletonFactory({ factory: () => 'original value' });

    factory.setOverride('override value');

    expect(factory.getInstance()).toBe('override value');
  });

  it('should return to the original factory value after reset is called', () => {
    const factory = singletonFactory({ factory: () => 'original value' });

    factory.setOverride('override value');
    factory.reset();

    expect(factory.getInstance()).toBe('original value');
  });
});
