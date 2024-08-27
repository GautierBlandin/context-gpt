export function singletonFactory<T>(config: InjectableFactoryConfig<T>) {
  let override: T | undefined;
  let instance: T | undefined;

  const getInstance = () => {
    if (override !== undefined) {
      return override;
    }
    return (instance ??= config.factory());
  };

  const reset = () => {
    override = undefined;
  };

  const setOverride = (instance: T) => {
    override = instance;
  };

  return {
    getInstance,
    reset,
    setOverride,
  };
}

interface InjectableFactoryConfig<T> {
  factory: () => T;
}
