import { Image, ImageProps } from 'expo-image';
import React from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
  placeholder?: string;
  fallback?: string;
}

export function OptimizedImage({
  uri,
  placeholder = 'https://via.placeholder.com/200x200/F3F4F6/9CA3AF?text=Chargement...',
  style,
  ...props
}: OptimizedImageProps) {
  return (
    <Image
      source={{ uri }}
      style={style}
      placeholder={placeholder}
      placeholderContentFit="cover"
      transition={200}
      contentFit="cover"
      cachePolicy="memory-disk"
      onError={() => {
        // You could log errors here or show a toast
        console.warn(`Failed to load image: ${uri}`);
      }}
      {...props}
    />
  );
}
