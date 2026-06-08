import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../theme';

type AuriaLogoMarkProps = {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
};

const MARK_SIZES = {
  sm: { dot: 5, gap: 4 },
  md: { dot: 8, gap: 7 },
  lg: { dot: 10, gap: 9 },
} as const;

export function AuriaLogoMark({ size = 'md', color }: AuriaLogoMarkProps) {
  const { ds } = useTheme();
  const mark = MARK_SIZES[size];
  const dotColor = color ?? ds.auriaBlue;

  return (
    <View style={[styles.grid, { gap: mark.gap }]}>
      <View style={[styles.row, { gap: mark.gap }]}>
        <View
          style={[
            styles.dot,
            { width: mark.dot, height: mark.dot, borderRadius: mark.dot / 2, backgroundColor: dotColor },
          ]}
        />
        <View
          style={[
            styles.dot,
            { width: mark.dot, height: mark.dot, borderRadius: mark.dot / 2, backgroundColor: dotColor },
          ]}
        />
      </View>
      <View style={[styles.row, { gap: mark.gap }]}>
        <View
          style={[
            styles.dot,
            { width: mark.dot, height: mark.dot, borderRadius: mark.dot / 2, backgroundColor: dotColor },
          ]}
        />
        <View
          style={[
            styles.dot,
            {
              width: mark.dot,
              height: mark.dot,
              borderRadius: mark.dot / 2,
              backgroundColor: dotColor,
              opacity: 0.42,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  dot: {},
});
