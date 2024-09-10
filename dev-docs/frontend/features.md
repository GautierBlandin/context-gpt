# Anatomy of a feature

A feature represents a whole business functionality. The main rule of features is that they maintain an API that is as simple as possible. 
They should take in as few props as possible, and instead mostly be standalone components that provide a specific functionality.

## Folder structure

A feature's directory is composed of the two following main parts:
- Folders containing sub-components of the feature
- The feature's main component
- The feature's API, exposed through the index.ts file.

```
// ./libs/chat/features/chat-page
├── chat-input
│   ├── chat-input.view.tsx
│   ├── chat-input.state.tsx
│   ├── chat-input.presenter.ts
│   ├── chat-input.tsx
├── message-list
│   ├── message-list.view.tsx
│   ├── message-list.state.tsx
│   ├── message-list.presenter.ts
│   ├── message-list.tsx
├── chat-page.view.tsx
├── chat-page.state.tsx
├── chat-page.presenter.ts
├── chat-page.tsx
├── index.ts
```

The view, state, and presenter files of a component should not be accessed from the outside. Only the main component
should be used outside of a component's directory.
