import { subscribe } from 'valtio/vanilla';
import { getSdk } from '@context-gpt/context-gpt-sdk';
import { AuthenticationStateType, authenticationStore } from '@context-gpt/authentication';

const sdk = getSdk();

subscribe(authenticationStore, () => {
  if (authenticationStore.authState.type === AuthenticationStateType.Authenticated) {
    console.log('Setting access token');
    sdk.setAccessToken(authenticationStore.authState.token.token);
  } else {
    sdk.setAccessToken(null);
  }
});

export const authenticatedSdk = sdk;
