# CRITICAL RULES - MUST FOLLOW

## RESPONSES

- Keep responses concise and to the point - unless the user asks otherwise

## PLANNING MODE

- Always ask clarifying questions
- Never assume design, tech stack or features
- Use deep-dive sub-agents to assist with research
- Use deep-dive sub-agents to review the different aspects of your plan before presenting to the user

## CHANGE / EDIT MODE

- Never implement features yourself when possible - use sub-agents!
- Identify changes from the plan that can be implemented in parallel, and use sub-agents to implement the features efficiently
- When using sub-agents to implement features, act as a coordinator only
- Use the best model for the task - premium models for complex tasks (like coding) and mid-tier models for simpler tasks, like documentation
- After completing features (large or small), always run commands like lint, type check and next build to check code quality

## MOTION & 3D DESIGN RULES

- Every animation must serve usability or visual storytelling.
- Never add animations for decoration only.
- The entire website must follow one unified Motion Language.
- All 3D effects must originate from the Cubic Design Language.
- Avoid common hover effects (scale, translateY, pulse, bounce) unless justified.
- Prefer depth, perspective, layered transforms and lighting over movement.
- Every component must preserve visual consistency with the Hero Rubik Cube.
- Motion should feel physical, using spring dynamics and inertia.
- Respect prefers-reduced-motion.
- Maintain 60 FPS on desktop and mobile.
- Avoid continuous distracting animations.

## DATABASE SCHEMA CHANGES

- Whenever you make changes to the database schema, ALWAYS run the drizzle generate and migrate commands
- NEVER run drizzle push!
- For all ID columns NOT related to BetterAuth, use UUID for the ID columns and be randomly generated

## TESTING

- Use any testing tools, libraries available to the project for testing your changes
- Never assume your changes simply work, always test!
- If the project does not have any testing tools, scripts, MCP tools, skills, etc. available for testing, ask the user whether testing should be skipped.

## UI DESIGN

- Always follow:
  - [DESIGN.md](file:///c:/dev/Portfolio/docs/DESIGN.md) (Foundational Styling & Philosophy)
  - [MOTION.md](file:///c:/dev/Portfolio/docs/MOTION.md) (3D, Physics & Animation)
  - [COMPONENTS.md](file:///c:/dev/Portfolio/docs/COMPONENTS.md) (Component Specifications & States)
  - [INTERACTIONS.md](file:///c:/dev/Portfolio/docs/INTERACTIONS.md) (Input Mechanics & Micro-interactions)
  when creating or modifying UI components.
