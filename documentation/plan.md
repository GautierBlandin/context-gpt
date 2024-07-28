- Basic Chatbot Interface
  - Simple frontend with a chat interface
  - Responses generated using Claude 3.5 Sonnet API
  - No backend storage or state management

- RAG with PDF selection

  - Add ability to select a PDF
  - Pass the selected PDF to the chatbot for RAG
  - No embedding or vector storage

- Basic Vector Creation and Storage

  - Create vectors from the extracted text using Anthropic's embedding API
  - Store vectors in Pinecone
  - Implement a simple backend with API Gateway and Lambda

- RAG-enhanced Chatbot

  - Integrate vector search into the chat functionality
  - Use retrieved context to enhance Claude 3.5 Sonnet responses
  - Basic end-to-end RAG workflow without user management

- User Authentication

  - Add user registration and login functionality
  - Associate documents and chat sessions with users
