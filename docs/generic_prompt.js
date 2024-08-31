import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import clipboard from 'clipboardy';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base prompt template
const basePrompt = `
<programmersBasePrompt>
I need assistance with a programming task in my project. Here's some context:

Project Name: context-gpt
Primary Language(s): TypeScript
Key Technologies: React, NestJS, Postgres, AWS

The following explains my project's structure:

<projectStructure>
{ project structure content, located at ./project-structure.md }
</projectStructure>

We follow these code style rules in our codebase:

<codeStyle>
{ code style content, located at ./style.md }
</codeStyle>

Below is the details of what I need your help for.
</programmersBasePrompt>

<userPrompt>
YOUR PROMPT GOES HERE
</userPrompt>
`;

// Function to read file contents
async function readFileContent(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error.message);
    return `{ Unable to read ${path.basename(filePath)} }`;
  }
}

// Main function
async function generateAndCopyPrompt() {
  const projectStructurePath = path.join(__dirname, 'project-structure.md');
  const codeStylePath = path.join(__dirname, 'style.md');

  const [projectStructure, codeStyle] = await Promise.all([
    readFileContent(projectStructurePath),
    readFileContent(codeStylePath),
  ]);

  const finalPrompt = basePrompt
    .replace('{ project structure content, located at ./project-structure.md }', projectStructure)
    .replace('{ code style content, located at ./style.md }', codeStyle);

  await clipboard.write(finalPrompt);
  console.log('Base prompt has been copied to clipboard!');
}

// Run the script
generateAndCopyPrompt().catch((error) => console.error('An error occurred:', error));
