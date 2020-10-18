import omit from 'lodash/omit';
import React from 'react';
import ShaderImagesContext from '../../contexts/shaderImages';
import NormalImage from './NormalImage';
import ShaderImage from './ShaderImage';
import { Props } from './types';
import useIsMobile from '../../hooks/useIsMobile';

function Image({ effectValue, ...props }: Props) {
  const displayShaderImages = React.useContext(ShaderImagesContext);
  const isMobile = useIsMobile();

  return displayShaderImages && !isMobile.any ? (
    <ShaderImage {...props} effectValue={effectValue} />
  ) : (
    <NormalImage {...omit(props, ['borderNoise'])} />
  );
}

export default React.memo(Image);
