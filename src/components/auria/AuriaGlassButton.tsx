import { ReactNode, useMemo } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { LiquidGlassSurface } from '../ui/LiquidGlassSurface';
import { useTheme } from '../../theme';

type AuriaGlassButtonProps = {
  onPress?: () => void;
  children: ReactNode;
  style?: ViewStyle;
  surfaceStyle?: ViewStyle;
  borderRadius?: number;
  accessibilityLabel?: string;
  hitSlop?: number;
  disabled?: boolean;
  elevated?: boolean;
};

/** Interactive Liquid Glass control — uses native GlassView on iOS 26+. */
export function AuriaGlassButton({
  onPress,
  children,
  style,
  surfaceStyle,
  borderRadius,
  accessibilityLabel,
  hitSlop,
  disabled,
  elevated = true,
}: AuriaGlassButtonProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const radius = borderRadius ?? theme.radius.pill;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      hitSlop={hitSlop}
      style={({ pressed }) => [style, pressed && !disabled && styles.pressed]}
    >
      <LiquidGlassSurface
        variant="input"
        interactive
        elevated={elevated}
        elevationLevel="input"
        borderRadius={radius}
        style={surfaceStyle}
      >
        {children}
      </LiquidGlassSurface>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    pressed: {
      transform: [{ scale: 0.96 }],
    },
  });
}
