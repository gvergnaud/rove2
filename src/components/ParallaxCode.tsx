import React from 'react';
import useIsMobile from '../hooks/useIsMobile';
import useRelativeScrollYCssVar from '../hooks/useRelativeScrollYCssVar';
import { css } from 'emotion';
import { cn } from '../utils/css';
import AnimatedCode, { Props as AnimatedCodeProps } from './AnimatedCode';
import { useInView } from '../hooks/useInView';
import { valNumber } from '../style/variables';

type Props = Partial<AnimatedCodeProps> & {
  ratio?: number;
  mobileIcon?: string;
};

const useFirstTimeInView = ref => {
  const [inView] = useInView(ref);
  const [firstTimeInView, set] = React.useState(false);
  React.useEffect(() => {
    if (!firstTimeInView && inView) set(true);
  }, [inView]);
  return firstTimeInView;
};

const ParallaxCode = ({
  icon,
  mobileIcon = icon,
  className,
  width = 50,
  height = 50,
  opacity,
  colorRgba = [255 * 0.35, 255 * 0.35, 255 * 0.35, 255],
  ...props
}: Props) => {
  const ratio = 0.4;
  const ref = React.useRef();
  const isMobile = useIsMobile();
  useRelativeScrollYCssVar(ref, 2);
  const firstTimeInView = useFirstTimeInView(ref);

  return isMobile.any ? (
    <img
      ref={ref}
      width={valNumber(width, width)}
      height={valNumber(height, height)}
      className={cn(
        className,
        css`
          opacity: ${firstTimeInView ? opacity : '0'};
          transition: opacity 0.5s ease;
          position: absolute;
          object-fit: contain;
          transform: translateY(calc(var(--relative-scroll-y) * ${ratio}));
        `
      )}
      src={`/static/images/hobocode/${mobileIcon}.png`}
    />
  ) : (
    <AnimatedCode
      ref={ref}
      {...props}
      opacity={opacity}
      icon={icon}
      colorRgba={colorRgba}
      width={valNumber(width, width)}
      height={valNumber(height, height)}
      className={cn(
        className,
        css`
          position: absolute;
          transform: translateY(
            calc(50px + var(--relative-scroll-y) * ${ratio})
          );
        `
      )}
    />
  );
};

export default ParallaxCode;
