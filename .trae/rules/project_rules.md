---
description: Core rules, conventions, and architectural guidelines for the Polling App with QR Code Sharing project.
globs:
alwaysApply: true
---

## Project Overview: Polling App with QR Code Sharing
You are an expert full-stack developer working on the Polling App codebase. Your primary goal is to build a web application that allows users to register, create polls, and share them via unique links and QR codes for others to vote on.

Adhere strictly to the rules, patterns, and conventions outlined in this document to ensure code quality, consistency, and maintainability.

## Technology Stack
The project uses the following technologies. Do not introduce new libraries or frameworks without explicit instruction.

- Language: TypeScript
- Main Framework: Next.js (App Router)
- Database & Auth: Supabase
- Styling: Tailwind CSS with shadcn/ui components
- State Management: Primarily Server Components for server state. Use useState or useReducer for local component state in Client Components.
- API Communication: Use Next.js Server Actions for mutations (creating polls, voting). Fetch data in Server Components using the Supabase client.
- Utility Libraries: A library like qrcode.react for generating QR codes.


## Architecture & Code Style

- Directory Structure: Follow the standard Next.js App Router structure.
    - `/app` for routes and pages.
    - `/components/ui` for `shadcn/ui` components.
    - `/components/` for custom, reusable components.
    - `/lib/supabase` for Supabase client setup, utility functions, and Server Actions.

- Component Design: Prefer Server Components for fetching and displaying data. Use Client Components ('use client') only when interactivity (hooks, event listeners) is required.
- Naming Conventions: Component files should be PascalCase (CreatePollForm.tsx). Utility and action functions should be camelCase (submitVote.ts).
- Error Handling: Use try/catch blocks within Server Actions and Route Handlers. Use Next.js error.tsx files for handling errors within route segments.
- API Keys & Secrets: Never hardcode secrets. Use environment variables (.env.local) for Supabase URL and keys, accessed via process.env.NEXT_PUBLIC_SUPABASE_URL and process.env.SUPABASE_SECRET_KEY.
- Server Components: Use for data fetching and rendering static content. Avoid adding event handlers or hooks that require client-side interactivity.
- Client Components: Use only when necessary (e.g., forms with interactivity, QR code copying). Always declare 'use client' at the top. Minimize client-side bundle size by only including interactivity components as client components.

## Code Patterns to Follow
- Use a form that calls a Server Action to handle data submission. This keeps client-side JavaScript minimal.
- Do not create a separate API route handler and use fetch on the client side to submit form data. Use Server Actions instead.
- Do not fetch data on the client side using useEffect and useState in a page component. Fetch data directly in a Server Component.
- Use Server Actions for submission. Avoid client-side fetch calls for mutations.
- Validate data on the server before processing. Client Components should only handle UI state, validation, and event triggers that call Server Actions.

## Verification Checklist
Before finalizing your response, you MUST verify the following:

- Does the code use the Next.js App Router and Server Components for data fetching?
- Are Server Actions used for data mutations (forms)?
- Is the Supabase client used for all database interactions?
- Are shadcn/ui components used for the UI where appropriate?
- Are Supabase keys and other secrets loaded from environment variables and not hardcoded?

## Folder Structure
- All pages are under `/app`, with nested routes for `/polls`, `/auth`, `/api`.
- Components are organized into `/components`, with UI primitives in `/components/ui`.
- Use **Server Components** for displaying data.
- Use **Client Components** only when interactivity (hooks, event listeners) is required.

## Form Handling
- Use **Server Actions** for form submissions (e.g., create poll, vote).
- Avoid using client-side fetch calls for mutations.
- Use **shadcn/ui** or **react-hook-form** for managing form state.

## Supabase Usage
- All database and auth interactions should be via the Supabase client imported from `/lib/supabase`.
- Never hardcode secrets; always use environment variables (`NEXT_PUBLIC_*` for public keys).
- Use server-side functions for sensitive operations (e.g., vote tallying, poll creation).

## QR Code Sharing
- Implement a dedicated **Client Component** (e.g., `QRCodeShare.tsx`) that receives a poll URL as a prop.
- Use a library like `qrcode.react`.
- Provide accessible buttons for copying QR code and share URL.

## Refactoring & AI Scaffolded Components
- Use AI to scaffold common patterns like:
  - "Create a form to submit a new poll"
  - "Display poll results"
- After scaffolding, verify the code adheres to the rules:
  - R2 for form handling
  - R3 for Supabase usage
  - R4 for QR code sharing

## Observations & Best Practices
- Example: Scaffolded a create poll form with a Server Action, following R2.
- Example: Fetched poll list directly in a server component from `/lib/supabase`, following R1 and R3.
- Example: Built QRCodeShare component passing URL as a prop; fixed initial client fetch to pass data from server, following R4.

## Next Steps
- Continue scaffolding components with AI and verify adherence.
- Update rules based on new patterns observed.
- Document common refactoring patterns for consistency.