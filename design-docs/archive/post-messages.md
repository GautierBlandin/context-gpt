# Goal

The goal is to enable the user to post a message to a thread and receive the streaming response from the chatbot.

Current implementation:

Currently, the behavior is implemented directly is the threads controller:

```ts
  @Post(':id/messages')
async handleClaudeRequest(
  @Param('id') threadId: string,
@Body() claudeRequestDto: ThreadsIdMessagesRequestPostDto,
@Res() res: Response,
) {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
  });

  try {
    const mappedMessages: Message[] = claudeRequestDto.messages.map((msg) => ({
      sender: msg.sender === 'User' ? 'user' : 'assistant',
      content: msg.content,
    }));
    const observable = this.llmFacade.prompt({ messages: mappedMessages });

    observable.subscribe({
      next: (chunk) => {
        res.write(`data: ${JSON.stringify({ content: chunk.content })}\n\n`);
      },
      error: (error) => {
        res.write(`data: ${JSON.stringify({ error })}\n\n`);
        res.end();
      },
      complete: () => {
        res.write('data: [DONE]\n\n');
        res.end();
      },
    });
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: 'An error occurred' })}\n\n`);
    res.end();
  }
}
```

In the current implementation:
- The client is fully responsible for setting the history of messages
- The messages from the user are not persisted
- The messages from the chatbot are not persisted

Here are the requirements for the new implementation:

- The client is only responsible for sending the last message of the user to the server
- The server is responsible for loading the history of messages in the given thread
- The server is responsible for persisting the user's new message
- The server is responsible for persisting the chatbot's response

# Implementation steps

- [X] In the ThreadAggregate, add a method to add a user message to the history. Transition the thread to WaitingForChatbotResponse state
- [X] In the ThreadsAggregate, add a method to add a chatbot response to the history. Transition the thread to WaitingForUserResponse state
- [X] Update the prisma schema to include the new aggregate state
- [X] Create a post-message use-case
  - [X] In the post-message use-case, load the thread from the database and call the addMessage method on the thread
  - [X] In the post-message use-case, send the thread's messages to the LLM using LLM Facade
  - [X] In the post-message use-case, create an observable that streams the chatbot's response
  - [X] Subscribe to the observable so that when it is complete, the thread's aggregate method for receiving the chatbot's 
response is called, and the repository saves the updated thread aggregate
  - [X] Return the observable so that the thread controller can stream the response to the client
- [X] Update the threads controller to use the new use-case
