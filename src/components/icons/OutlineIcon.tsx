import Svg, { Path } from 'react-native-svg';
import { AURIA_ICON_STROKE, lightTheme } from '../../theme';

export type OutlineIconProps = {
  paths: string | readonly string[];
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function OutlineIcon({
  paths,
  size = 24,
  color = lightTheme.colors.text,
  strokeWidth = AURIA_ICON_STROKE,
}: OutlineIconProps) {
  const pathList = Array.isArray(paths) ? paths : [paths];

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {pathList.map((d) => (
        <Path
          key={d}
          d={d}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </Svg>
  );
}
