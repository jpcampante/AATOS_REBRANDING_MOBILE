import { useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AuriaProjectVisibility, auriaWorkspaceName } from '../../data/auriaMockData';
import { AuriaGlassButton } from './AuriaGlassButton';
import { LiquidGlassSurface } from '../ui/LiquidGlassSurface';
import { auriaTypography, useTheme } from '../../theme';

export type AuriaNewProjectInput = {
  name: string;
  visibility: AuriaProjectVisibility;
};

type AuriaNewProjectModalProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (input: AuriaNewProjectInput) => void;
};

const inputWebFocusReset =
  Platform.OS === 'web'
    ? ({
        outlineWidth: 0,
        outlineStyle: 'none',
        boxShadow: 'none',
      } as object)
    : null;

export function AuriaNewProjectModal({ visible, onClose, onCreate }: AuriaNewProjectModalProps) {
  const { ds, theme } = useTheme();
  const styles = useMemo(() => createStyles(ds, theme), [ds, theme]);
  const isIosSheet = Platform.OS === 'ios';

  const [name, setName] = useState('');
  const [visibility, setVisibility] = useState<AuriaProjectVisibility>('Team');

  useEffect(() => {
    if (!visible) {
      setName('');
      setVisibility('Team');
    }
  }, [visible]);

  const trimmedName = name.trim();
  const canCreate = trimmedName.length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    Keyboard.dismiss();
    onCreate({ name: trimmedName, visibility });
  };

  const sheetContent = (
    <>
      <Text style={styles.title}>New project</Text>
      <Text style={styles.subtitle}>Choose a name and sharing rules before creating it.</Text>

      <Text style={styles.label}>Project name</Text>
      <LiquidGlassSurface variant="input" interactive elevated elevationLevel="input" borderRadius={theme.radius.md}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Untitled project"
          placeholderTextColor={ds.gray400}
          style={styles.input}
          autoFocus={visible && !isIosSheet}
          returnKeyType="done"
          onSubmitEditing={handleCreate}
        />
      </LiquidGlassSurface>

      <Text style={styles.label}>Company access</Text>
      <View style={styles.chipsRow}>
        {(['Team', 'Shared'] as const).map((option) => {
          const active = visibility === option;
          if (active) {
            return (
              <Pressable
                key={option}
                style={styles.chipActive}
                onPress={() => setVisibility(option)}
                accessibilityRole="button"
              >
                <Text style={styles.chipTextActive}>{option}</Text>
              </Pressable>
            );
          }

          return (
            <AuriaGlassButton
              key={option}
              elevated={false}
              onPress={() => setVisibility(option)}
              borderRadius={theme.radius.pill}
              surfaceStyle={styles.chipSurface}
            >
              <Text style={styles.chipText}>{option}</Text>
            </AuriaGlassButton>
          );
        })}
      </View>

      <Text style={styles.companyHint}>
        {visibility === 'Shared'
          ? `Everyone at ${auriaWorkspaceName} can view and use this project.`
          : `Only invited members from ${auriaWorkspaceName} can use this project.`}
      </Text>

      <View style={styles.actions}>
        <AuriaGlassButton onPress={onClose} borderRadius={theme.radius.pill} surfaceStyle={styles.actionGlass}>
          <Text style={styles.cancelText}>Cancel</Text>
        </AuriaGlassButton>
        <Pressable
          style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={!canCreate}
          accessibilityRole="button"
        >
          <Text style={styles.createText}>Create project</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <Modal
      visible={visible}
      transparent={!isIosSheet}
      animationType={isIosSheet ? 'slide' : 'fade'}
      presentationStyle={isIosSheet ? 'pageSheet' : 'overFullScreen'}
      onRequestClose={onClose}
    >
      {isIosSheet ? (
        <ScrollView
          contentContainerStyle={styles.iosSheet}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {sheetContent}
        </ScrollView>
      ) : (
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <Pressable
            style={styles.backdrop}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close"
          />
          <LiquidGlassSurface
            elevated
            elevationLevel="modal"
            borderRadius={theme.radius.panel}
            style={styles.sheet}
          >
            {sheetContent}
          </LiquidGlassSurface>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}

function createStyles(
  ds: ReturnType<typeof useTheme>['ds'],
  theme: ReturnType<typeof useTheme>['theme'],
) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.offBlackOverlay,
    },
    iosSheet: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 28,
      gap: 12,
    },
    sheet: {
      padding: 20,
      gap: 12,
    },
    title: {
      ...auriaTypography.title,
      fontSize: 18,
      fontWeight: theme.typography.fontWeight.bold,
      color: ds.gray900,
      letterSpacing: -0.2,
    },
    subtitle: {
      ...auriaTypography.body,
      fontSize: 13,
      lineHeight: 18,
      color: ds.gray500,
      marginTop: -4,
    },
    label: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: ds.gray900,
      marginTop: 4,
    },
    input: {
      ...auriaTypography.body,
      fontSize: 16,
      fontWeight: theme.typography.fontWeight.medium,
      color: ds.gray900,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: 'transparent',
      borderWidth: 0,
      ...(inputWebFocusReset ?? {}),
    },
    chipsRow: {
      flexDirection: 'row',
      gap: 8,
    },
    chipSurface: {
      paddingHorizontal: 14,
      paddingVertical: 9,
    },
    chipActive: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: theme.radius.pill,
      backgroundColor: ds.offBlack,
    },
    chipText: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: ds.gray700,
    },
    chipTextActive: {
      ...auriaTypography.body,
      color: ds.white,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
    },
    companyHint: {
      ...auriaTypography.body,
      fontSize: 12,
      lineHeight: 17,
      color: ds.gray500,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 10,
      marginTop: 8,
    },
    actionGlass: {
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    cancelText: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: ds.gray700,
    },
    createButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: theme.radius.pill,
      backgroundColor: ds.offBlack,
    },
    createButtonDisabled: {
      opacity: 0.45,
    },
    createText: {
      ...auriaTypography.body,
      fontSize: 13,
      fontWeight: theme.typography.fontWeight.semibold,
      color: ds.white,
    },
  });
}
