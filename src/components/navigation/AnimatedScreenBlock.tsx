import { ReactNode, useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet } from 'react-native';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';
const CAN_ANIMATE_OPACITY = Platform.OS !== 'ios';

type AnimatedScreenBlockProps = {
  index: number;
  children: ReactNode;
  distance?: number;
  delayStep?: number;
  /** Shrink-wrap and center on cross-axis instead of stretching full width. */
  centered?: boolean;
};

export function AnimatedScreenBlock({
  index,
  children,
  distance = 18,
  delayStep = 55,
  centered = false,
}: AnimatedScreenBlockProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    opacity.stopAnimation();
    translateY.stopAnimation();

    opacity.setValue(0);
    translateY.setValue(distance);

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        delay: index * delayStep,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        delay: index * delayStep,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delayStep, distance, index, opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.block,
        centered ? styles.blockCentered : null,
        CAN_ANIMATE_OPACITY ? { opacity, transform: [{ translateY }] } : { transform: [{ translateY }] },
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: {
    width: '100%',
  },
  blockCentered: {
    width: '100%',
    alignSelf: 'center',
  },
});
