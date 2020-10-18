import { ColorRgba } from '../../style/variables';

export type Props = {
  src: string;
  zIndex?: number;
  className?: string;
  opacity?: number;
  colorRgba?: ColorRgba;
  borderNoise?: boolean;
  effectValue?: number;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseMove?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
};
