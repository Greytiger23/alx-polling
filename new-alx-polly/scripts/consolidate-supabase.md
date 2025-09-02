# Supabase Directory Consolidation Plan

## Current Structure

We currently have two Supabase-related directories:

1. `/src/lib/supabase/` - Contains:
   - `db.ts` - Database operations
   - `actions.ts` - Server actions
   - `client.ts` - Supabase client initialization
   - `types.ts` - Type definitions

2. `/src/supabase/` - Contains:
   - `actions.ts` - Server actions
   - `client.ts` - Supabase client initialization
   - `database.types.ts` - Generated database types

## Consolidation Strategy

### Step 1: Choose the canonical directory

We will consolidate into `/src/lib/supabase/` as this follows the Next.js convention of putting utilities in the `/lib` directory.

### Step 2: Merge files

1. **Client Setup**
   - Compare both `client.ts` files
   - Keep the more complete implementation in `/src/lib/supabase/client.ts`
   - Ensure environment variables are properly used

2. **Types**
   - Move `/src/supabase/database.types.ts` to `/src/lib/supabase/database.types.ts`
   - Update `/src/lib/supabase/types.ts` to import from `database.types.ts` where appropriate

3. **Actions**
   - Compare both `actions.ts` files
   - Merge functionality into `/src/lib/supabase/actions.ts`
   - Ensure all server actions are properly exported

4. **Database Operations**
   - Keep `/src/lib/supabase/db.ts` as is
   - Ensure it uses the correct client from the consolidated `client.ts`

### Step 3: Update imports

Search for all imports from `/src/supabase/*` and update them to `/src/lib/supabase/*`:

```bash
# Find all imports from /src/supabase
grep -r "from '@/supabase" --include="*.ts" --include="*.tsx" ./src
```

Update each import to use the new path.

### Step 4: Testing

1. Run the verification script: `npm run verify`
2. Run tests: `npm test`
3. Start the development server: `npm run dev`
4. Manually test key functionality

### Step 5: Cleanup

Once everything is working correctly:

1. Remove the `/src/supabase/` directory
2. Update documentation to reflect the new structure

## Rollback Plan

If issues arise during consolidation:

1. Revert all changes
2. Create a more detailed mapping between the two directories
3. Take a more incremental approach, moving one file at a time