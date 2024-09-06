# Big picture

This document provides overarching guidelines for software projects and teams.

## Broad guidelines

- Follow Domain-Driven Design to slice the project vertically
- Use hexagonal architecture to slice the project horizontally
- Prefer monorepos, avoid monoliths
- The team owns the project from code to deployment and QA. 
No single individual is 100% responsible for any single component of the system. 
Ownership is collective.
- Prefer TDD over testing-after. Prefer testing-after over manual testing. See `tdd.md` for more details.
