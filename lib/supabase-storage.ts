import { supabase } from './supabase';

export async function uploadImage(file: File, bucket: string, path: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${path}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (error) {
    console.error('Failed to upload image:', error);
    return null;
  }
}

export async function deleteImage(url: string, bucket: string): Promise<boolean> {
  try {
    const fileName = url.split('/').pop();
    if (!fileName) return false;

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete image:', error);
    return false;
  }
}
