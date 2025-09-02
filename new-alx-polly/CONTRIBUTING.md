# Contributing to the Polling App

## Code Organization and Consistency

This document provides guidelines for maintaining consistency across the codebase and ensuring all files are correctly connected.

### Directory Structure

The project follows the standard Next.js App Router structure:

- `/app` - Routes and pages
- `/components/ui` - shadcn/ui components
- `/components/` - Custom, reusable components
- `/lib/supabase` - Supabase client setup, utility functions, and Server Actions

### Supabase Integration

**Important:** We currently have two Supabase directories that need to be consolidated:

- `/src/lib/supabase` - Contains database operations and types
- `/src/supabase` - Contains client setup and database types

When working with Supabase:

1. Use the client from `/src/supabase/client.ts`
2. Use the database operations from `/src/lib/supabase/db.ts`
3. Use the types from `/src/supabase/database.types.ts`

### Import Conventions

Use the following import conventions:

- For components: `import { Component } from '@/components/path/Component'`
- For utilities: `import { utility } from '@/lib/path/utility'`
- For Supabase client: `import { supabase } from '@/supabase/client'`
- For database operations: `import { operation } from '@/lib/supabase/db'`

### Verifying Connections

To verify that all files are correctly connected:

1. Run `npm run verify` to check for:
   - Missing imports
   - Duplicate files
   - Inconsistencies in Supabase directories

2. Fix any issues reported by the verification script

### Working with Node.js Scripts

This project uses ES modules for Node.js scripts. When creating or modifying scripts in the `scripts/` directory:

1. Always use ES module syntax (import/export instead of require/module.exports)
2. For file path operations, use the following pattern to replace `__dirname` and `__filename`:

```javascript
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

### Common Issues and Solutions

#### Missing Exports

If you encounter errors about missing exports, check:

1. That the function is properly exported from its source file
2. That you're importing from the correct path
3. That the function name matches exactly (case-sensitive)

#### Duplicate Functionality

Avoid creating duplicate functionality across different directories. If you find duplicate code:

1. Identify the canonical version (usually in `/lib`)
2. Update all imports to reference the canonical version
3. Remove the duplicate implementation

#### Inconsistent Naming

Maintain consistent naming conventions:

- Component files: PascalCase (e.g., `PollCard.tsx`)
- Utility files: camelCase (e.g., `pollUtils.ts`)
- Function names: camelCase (e.g., `createPoll`)
- Component names: PascalCase (e.g., `PollCard`)

### Testing Changes

After making changes to fix connections:

1. Run `npm test` to ensure all tests pass
2. Run `npm run dev` to verify the application works in development
3. Run `npm run verify` again to ensure no new issues were introduced