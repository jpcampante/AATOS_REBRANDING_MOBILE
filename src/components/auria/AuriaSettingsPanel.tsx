import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { auriaTypography, useTheme } from '../../theme';
import { AuriaIcon, AURIA_ICON_SIZE } from '../icons';
import { AuriaPanelScroll } from './AuriaPanelShared';

export function AuriaSettingsPanel() {
  const { theme, preference, setPreference } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [notifications, setNotifications] = useState(true);
  const [memory, setMemory] = useState(true);
  const [activity, setActivity] = useState(false);

  return (
    <AuriaPanelScroll>
      <View style={styles.heading}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage Auria, your workspace, and data preferences.</Text>
      </View>

      <SettingsSection title="Account">
        <View style={styles.profileRow}>
          <View style={styles.avatar}><Text style={styles.avatarText}>MA</Text></View>
          <View style={styles.copy}>
            <Text style={styles.rowTitle}>Marta</Text>
            <Text style={styles.rowDescription}>Workspace administrator</Text>
          </View>
          <AuriaIcon name="moreHorizontal" size={AURIA_ICON_SIZE.sm} tertiary />
        </View>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <Text style={styles.rowTitle}>Theme</Text>
        <View style={styles.themeOptions}>
          {(['light', 'dark', 'system'] as const).map((value) => {
            const active = preference === value;
            return (
              <Pressable
                key={value}
                onPress={() => setPreference(value)}
                style={[styles.themeOption, active && styles.themeOptionActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.themeOptionText, active && styles.themeOptionTextActive]}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </SettingsSection>

      <SettingsSection title="Auria">
        <SettingSwitch
          title="Memory"
          description="Allow Auria to remember useful workspace context."
          value={memory}
          onValueChange={setMemory}
        />
        <SettingSwitch
          title="Notifications"
          description="Receive updates when Auria finishes work."
          value={notifications}
          onValueChange={setNotifications}
        />
      </SettingsSection>

      <SettingsSection title="Privacy and data">
        <SettingSwitch
          title="Activity history"
          description="Store prompts and activity in this workspace."
          value={activity}
          onValueChange={setActivity}
        />
        <SettingsLink title="Connected files" description="Review files available to Auria." />
        <SettingsLink title="Data controls" description="Manage exports, retention, and deletion." />
      </SettingsSection>
    </AuriaPanelScroll>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.sectionWrap}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.section}>{children}</View>
    </View>
  );
}

function SettingSwitch({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <View style={styles.settingRow}>
      <View style={styles.copy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function SettingsLink({ title, description }: { title: string; description: string }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <Pressable style={styles.settingRow} accessibilityRole="button">
      <View style={styles.copy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDescription}>{description}</Text>
      </View>
      <AuriaIcon name="chevronRight" size={AURIA_ICON_SIZE.xs} tertiary />
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    heading: { gap: 5, paddingBottom: 6 },
    title: { ...auriaTypography.title, fontSize: 29, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.text },
    subtitle: { ...auriaTypography.body, fontSize: 13, lineHeight: 19, color: theme.colors.textTertiary },
    sectionWrap: { gap: 7 },
    sectionTitle: { ...auriaTypography.label, paddingHorizontal: 4, fontSize: 11, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.textTertiary, textTransform: 'uppercase' },
    section: { overflow: 'hidden', borderWidth: 1, borderColor: theme.colors.divider, borderRadius: 18, backgroundColor: theme.colors.surface },
    settingRow: { minHeight: 66, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: theme.colors.divider },
    profileRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
    avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.offBlack },
    avatarText: { ...auriaTypography.label, color: theme.colors.surface, fontWeight: theme.typography.fontWeight.bold },
    copy: { flex: 1, gap: 3 },
    rowTitle: { ...auriaTypography.body, fontSize: 14, fontWeight: theme.typography.fontWeight.semibold, color: theme.colors.text },
    rowDescription: { ...auriaTypography.body, fontSize: 12, lineHeight: 17, color: theme.colors.textTertiary },
    themeOptions: { flexDirection: 'row', gap: 7, padding: 12 },
    themeOption: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1, borderColor: theme.colors.divider, borderRadius: theme.radius.pill },
    themeOptionActive: { backgroundColor: theme.colors.offBlack, borderColor: theme.colors.offBlack },
    themeOptionText: { ...auriaTypography.body, fontSize: 12, color: theme.colors.textSecondary },
    themeOptionTextActive: { color: theme.colors.surface, fontWeight: theme.typography.fontWeight.semibold },
  });
}
