import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedScreenBlock } from '../components/navigation/AnimatedScreenBlock';
import { useTheme } from '../theme';

type PlaceholderModuleScreenProps = {
  title: string;
  subtitle: string;
};

export function PlaceholderModuleScreen({ title, subtitle }: PlaceholderModuleScreenProps) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(ds, theme), [ds, theme]);

  return (
    <View style={styles.wrap}>
      <AnimatedScreenBlock index={0}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </AnimatedScreenBlock>

      <AnimatedScreenBlock index={1}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Coming soon - mobile experience aligned with AATOS.</Text>
        </View>
      </AnimatedScreenBlock>
    </View>
  );
}

function createStyles(
  ds: ReturnType<typeof useTheme>['ds'],
  theme: ReturnType<typeof useTheme>['theme'],
) {
  return StyleSheet.create({
    wrap: {
      flex: 1,
      padding: theme.spacing.lg,
      gap: theme.spacing.sm,
      backgroundColor: ds.pageSurface,
    },
    title: {
      fontSize: theme.typography.fontSize.xxl,
      fontWeight: theme.typography.fontWeight.bold,
      color: ds.gray900,
    },
    subtitle: {
      fontSize: theme.typography.fontSize.md,
      color: ds.gray600,
    },
    card: {
      marginTop: theme.spacing.sm,
      backgroundColor: ds.white,
      borderRadius: theme.radius.card,
      padding: theme.spacing.lg,
    },
    cardText: {
      fontSize: theme.typography.fontSize.base,
      lineHeight: 20,
      color: ds.gray600,
    },
  });
}
