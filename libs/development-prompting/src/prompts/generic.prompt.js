import { reflectionPrompt } from '../reflection.prompt.js';

export const genericPrompt = `
<basePrompt>
I need assistance with a programming task in my project.
</basePrompt>

Here are the user's currently open files:
{{{ open }}}

Here is the user's prompt:
{{{ input }}}

${reflectionPrompt}
`;
