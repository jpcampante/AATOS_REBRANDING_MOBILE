import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DS, hairlineBorder } from '../theme/auriaDesignTokens';

type Tab = 'login' | 'register';

type LoginScreenProps = {
  onBack: () => void;
  onContinue: () => void;
};

export function LoginScreen({ onBack, onContinue }: LoginScreenProps) {
  const [tab, setTab] = useState<Tab>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSuccess(null);
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
    setSuccess(tab === 'login' ? 'Entrada simulada. A redirecionar…' : 'Conta simulada criada. A redirecionar…');
    setTimeout(onContinue, 700);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Voltar</Text>
          </Pressable>

          <View style={styles.card}>
            <View style={styles.header}>
              <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>📋</Text>
              </View>
              <Text style={styles.title}>AATOS</Text>
              <Text style={styles.subtitle}>Gestão de projectos</Text>
            </View>

            <View style={styles.tabRow}>
              {(['login', 'register'] as Tab[]).map((value) => {
                const active = tab === value;
                return (
                  <Pressable
                    key={value}
                    style={[styles.tabButton, active && styles.tabButtonActive]}
                    onPress={() => {
                      setTab(value);
                      setSuccess(null);
                    }}
                  >
                    <Text style={[styles.tabButtonText, active && styles.tabButtonTextActive]}>
                      {value === 'login' ? 'Entrar' : 'Registar'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {tab === 'register' && (
              <View style={styles.field}>
                <Text style={styles.label}>Nome completo</Text>
                <TextInput
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="João Silva"
                  placeholderTextColor={DS.gray400}
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="joao@empresa.com"
                placeholderTextColor={DS.gray400}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={DS.gray400}
                  secureTextEntry={!showPassword}
                  style={[styles.input, styles.passwordInput]}
                />
                <Pressable style={styles.eyeButton} onPress={() => setShowPassword((value) => !value)}>
                  <Text style={styles.eyeButtonText}>{showPassword ? '🙈' : '👁'}</Text>
                </Pressable>
              </View>
            </View>

            {success ? (
              <View style={styles.successBox}>
                <Text style={styles.successText}>{success}</Text>
              </View>
            ) : null}

            <Pressable
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={DS.white} />
              ) : (
                <Text style={styles.submitButtonText}>
                  {tab === 'login' ? 'Entrar' : 'Criar conta'}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={onContinue}>
              <Text style={styles.skipText}>Continuar sem login (modo offline)</Text>
            </Pressable>

            <Text style={styles.noteText}>
              Sem autenticação por agora — os botões apenas simulam a UI.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.pageSurface,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    paddingVertical: 8,
  },
  backButtonText: {
    color: DS.gray600,
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    backgroundColor: DS.white,
    borderRadius: 20,
    padding: 24,
    gap: 16,
    ...hairlineBorder,
  },
  header: {
    alignItems: 'center',
  },
  logoBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: DS.inputFill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...hairlineBorder,
  },
  logoEmoji: {
    fontSize: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: DS.gray900,
  },
  subtitle: {
    fontSize: 13,
    color: DS.gray500,
    marginTop: 4,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: DS.inputFill,
    borderRadius: 14,
    padding: 4,
    gap: 4,
    ...hairlineBorder,
  },
  tabButton: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: DS.white,
    ...hairlineBorder,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: DS.gray500,
  },
  tabButtonTextActive: {
    color: DS.gray900,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: DS.gray600,
  },
  input: {
    backgroundColor: DS.inputFill,
    borderWidth: 1,
    borderColor: DS.gray300,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: DS.gray900,
    fontSize: 15,
  },
  passwordRow: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 4,
  },
  eyeButtonText: {
    fontSize: 16,
  },
  successBox: {
    backgroundColor: DS.sectionFill,
    borderWidth: 1,
    borderColor: DS.gray200,
    borderRadius: 10,
    padding: 12,
  },
  successText: {
    color: DS.positive,
    fontSize: 13,
    lineHeight: 18,
  },
  submitButton: {
    backgroundColor: DS.btnPrimary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
    ...hairlineBorder,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: DS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  skipText: {
    textAlign: 'center',
    color: DS.gray500,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  noteText: {
    textAlign: 'center',
    color: DS.gray400,
    fontSize: 11,
    lineHeight: 16,
  },
});
