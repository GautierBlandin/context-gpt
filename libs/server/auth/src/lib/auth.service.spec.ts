import { AuthService } from './auth.service';
import { EnvFake } from '../../../shared/src/lib/env.fake';

describe('auth service', () => {
  it('returns true when the token is valid', () => {
    const { env, service } = setup();

    env.set('API_ACCESS_TOKEN', 'validToken');

    expect(service.validateToken('validToken')).resolves.toBe(true);
  });

  it('returns false when the token is invalid', () => {
    const { service } = setup();

    expect(service.validateToken('invalidToken')).resolves.toBe(false);
  });
});

const setup = () => {
  const env = new EnvFake();

  return {
    env,
    service: new AuthService(env),
  };
};
