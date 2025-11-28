export const DEFAULT_IMAGES = {
  product: 'https://placehold.co/400x400/3b82f6/ffffff?text=Product',
  blog: 'https://placehold.co/800x400/8b5cf6/ffffff?text=Blog+Post',
  banner: 'https://placehold.co/1200x400/10b981/ffffff?text=Location+Banner',
  profile: 'https://placehold.co/200x200/6366f1/ffffff?text=User',
  logo: 'https://placehold.co/100x100/ef4444/ffffff?text=Logo',
};

export function getImageUrl(imageUrl: string | null | undefined, type: keyof typeof DEFAULT_IMAGES = 'product'): string {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }
  return DEFAULT_IMAGES[type];
}

export function getImageUrls(imageUrls: string[] | null | undefined, type: keyof typeof DEFAULT_IMAGES = 'banner'): string[] {
  if (!imageUrls || imageUrls.length === 0) {
    return [DEFAULT_IMAGES[type]];
  }
  
  return imageUrls.map(url => getImageUrl(url, type));
}

