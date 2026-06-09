import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AuriaProject, auriaProjects } from '../../data/auriaMockData';
import { auriaTypography, useTheme } from '../../theme';
import { AuriaIcon, AURIA_ICON_SIZE, AURIA_ICON_STROKE_NAV } from '../icons';
import {
  AuriaEmptyState,
  AuriaPanelCard,
  AuriaPanelHeader,
  AuriaPanelScroll,
  AuriaSegmentedControl,
} from './AuriaPanelShared';

const PROJECT_TABS = [
  { id: 'Team', label: 'Team' },
  { id: 'Shared', label: 'Shared' },
] as const;

export function AuriaProjectsPanel({
  projects = auriaProjects,
  onCreateProject,
}: {
  projects?: AuriaProject[];
  onCreateProject?: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [tab, setTab] = useState<AuriaProject['visibility']>('Team');
  const items = projects.filter((project) => project.visibility === tab);

  return (
    <AuriaPanelScroll>
      <AuriaPanelHeader title="Projects" subtitle="Organize shared workspace context." />
      <AuriaSegmentedControl value={tab} items={PROJECT_TABS} onChange={setTab} />

      {items.length ? (
        <View style={styles.list}>
          {items.map((project) => (
            <AuriaPanelCard key={project.id} style={styles.projectCard}>
              <View style={[styles.projectIcon, { backgroundColor: project.accent }]}>
                <Text style={styles.projectEmoji}>{project.emoji}</Text>
              </View>
              <View style={styles.projectCopy}>
                <Text style={styles.projectName}>{project.name}</Text>
                <Text style={styles.projectMeta}>
                  {project.fileCount} files {'\u00B7'} {project.chatCount} chats {'\u00B7'}{' '}
                  {project.updatedLabel}
                </Text>
                <Text style={styles.projectOwner}>{project.owner}</Text>
              </View>
            </AuriaPanelCard>
          ))}
        </View>
      ) : (
        <AuriaEmptyState
          title={`No ${tab.toLowerCase()} projects`}
          message="Create a project to start organizing files and conversations."
        />
      )}

      <Pressable
        style={styles.newProjectButton}
        onPress={onCreateProject}
        accessibilityRole="button"
      >
        <AuriaIcon
          name="folderPlus"
          size={AURIA_ICON_SIZE.sm}
          strokeWidth={AURIA_ICON_STROKE_NAV}
        />
        <Text style={styles.newProjectText}>New project</Text>
      </Pressable>
    </AuriaPanelScroll>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    list: {
      gap: 8,
    },
    projectCard: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    projectIcon: {
      width: 44,
      height: 44,
      borderRadius: theme.radius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    projectEmoji: {
      ...auriaTypography.label,
      color: theme.colors.surface,
      fontSize: 18,
      fontWeight: theme.typography.fontWeight.extrabold,
    },
    projectCopy: {
      flex: 1,
      gap: 4,
    },
    projectName: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    projectMeta: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 12,
      lineHeight: 17,
    },
    projectOwner: {
      ...auriaTypography.body,
      color: theme.colors.textTertiary,
      fontSize: 11,
    },
    newProjectButton: {
      minHeight: 46,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      backgroundColor: theme.colors.glassFill,
    },
    newProjectText: {
      ...auriaTypography.body,
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: theme.typography.fontWeight.bold,
    },
  });
}
