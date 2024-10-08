# Goal

Create an API endpoint enabling creation of threads.

# Questions

Q: What is the API endpoint for creating a thread ?
A: POST /threads

Q: What are the required parameters for creating a thread ?
A: Nothing, only the user's authentication token

Q: What is returned by the API endpoint ?
A: The thread ID

Q: What is the format of the thread ID ?
A: uuidv4

Q: How do we enable persistence ?
A: Using postgres

# Design

## Software components:

- ThreadsController
The ThreadsController already exists, we need to add the POST /threads endpoint to it.

- CreateThreadUseCase
The CreateThreadUseCase is responsible for creating a thread.

- ThreadsRepository
The ThreadsRepository is responsible for persisting the thread.

- ThreadAggregate
Create a ThreadAggregate class that represents a thread. It should have a static create method for creating an empty thread.

# Setting up Postgres

As part of the implementation of this feature, we need to set up Postgres as our database layer.
For local development, we want to use Docker to run Postgres. However, this should be transparent when running the application using nx serve. We need to create a target
that sets up the Postgres container and exposes the port 5432.

# Implementation steps

- [X] Create the ThreadAggregate
- [X] Create the ThreadsRepository
  - [X] Create the ThreadsRepository port (abstract class)
  - [X] Create a fake ThreadsRepository implementation
  - [X] Setup Postgres
    - [X] Create a docker-compose.yml file
    - [X] Create an nx target to start the Postgres container
    - [X] Figure out how to create a Threads table using Prisma
  - [X] Create a postgres ThreadsRepository implementation using Prisma
  - [X] Register the ThreadsRepository in the threads module
- [X] Create the CreateThreadUseCase
  - [X] Create the CreateThreadUseCase abstract class
  - [X] Create the CreateThreadUseCase implementation
- [ ] Update the ThreadsController to handle the POST /threads endpoint
