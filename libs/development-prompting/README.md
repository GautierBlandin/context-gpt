# development-prompting

The goal of this library is to provide tooling for writing base prompts for development tasks.

## Generatings existing prompts

To generate existing prompts, run the following command:

```bash
nx generate-prompts development-prompting
```

## Creating a prompt

To create a prompt, add a new file js to the `prompts` directory.
In order to enrich the prompt with contextual information, you can use aliases for files. 
The aliases are defined in the `prompt-aliases.js` file.

Additionally, you can enrich prompt with runtime context using continue.dev providers. See the [continue.dev documentation](https://docs.continue.dev/customize/deep-dives/prompt-files) for more details.

When the prompt is ready, add it to the prompts array in the `generate-prompts.js` file.

## Adding a new alias

To add a new alias, add a new entry to the `prompt-aliases.js` file, add update the `prompt-generator.js` file to handle the new alias.

### File aliases

If your alias is a file alias, you should update the doc-paths.js file to include the new file path, and use it in the `prompt-generator.js` file
to handle the alias.
