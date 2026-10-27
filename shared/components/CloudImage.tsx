import type { ImgHTMLAttributes } from 'react';
import { cloudinarySrc, cloudinarySrcSet, type ImagePreset } from '../utils/cloudinary';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'sizes'> & {
  publicId: string;
  preset: ImagePreset;
};

export default function CloudImage({
  publicId,
  preset,
  alt = '',
  decoding = 'async',
  ...rest
}: Props) {
  return (
    <img
      src={cloudinarySrc(publicId, preset)}
      srcSet={cloudinarySrcSet(publicId, preset)}
      sizes={preset.sizes}
      alt={alt}
      decoding={decoding}
      {...rest}
    />
  );
}
