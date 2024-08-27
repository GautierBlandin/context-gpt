import { EnvFake } from './env.fake';

describe('Env fake', () => {
  it('gets a previously set environment variable', () => {
    const { envFake } = setup();

    envFake.set('MY_ENV_VARIABLE', 'test');

    expect(envFake.get('MY_ENV_VARIABLE')).toBe('test');
  });

  it('returns undefined if the environment variable is not set', () => {
    const { envFake } = setup();

    expect(envFake.get('MY_ENV_VARIABLE')).toBeUndefined();
  });
});

const setup = () => {
  return {
    envFake: new EnvFake(),
  };
};
