import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import clipboard from 'clipboardy';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base prompt template
const basePrompt = `
<basePrompt>
Act as a backend software architect. Be thorough in your answer. Solutions that you architect should be
as simple as possible while meeting the requirements.

In the following section, you will find a description of the structure of the backend project.

<backendProjectStructure>
{ project structure content, located at ./project-structure.server.md }
</backendProjectStructure>

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
    AuthController[Auth Controller] --> RegisterUserUseCase[Register User Use Case]
    AuthController --> LoginUserUseCase[Login User Use Case]
    AuthController --> ValidateTokenUseCase[Validate Token Use Case]
    ValidateTokenUseCase --> TokenService[Token Service]
    TokenValidatorMiddleware --> ValidateTokenUseCase
    LoginUserUseCase --> UserRepository[User Repository]
    LoginUserUseCase --> UserAggregate[User Aggregate]
    LoginUserUseCase --> TokenService[Token Service]
    RegisterUserUseCase --> UserRepository
    UserRepository -.Implemented by.-> InMemoryUserRepository[In-Memory User Repository]
</mermaidGraph>

<solutionDetails>
An explanation of the role of the different components of the solution
</solutionDetails>

<implementationSteps>
A list of practical implementation steps that can be followed to implement the solution.
The implementation steps should NOT contain any code.

Example implementation steps:
- [ ] Update the threads aggregate
 - [ ] Add the 'postMessage' method
 - [ ] The 'postMessage' method throws an error if the thread is archived
- [ ] Create the threads repository interface
- [ ] Create the in-memory threads repository implementation
- [ ] Create the post-message use-case
- [ ] Create the post-message DTO
- [ ] Create the post-message API request handler in the API controller
</implementationSteps>

</basePrompt>

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
  const projectStructurePath = path.join(__dirname, './backend/project-structure.server.md');

  const [projectStructure] = await Promise.all([readFileContent(projectStructurePath)]);

  const finalPrompt = basePrompt.replace(
    '{ project structure content, located at ./project-structure.server.md }',
    projectStructure,
  );

  await clipboard.write(finalPrompt);
  console.log('Base prompt has been copied to clipboard!');
}

// Run the script
generateAndCopyPrompt().catch((error) => console.error('An error occurred:', error));
