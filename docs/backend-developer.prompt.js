import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import clipboard from 'clipboardy';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base prompt template
const basePrompt = `
<basePrompt>
Act as a backend software developer. You are going to be provided with a design document describing software
components that you are tasked with implementing.

In the following section, you will find a description of the structure of the backend project.

<backendProjectStructure>
{ project structure content, located at ./project-structure.server.md }
</backendProjectStructure>

In the following section, you will find the expected behavior of aggregates and use-cases.

<aggregatesAndUseCases>
{ aggregates and use-cases content, located at ./aggregates.md }
</aggregatesAndUseCases>

In the following section, you will find the expected behavior of repositories.

<repositories>
{ repositories content, located at ./repositories.md }
</repositories>

In the following section, you will find details about how we write test files.

<testFiles>
{ test files content, located at ./test-setup.backend.md }
</testFiles>

In the following section, you will find the code style guidelines for the backend project.

<codeStyle>
{ code style content, located at ./style.md }
</codeStyle>

The deliverable of your task is a series of code files that implement the design document. You must use
test-driven development while implement the code, therefore you should always write first a test file,
then the implementation file.

Separate the deliverables into multiple answers. Only include one component (e.g interfaces, test, and implementation)
per answer.

The user prompt is located in the userPrompt tag.
</basePrompt>

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
  const projectStructurePath = path.join(__dirname, 'project-structure.server.md');
  const codeStylePath = path.join(__dirname, 'style.md');
  const aggregatesAndUseCasesPath = path.join(__dirname, 'aggregates.md');
  const repositoriesPath = path.join(__dirname, 'repositories.md');
  const testFilesPath = path.join(__dirname, 'test-setup.backend.md');

  const [projectStructure, codeStyle, aggregatesAndUseCases, repositories, testFiles] = await Promise.all([
    readFileContent(projectStructurePath),
    readFileContent(codeStylePath),
    readFileContent(aggregatesAndUseCasesPath),
    readFileContent(repositoriesPath),
    readFileContent(testFilesPath),
  ]);

  const finalPrompt = basePrompt
    .replace('{ project structure content, located at ./project-structure.server.md }', projectStructure)
    .replace('{ code style content, located at ./style.md }', codeStyle)
    .replace('{ aggregates and use-cases content, located at ./aggregates.md }', aggregatesAndUseCases)
    .replace('{ repositories content, located at ./repositories.md }', repositories)
    .replace('{ test files content, located at ./test-setup.backend.md }', testFiles);

  await clipboard.write(finalPrompt);
  console.log('Base prompt has been copied to clipboard!');
}

// Run the script
generateAndCopyPrompt().catch((error) => console.error('An error occurred:', error));
