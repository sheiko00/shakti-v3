'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getProducts() {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch products' };
  }
}

export async function createProduct(formData: FormData) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const slug = formData.get('slug') as string;
  const brand = formData.get('brand') as string;
  const description = formData.get('description') as string;
  const basePrice = parseFloat(formData.get('basePrice') as string);
  const cost = formData.get('cost') ? parseFloat(formData.get('cost') as string) : undefined;
  const category = formData.get('category') as string;
  const currency = formData.get('currency') as string || 'USD';
  const coverImageUrl = formData.get('coverImageUrl') as string;
  const tagsString = formData.get('tags') as string;
  const tags = tagsString ? tagsString.split(',').map(t => t.trim()) : [];
  
  // Extract variant data
  const variantSku = formData.get('variantSku') as string;
  const variantColor = formData.get('variantColor') as string;
  const variantSize = formData.get('variantSize') as string;
  
  const variants = variantSku ? [{
    sku: variantSku,
    attributes: { color: variantColor, size: variantSize },
    stockQuantity: 0,
  }] : [];

  try {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        slug,
        brand,
        description,
        basePrice,
        cost,
        category,
        currency,
        coverImageUrl,
        tags,
        variants
      }),
    });

    if (!res.ok) throw new Error('Failed to create product');
    
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create product' };
  }
}
