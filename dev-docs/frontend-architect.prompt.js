import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import clipboard from 'clipboardy';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base prompt template
const basePrompt = `
<basePrompt>
Act as a frontend software architect. Be thorough in your answer. Solutions that you architect should be
as simple as possible while meeting the requirements.

In the following section, you will find a description of the structure of the frontend project.

<frontendProjectStructure>
{ project structure }
</frontendProjectStructure>

In the following section, you will find the technologies used in the frontend project.

<frontendTechnologies>
{ frontend technologies }
</frontendTechnologies>

The deliverable of your task is a design document that describes the software components involved in the solution,
a mermaid graph diagram that summarizes how the components interact, and a list of practical implementation steps
that can be followed to implement the solution. Developers will follow your design document to implement the solution.

Take multiple steps to create the document if you need to.

Ask questions to the user if you need any clarification before providing a solution.

Please respect the following format for your answers:

<mermaidGraph>
Your graph describing the overall architecture of the solution

Example graph:

graph TD
    Chat --> ChatInput[Chat Input]
    Chat --> ChatMessages[Chat Messages]
    Chat --> ChatState[Chat State]
    Chat --> ChatView[Chat View]
    ChatState --> ChatPresenter[Chat Presenter]
    ChatState --> use-get-thread.query
    ChatState --> use-post-message.mutation
    use-get-thread.query --> threads.repository
    use-post-message.mutation --> threads.repository
    ChatView --> button
    ChatView --> text-area
</mermaidGraph>

<solutionDetails>
An explanation of the role of the different components of the solution. May include typescript interfaces, but no implementation.
</solutionDetails>

<implementationSteps>
A list of practical implementation steps that can be followed to implement the solution.
The implementation steps should NOT contain any code.

Example implementation steps:
- [ ] Create the chat state store
 - [ ] Add the 'initializeChat' method
 - [ ] Add the 'postMessage' method
- [ ] Create the threads repository interface
- [ ] Create http threads repository implementation
etc.
</implementationSteps>

</basePrompt>

Here are additional files that the user has opened to provide context:

{{{ open }}}

Here is the user's prompt:

{{{ input }}}`;

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
  const projectStructurePath = path.join(__dirname, './frontend/project-structure.frontend.md');
  const technologiesPath = path.join(__dirname, './frontend/technologies.md');

  const [projectStructure, technologies] = await Promise.all([
    readFileContent(projectStructurePath),
    readFileContent(technologiesPath),
  ]);

  const finalPrompt = basePrompt
    .replace('{ project structure }', projectStructure)
    .replace('{ frontend technologies }', technologies);

  await clipboard.write(finalPrompt);
  console.log('Base prompt has been copied to clipboard!');
}

// Run the script
generateAndCopyPrompt().catch((error) => console.error('An error occurred:', error));
