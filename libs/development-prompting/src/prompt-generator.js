import fs from 'fs/promises';
import * as docPaths from './doc-paths.js';
import * as aliases from './prompt-aliases.js';
import path from 'path';

export async function generateAndWritePrompt(promptTemplate, outputFilePath) {
  try {
    const finalPrompt = await generatePrompt(promptTemplate);
    await writePromptToFile(finalPrompt, outputFilePath);
    console.log(`Prompt has been generated and written to: ${outputFilePath}`);
    return finalPrompt;
  } catch (error) {
    console.error('An error occurred while generating or writing the prompt:', error);
  }
}

async function generatePrompt(promptTemplate) {
  const aliasMap = {
    [aliases.CODE_STYLE]: docPaths.codeStylePath,
    [aliases.BACKEND_PROJECT_STRUCTURE]: docPaths.backendProjectStructurePath,
    [aliases.AGGREGATES_AND_USE_CASES]: docPaths.aggregatesAndUseCasesPath,
    [aliases.BACKEND_REPOSITORIES]: docPaths.backendRepositoriesPath,
    [aliases.BACKEND_TEST_FILES]: docPaths.backendTestFilesPath,
    [aliases.BACKEND_ERROR_HANDLING]: docPaths.backendErrorHandlingPath,
    [aliases.USE_CASES]: docPaths.useCasesPath,
    [aliases.WEB_FRAMEWORK]: docPaths.webFrameworkPath,
    [aliases.FRONTEND_PROJECT_STRUCTURE]: docPaths.frontendProjectStructurePath,
    [aliases.FRONTEND_TECHNOLOGIES]: docPaths.frontendTechnologiesPath,
  };

  let finalPrompt = promptTemplate;

  for (const [alias, filePath] of Object.entries(aliasMap)) {
    if (finalPrompt.includes(alias)) {
      const content = await readFileContent(filePath);
      finalPrompt = finalPrompt.replace(alias, content);
    }
  }

  return finalPrompt;
}

async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return `{ Unable to read ${path.basename(filePath)} }`;
  }
}

async function writePromptToFile(prompt, filePath) {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, prompt, 'utf8');
  } catch (error) {
    console.error(`Error writing prompt to file ${filePath}:`, error.message);
    throw error;
  }
}
