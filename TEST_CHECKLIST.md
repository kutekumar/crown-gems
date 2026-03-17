# GemsLink New Features Test Checklist

## ✅ Features to Test

### 1. Seller Logo and Cover Image Upload
- [ ] Navigate to seller application form
- [ ] Upload a logo image (should show preview)
- [ ] Remove and re-upload logo
- [ ] Upload a cover image (should show preview)
- [ ] Try uploading file > 5MB (should show error)
- [ ] Submit form with images
- [ ] Verify images are stored in Supabase storage

### 2. Seller Profile Page
- [ ] Create a seller account with products
- [ ] Navigate to any product detail page
- [ ] Click on the seller's name or avatar
- [ ] Should redirect to `/seller/:id`
- [ ] Verify seller's logo displays correctly
- [ ] Verify seller's cover image displays correctly
- [ ] Verify seller information (name, location, rating, etc.)
- [ ] Verify "Contact" button works

### 3. Filtered Seller Products
- [ ] On seller profile page, verify only that seller's products show
- [ ] Create products from multiple sellers
- [ ] Navigate to different seller profiles
- [ ] Confirm each seller page only shows their own products
- [ ] Verify product count is accurate

### 4. Product Rating System
- [ ] Sign in as a buyer
- [ ] Navigate to a product detail page
- [ ] Click "Write Review" button
- [ ] Rate product with diamond rating (1-5)
- [ ] Add optional comment
- [ ] Submit review
- [ ] Verify review appears in the product reviews section
- [ ] Verify average rating updates
- [ ] Edit your review (click edit icon)
- [ ] Delete your review (click delete icon)
- [ ] Verify seller's rating updates based on product reviews

## 🔍 Database Verification

Run these queries to verify data:

```sql
-- Check seller images
SELECT id, business_name, logo_url, cover_image_url FROM sellers;

-- Check product reviews
SELECT * FROM product_reviews;

-- Check storage bucket
SELECT * FROM storage.objects WHERE bucket_id = 'seller-images';
```

## 🐛 Known Limitations

- Logo and cover images are optional during seller application
- Reviews can only be left by authenticated users
- One review per user per product (enforced by unique constraint)
- Seller ratings auto-update when product reviews change

## 📝 Notes

- Make sure to run the migration first: `npx supabase db reset --local`
- Development server should be running: `npm run dev`
- Access at: http://localhost:8081/
