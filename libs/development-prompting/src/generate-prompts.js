// generate-prompts.js

import { generateAndWritePrompt } from './prompt-generator.js';
import { backendDeveloperPrompt } from './prompts/backend-developer.prompt.js';
import { frontendArchitectPrompt } from './prompts/frontend-architect.prompt.js';
import { genericPrompt } from './prompts/generic.prompt.js';
import { backendArchitectPrompt } from './prompts/backend-architect.prompt.js';
import path from 'path';

const rootPath = process.cwd();
const promptsDir = path.join(rootPath, '.prompts');

async function generatePrompts() {
  const prompts = [
    { name: 'backend-developer', content: backendDeveloperPrompt },
    { name: 'frontend-architect', content: frontendArchitectPrompt },
    { name: 'generic', content: genericPrompt },
    { name: 'backend-architect', content: backendArchitectPrompt },
  ];

  for (const prompt of prompts) {
    const outputPath = path.join(promptsDir, `${prompt.name}.prompt`);
    await generateAndWritePrompt(prompt.content, outputPath);
  }

  console.log('All prompts have been generated and written to the .prompts directory.');
}

generatePrompts().catch((error) => {
  console.error('An error occurred while generating prompts:', error);
  process.exit(1);
});
