import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AuriaGlassButton } from './AuriaGlassButton';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import { useTheme } from '../../theme';

type AuriaDrawerToggleProps = {
  onPress: () => void;
  accessibilityLabel?: string;
};

export function AuriaDrawerToggle({
  onPress,
  accessibilityLabel = 'Open menu',
}: AuriaDrawerToggleProps) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <AuriaGlassButton
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      borderRadius={theme.radius.md}
      elevated={false}
      surfaceStyle={styles.button}
    >
      <AuriaIcon
        name="panelLeft"
        size={AURIA_ICON_SIZE.md}
        color={ds.offBlack}
        strokeWidth={AURIA_ICON_STROKE_NAV}
      />
    </AuriaGlassButton>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    button: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
