import { useMemo, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
import { AuriaGlassButton } from './AuriaGlassButton';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import { useTheme } from '../../theme';

type AuriaRefreshButtonProps = {
  onPress?: () => void;
  accessibilityLabel?: string;
};

export function AuriaRefreshButton({
  onPress,
  accessibilityLabel = 'Refresh suggestions',
}: AuriaRefreshButtonProps) {
  const { ds } = useTheme();
  const styles = useMemo(() => createStyles(), []);
  const spin = useRef(new Animated.Value(0)).current;
  const spinning = useRef(false);

  const handlePress = () => {
    if (spinning.current) return;

    spinning.current = true;
    spin.setValue(0);

    Animated.timing(spin, {
      toValue: 1,
      duration: 620,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start(({ finished }) => {
      spinning.current = false;
      if (finished) {
        spin.setValue(0);
      }
    });

    onPress?.();
  };

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AuriaGlassButton
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={10}
      borderRadius={21}
      surfaceStyle={styles.button}
    >
      <Animated.View style={[styles.iconWrap, { transform: [{ rotate }] }]}>
        <AuriaIcon
          name="arrowPath"
          size={AURIA_ICON_SIZE.sm}
          color={ds.gray600}
          strokeWidth={AURIA_ICON_STROKE_NAV}
        />
      </Animated.View>
    </AuriaGlassButton>
  );
}

function createStyles() {
  return StyleSheet.create({
    button: {
      width: 42,
      height: 42,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
