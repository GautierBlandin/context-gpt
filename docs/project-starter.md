# Repo starter notes

A practical guide to initialize a new project using best-practices.

## Project initialization

- Use the appropriate Nx generator to create your project

## Framework-agnostic steps

### Code style

- Use Prettier. See attached `.prettierrc` file. Recommended .prettierrc configuration:

```json
{
  "printWidth": 120,
  "endingPosition": "absolute",
  "singleQuote": true,
  "plugins": ["prettier-plugin-tailwindcss", "prettier-plugin-classnames"]
}
```
- Use ESLint. Recommended overrides:

```json
{
  "rules": {
    "@typescript-eslint/no-use-before-define": "off"
  }
}
```

- See `style.md` for code style guidelines

### IDE (Webstorm)
- Enable `run eslint --fix on save`
- Enable `run prettier on save`
- Enable `use types from the server` for TypeScript

## Frontend (React)

### State management

- Use Zustand or Valtio for reactive state management
- Use Tanstack Query for data fetching and server synchronization

## Backend

### Web framework

- Use NestJS as a framework
- Respect Zalando's [API First principles](https://opensource.zalando.com/restful-api-guidelines/)

### Persistence

- Default to Postgres
- Consider event sourcing and CQRS

## Testing

- Prefer Vitest over Jest **when possible**

## Deployment

### CI

- Use GitHub Actions for CI

### IaC

- Use Pulumi for IaC
