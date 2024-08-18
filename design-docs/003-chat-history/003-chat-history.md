# Goal

Have a chat history that persists across sessions.

# Wireframe

![Chat History Wireframe](./003-chat-history.mockup.png)

# Design

## Frontend

![img.png](img.png)

## Backend

# Event flow

![Event flow](003-chat-history.storm.flow.png)

### Aggregate
![Thread aggregate](./003-chat-history.storm.aggregate.png)

# Implementation steps

## Step 1

Singleton persistent thread. GET Thread always returns the same thread that is stored in memory.

## Step 2

Multiple threads, stored in memory. Each thread has a unique ID. 
