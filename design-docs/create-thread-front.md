# Goal

Integrate the new create / post-message API into the front-end of the application.

# Questions

Q: What is the current API endpoints available for interacting with the threads?  
A: POST /threads: create a new thread  
POST /threads/{id}/messages: post a message to a thread

Q: How do we enable users to create a new thread from the UI?  
A: Add a rudimentary sidebar with a button to create a new thread

Q: How do we enable users to post a message to a thread from the UI?  
A: Keep the existing chat interface

Q: Where do we store the thread id when accessing the chat interface?  
A: Store it in the URL
