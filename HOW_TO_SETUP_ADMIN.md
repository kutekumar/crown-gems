# How to Setup Admin Account

## Step 1: Run the Admin Setup SQL

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/vhuenludpazuzmsylnxa
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file: `gems-link/ADMIN_SETUP.sql`
5. Copy ALL the content and paste into SQL Editor
6. Click **"Run"**
7. Wait for success message

## Step 2: Register Your Admin Account

1. Go to your app (http://localhost:8081/)
2. Click **"Sign In"**
3. Register with your email (example: admin@mingalarmon.com)
4. Complete the registration

## Step 3: Make Yourself Admin

1. Go back to Supabase SQL Editor
2. Run this query (replace with YOUR email):

```sql
INSERT INTO public.admin_users (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'your-email@example.com';
```

For example:
```sql
INSERT INTO public.admin_users (user_id, email)
SELECT id, email
FROM auth.users
WHERE email = 'admin@mingalarmon.com';
```

## Step 4: Access Admin Dashboard

1. Log out and log back in
2. Navigate to: http://localhost:8081/admin
3. You should see the Admin Dashboard with:
   - Pending seller applications
   - Ability to Approve/Reject applications
   - List of active sellers

## How to Approve Seller Applications

1. Go to Admin Dashboard
2. See all pending applications
3. Click on an application to view details
4. Click **"Approve"** to create seller account
   - Seller account will be created
   - Logo and cover images will be transferred
   - Seller will be verified automatically
5. Click **"Reject"** to deny application

## Important Notes

- Only users in the `admin_users` table can access admin dashboard
- You can add multiple admins by inserting more emails
- Approved sellers can immediately access their seller dashboard
- Seller logo and cover images are preserved during approval

## Troubleshooting

**"Access Denied" error?**
- Make sure you ran the admin SQL setup
- Make sure you inserted your email into admin_users table
- Log out and log back in

**Can't see seller applications?**
- Check if any users have applied to be sellers
- Verify the seller_applications table has data

**Approval doesn't work?**
- Check browser console for errors
- Verify the SQL functions were created correctly
