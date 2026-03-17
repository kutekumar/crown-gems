# Fix: App Stuck in Loading State

## Problem
After fixing the `product_id` column issue, the app was stuck in a loading state when clicking "Message Seller". The console showed:
- `useMessages.ts:58 Waiting for role to be loaded...`
- `Messages.tsx:18 Messages page - user: f5298383-a4d7-422b-af53-baa2c023cb7d role: null authLoading: false conversations: 0 loading: true`
- 406 (Not Acceptable) errors when querying `admin_users` table

## Root Causes
1. **Non-existent `admin_users` table**: The code was trying to query an `admin_users` table that doesn't exist in the database
2. **Role loading issue**: The `useMessages` hook was waiting indefinitely for the role to be loaded, but the role was `null` because the user didn't have a role assigned in the `user_roles` table
3. **No default role**: The `AuthContext` wasn't setting a default role when no role was found

## Fixes Applied

### 1. Fixed `src/components/layout/Header.tsx`
- Changed from querying non-existent `admin_users` table to querying `user_roles` table
- Changed `.single()` to `.maybeSingle()` to avoid errors when no rows are found

### 2. Fixed `src/pages/AdminDashboard.tsx`
- Changed from querying non-existent `admin_users` table to querying `user_roles` table
- Changed `.single()` to `.maybeSingle()` to avoid errors when no rows are found

### 3. Fixed `src/hooks/useMessages.ts`
- Removed the check that was waiting for role to be loaded
- Added default role logic: if role is `null`, assume "buyer" (default role)
- This prevents the app from getting stuck in a loading state

### 4. Fixed `src/contexts/AuthContext.tsx`
- Added default role assignment: if no role is found in `user_roles` table, set role to "buyer"
- This ensures the role is never `null` after authentication

## How It Works Now
1. When a user logs in, the `AuthContext` fetches their role from `user_roles` table
2. If no role is found, it defaults to "buyer"
3. The `useMessages` hook uses this role (or defaults to "buyer" if still null)
4. The app no longer gets stuck waiting for role to be loaded
5. No more 406 errors from querying non-existent `admin_users` table

## Testing
After these fixes:
1. Refresh your browser
2. Log in as a buyer
3. Navigate to any product page
4. Click "Message Seller" or "Contact"
5. The conversation should start successfully without getting stuck in loading state

## Files Modified
- `src/components/layout/Header.tsx`
- `src/pages/AdminDashboard.tsx`
- `src/hooks/useMessages.ts`
- `src/contexts/AuthContext.tsx`
