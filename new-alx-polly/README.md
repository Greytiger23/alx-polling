# ALX Polly - Interactive Polling Application

> A modern, full-stack polling application built with Next.js and Supabase, featuring real-time voting, QR code sharing, and comprehensive analytics.

## 🚀 Project Overview

ALX Polly is a sophisticated polling platform that enables users to create, share, and participate in polls with ease. The application supports both authenticated and anonymous voting, real-time results visualization, and seamless poll sharing through QR codes and direct links.

### ✨ Key Features

- **🗳️ Poll Creation & Management**: Create polls with multiple options and customizable settings
- **📊 Real-time Voting**: Cast votes with instant result updates and visual progress bars
- **👤 User Authentication**: Secure user registration and login via Supabase Auth
- **🔗 QR Code Sharing**: Generate and share polls via QR codes for easy access
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **🔒 Anonymous Voting**: Support for both authenticated and anonymous participation
- **📈 Vote Analytics**: Comprehensive voting statistics and result visualization
- **⚡ Performance Optimized**: Server-side rendering with optimized database queries

## 🛠️ Technology Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Modern UI component library
- **[React](https://reactjs.org/)** - Component-based UI library

### Backend & Database
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service platform
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication and authorization
  - Edge Functions for serverless computing

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Jest](https://jestjs.io/)** - Testing framework
- **[PostCSS](https://postcss.org/)** - CSS processing

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Supabase account** for database and authentication
- **Git** for version control

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd new-alx-polly
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Add your Supabase client configuration:

```env
# Supabase (client) Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# DO NOT put service role keys in .env.local (browser-exposed)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Option A: Using Supabase Dashboard
1. Create a new Supabase project
2. Navigate to the SQL Editor
3. Run the schema from `supabase-schema.sql`
4. Enable Realtime on the tables you will subscribe to (Database → Replication → Publications)
5. Ensure RLS is enabled and policies from the schema are applied to match your privacy model

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📖 Usage Guide

### Creating a Poll

1. **Sign Up/Login**: Create an account or sign in to your existing account
2. **Navigate to Create Poll**: Click "Create Poll" from the dashboard
3. **Fill Poll Details**:
   - Enter your poll question
   - Add multiple choice options (minimum 2)
   - Configure settings (anonymous voting, multiple votes, etc.)
4. **Publish**: Click "Create Poll" to make it live
5. **Share**: Use the generated QR code or direct link to share your poll

### Voting on Polls

1. **Access Poll**: Scan QR code or visit the poll link
2. **Select Option**: Choose your preferred option from the list
3. **Cast Vote**: Click "Vote" to submit your choice
4. **View Results**: See real-time results with visual progress bars

### Managing Your Polls

- **Dashboard**: View all your created polls
- **Edit Polls**: Modify poll details and settings
- **Analytics**: Access detailed voting statistics
- **Delete Polls**: Remove polls you no longer need

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Verification

Verify project integrity and connections:

```bash
npm run verify
```

This checks for:
- Missing imports and dependencies
- File consistency across directories
- Supabase configuration issues

## 📁 Project Structure

```
new-alx-polly/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── polls/             # Poll-related pages
│   │   └── api/               # API routes
│   ├── components/            # Reusable React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── auth/             # Authentication components
│   │   └── polls/            # Poll-specific components
│   ├── lib/                  # Utility functions and configurations
│   │   └── supabase/         # Supabase client and database functions
│   └── test/                 # Test files and utilities
├── public/                   # Static assets
├── scripts/                  # Build and utility scripts
├── supabase-schema.sql      # Database schema
└── package.json             # Project dependencies
```

## 🔧 Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode

# Utilities
npm run verify       # Verify project integrity
```

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment**: Add environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically build and deploy your application

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Greytiger23/new-alx-polly)

Check the [Issues](https://github.com/Greytiger23/new-alx-polly/issues) page

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/alx-polly/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Supabase](https://supabase.com/) for the powerful backend platform
- [Vercel](https://vercel.com/) for seamless deployment
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

---

**Built with ❤️ by the ALX Polly Team**
