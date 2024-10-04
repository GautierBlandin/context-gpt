import path from 'path';

const rootPath = process.cwd();

// shared
export const codeStylePath = path.join(rootPath, './dev-docs/code-style.md');
export const errorHandlingPath = path.join(rootPath, './dev-docs/crossplatform/error-handling.md');

// backend
export const aggregatesAndUseCasesPath = path.join(rootPath, './dev-docs/backend/aggregates.md');
export const backendRepositoriesPath = path.join(rootPath, './dev-docs/backend/repositories.md');
export const backendProjectStructurePath = path.join(rootPath, './dev-docs/backend/project-structure.server.md');
export const backendTestFilesPath = path.join(rootPath, './dev-docs/backend/test-setup.backend.md');
export const backendPersistencePath = path.join(rootPath, './dev-docs/backend/persistence.postgres.md');
export const useCasesPath = path.join(rootPath, './dev-docs/backend/use-cases.md');
export const webFrameworkPath = path.join(rootPath, './dev-docs/backend/web-framework.server.md');

// frontend
export const frontendProjectStructurePath = path.join(rootPath, './dev-docs/frontend/project-structure.frontend.md');
export const frontendTechnologiesPath = path.join(rootPath, './dev-docs/frontend/technologies.md');
export const frontendComponentsPath = path.join(rootPath, './dev-docs/frontend/component.md');
export const frontendHeadlessComponentsPath = path.join(rootPath, './dev-docs/frontend/component.valtio.md');
export const frontendFeaturesPath = path.join(rootPath, './dev-docs/frontend/features.md');
export const frontendRepositoriesPath = path.join(rootPath, './dev-docs/frontend/repositories.md');
export const frontendTestFilesPath = path.join(rootPath, './dev-docs/frontend/test.frontend.md');
