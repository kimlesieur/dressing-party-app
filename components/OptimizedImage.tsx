import { Image, ImageProps } from 'expo-image';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  uri: string;
}

export function OptimizedImage({ uri, style, ...props }: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={style}>
      <Image
        source={{ uri }}
        style={StyleSheet.absoluteFill}
        cachePolicy="memory-disk"
        contentFit="cover"
        onError={() => {
          // You could log errors here or show a toast
          console.warn(`Failed to load image: ${uri}`);
          setIsLoading(false);
        }}
        onLoadEnd={() => setIsLoading(false)}
        transition={200}
        {...props}
      />
      {isLoading && (
        <ActivityIndicator
          color="#9CA3AF"
          size="large"
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}
