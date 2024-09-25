# Goal

Enable the user to create and view threads, and access previous threads.

# Questions

## API Design

Q: What user actions should the API support ?  
A: Creating a thread, list the threads, viewing the content of a thread, posting a message to a thread, deleting a thread

Q: What endpoints does the API need to support the above actions ?  
A: 
- [X] Create a thread: POST /threads
- [ ] Post a message to a thread: POST /threads/{id}/messages
- [ ] View a thread: GET /threads/{id}
- [ ] List threads: GET /threads
- [ ] Delete a thread: DELETE /threads/{id}
