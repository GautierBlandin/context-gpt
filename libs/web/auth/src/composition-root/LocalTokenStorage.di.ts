import { LocalTokenStorageImpl } from '../infrastructure';
import { singletonFactory } from '@context-gpt/di';

export const LocalTokenStorageSingleton = singletonFactory<LocalTokenStorageImpl>({
  factory: () => new LocalTokenStorageImpl(),
});
