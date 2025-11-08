'use client';
import { Image as HeroImage, type ImageProps } from '@heroui/react';

export function Image(props: ImageProps) {
  return <HeroImage fallbackSrc={'/fallback.jpg'} {...props} />;
}
