# ALX Polling App

A polling application built with **Next.js 14**, **TypeScript**, and **Shadcn/UI**.
This app allows users to register, log in, view polls, and create new polls.
It's scaffolded for integration with **Supabase** (authentication + database).

---

## Features

- User authentication (Login & Register)
- Poll listing & viewing
- Create new polls with multiple options
- Vote on polls
- View poll results in real time
- Supabase integration for data & auth

## Project Structure

```
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── auth/             # Authentication pages
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Registration page
│   │   │   └── logout/       # Logout functionality
│   │   ├── polls/            # Poll-related pages
│   │   │   ├── [id]/         # Individual poll page
│   │   │   └── create/       # Create poll page
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   │   ├── auth/             # Authentication components
│   │   ├── polls/            # Poll-related components
│   │   └── ui/               # Shadcn UI components
│   └── lib/                  # Utility functions
│       └── supabase/         # Supabase client and helpers
└── README.md                 # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/alx-polly.git
   cd alx-polly
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.
