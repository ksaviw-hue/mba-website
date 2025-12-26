# Supabase Storage Setup

To enable image uploads for teams and articles, you need to create storage buckets in Supabase.

## Steps:

1. Go to your Supabase project: https://app.supabase.com/project/hhyqkflwqlfzjvswarty

2. Navigate to **Storage** in the left sidebar

3. Click **Create a new bucket** and create the following buckets:

   ### Bucket 1: team-logos
   - Name: `team-logos`
   - Public: ✅ Yes (Make files publicly accessible)
   - File size limit: 5 MB
   - Allowed MIME types: `image/*`

   ### Bucket 2: article-images
   - Name: `article-images`
   - Public: ✅ Yes (Make files publicly accessible)
   - File size limit: 10 MB
   - Allowed MIME types: `image/*`

4. (Optional) Set up policies for authenticated uploads:
   - Go to **Policies** tab for each bucket
   - Add INSERT policy for authenticated users
   - Add SELECT policy for public access

## Testing

After creating the buckets:
1. Restart your dev server
2. Go to Admin panel → Teams tab
3. Try uploading a logo when creating/editing a team
4. The image should upload to Supabase Storage and display in the form

## Troubleshooting

If uploads fail:
- Check browser console for errors
- Verify bucket names match exactly: `team-logos` and `article-images`
- Ensure buckets are set to Public
- Check that your Supabase URL and keys are correct in `.env.local`
