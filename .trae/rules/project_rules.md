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

## Data Fetching & State
- Fetch all data in Server Components directly via Supabase.
- Use caching strategies (e.g., server-side caching, revalidation) where appropriate.
- Avoid fetching data in useEffect or client-only hooks unless necessary for interactivity.

## Environment Variables & Secrets
- Only expose non-sensitive public keys via NEXT_PUBLIC_*.
- Keep secret keys in server-only environment variables (SUPABASE_SECRET_KEY) and ensure they are used only in server-side code.
- Never include secrets in client-side code or commit to version control.

## QR Code Generation & Sharing
- Use a dedicated React component (Client Component) for QR code rendering.
- Pass poll share URLs as props.
- Use libraries like qrcode.react or similar, imported only in client components.
- Support copying QR code or share URLs with a button, with proper accessibility.

## Naming & File Organization
- Maintain PascalCase for component filenames.
- Organize /components/ui for shadcn/ui primitives.
- Organize /components for custom, composite components.
- Keep server-side logic in /lib or /app/api with clear separation.

## Accessibility & UX
- Ensure all interactive elements (buttons, links) are accessible.
- Use semantic HTML elements.
- Provide visual cues for loading states, errors, and success messages.

## Testing & Debugging
- Write unit tests for Server Actions and utility functions.
- Use React Testing Library for client components.
- Use Next.js error boundary (error.tsx) for catching unhandled errors.

## Documentation & Comments
- Comment complex logic, especially within Server Actions.
- Document component purpose, props, and expected behaviors.
- Maintain a README with setup instructions, environment variable setup, and architecture overview.