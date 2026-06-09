import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import { useTheme } from '../../theme';
import { AuriaDrawerToggle } from './AuriaDrawerToggle';
import { AuriaGlassButton } from './AuriaGlassButton';

/** Fixed workspace bar — keep in sync with AuriaScreen top inset. */
export const WORKSPACE_HEADER_HEIGHT = 54;

type AuriaWorkspaceHeaderProps = {
  onToggleSidebar: () => void;
  onNewChat: () => void;
};

export function AuriaWorkspaceHeader({ onToggleSidebar, onNewChat }: AuriaWorkspaceHeaderProps) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(ds, theme), [ds, theme]);

  return (
    <View style={styles.header}>
      <View style={styles.sideRail}>
        <AuriaDrawerToggle onPress={onToggleSidebar} accessibilityLabel="Open history and sidebar" />
      </View>

      <View style={styles.sideRail}>
        <AuriaGlassButton
          onPress={onNewChat}
          accessibilityLabel="New chat"
          hitSlop={8}
          elevated={false}
          borderRadius={theme.radius.md}
          surfaceStyle={styles.sideSlot}
        >
          <AuriaIcon
            name="squarePen"
            size={AURIA_ICON_SIZE.sm}
            color={ds.gray700}
            strokeWidth={AURIA_ICON_STROKE_NAV}
          />
        </AuriaGlassButton>
      </View>
    </View>
  );
}

function createStyles(
  ds: ReturnType<typeof useTheme>['ds'],
  theme: ReturnType<typeof useTheme>['theme'],
) {
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: WORKSPACE_HEADER_HEIGHT,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: 'transparent',
    },
    sideRail: {
      width: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sideSlot: {
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.radius.md,
    },
  });
}
