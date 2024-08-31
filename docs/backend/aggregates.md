# Aggregate

The project follows Domain-Driven Design and therefore the aggregate pattern.
In order to limit implementation complexity, we have decided against using Event Sourcing, and 
to only persist the state of the aggregates in the database.

Here are the typical methods found in an aggregate:

- Static ```from``` method: Creates an instance of the aggregate from a given state.
- Static factory method: Initial command that creates an instance of the aggregate.
- Commands: Public methods that mutate the state of the aggregate and maintain its invariants.

The state of the aggregate should be stored under a state property in the aggregate.
Aggregate states should have a type, with clear allowed transitions. More on this in the State Types section.

# Use-case / aggregate sequence diagram

The following diagram shows the typical interaction between a use-case, an aggregate, and a repository.

```mermaid
sequenceDiagram
  participant UseCase
  participant Aggregate
  participant Repository

  UseCase->>Repository: Get aggregate
  Repository->>Aggregate: Load aggregate from state
  Aggregate->>Repository: Aggregate instance
  Repository->>UseCase: Aggregate instance
  UseCase->>Aggregate: Call command
  Aggregate->>Aggregate: Mutate state
  UseCase ->> Repository: Save new aggregate state
  UseCase ->> UseCase: (optional) Emit cross-bounded-context event
```

## State types

Aggregate states should have a type, with clear allowed transitions. For example,
a `Thread` aggregate could have the following states:

```mermaid
graph TD
  Creation[Creation] --> WaitingForUserMessage[WaitingForUserMessage]
  WaitingForUserMessage[WaitingForUserMessage] --> WaitingForAssistantMessage[WaitingForAssistantMessage]
  WaitingForAssistantMessage --> WaitingForUserMessage
  WaitingForAssistantMessage --> Archived
```
