export function injectableFactory<T>(
  config: InjectableFactoryConfig<T>
) {
  let override: T | undefined;

  const getInstance = () => {
    if (override !== undefined) {
      return override;
    }
    return config.factory();
  }

  const reset = () => {
    override = undefined;
  }

  const setOverride = (instance: T) => {
    override = instance;
  }

  return {
    getInstance,
    reset,
    setOverride,
  };
}

interface InjectableFactoryConfig<T> {
  factory: () => T;
}
