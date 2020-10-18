import React from 'react';
import ShaderImagesContext from '../../contexts/shaderImages';
import NormalVideo from './NormalVideo';
import ShaderVideo from './ShaderVideo';
import ShaderImage from '../Image/ShaderImage';
import { Props as ImageProps } from '../Image/types';
import useIsMobile from '../../hooks/useIsMobile';
import NormalImage from '../Image/NormalImage';
import { isSlowNetwork } from '../../utils/connection';
import useIsSlowNetwork from '../../hooks/useIsSlowNetwork';

type Props = ImageProps & {
  mobileImageSrc: string;
  effectValue?: number;
  zoom?: number;
};

function Video({ mobileImageSrc, effectValue, zoom, ...props }: Props, ref) {
  const displayShaderImages = React.useContext(ShaderImagesContext);
  const isMobile = useIsMobile();
  const slowNetwork = useIsSlowNetwork();

  return (isMobile.any || slowNetwork) && mobileImageSrc ? (
    displayShaderImages ? (
      <ShaderImage
        {...props}
        ref={ref}
        src={mobileImageSrc}
        effectValue={effectValue}
      />
    ) : (
      <NormalImage {...props} ref={ref} src={mobileImageSrc} />
    )
  ) : displayShaderImages ? (
    <ShaderVideo {...props} zoom={zoom} ref={ref} effectValue={effectValue} />
  ) : (
    <NormalVideo {...props} ref={ref} />
  );
}

export default React.memo(React.forwardRef(Video));
