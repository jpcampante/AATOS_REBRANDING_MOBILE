import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { welcomeContent } from '../data/welcomeContent';
import { C, DS, hairlineBorder } from '../theme/auriaDesignTokens';

type WelcomeScreenProps = {
  onContinue: () => void;
  onLogin: () => void;
};

export function WelcomeScreen({ onContinue, onLogin }: WelcomeScreenProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.brand}>{welcomeContent.brand}</Text>
          <Text style={styles.title}>{welcomeContent.title}</Text>
          <Text style={styles.description}>{welcomeContent.description}</Text>
        </View>

        <View style={styles.features}>
          {welcomeContent.features.map((feature) => (
            <View key={feature.label} style={styles.featureCard}>
              <View style={styles.featureIcon}>
                <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              </View>
              <View style={styles.featureCopy}>
                <Text style={styles.featureLabel}>{feature.label}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={onContinue}>
          <Text style={styles.primaryButtonText}>Continuar</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onLogin}>
          <Text style={styles.secondaryButtonText}>Entrar na conta</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: DS.pageSurface,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  hero: {
    alignItems: 'center',
    paddingTop: 12,
  },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: DS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...hairlineBorder,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: DS.gray900,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    color: DS.gray600,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: DS.gray900,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: DS.gray600,
    textAlign: 'center',
  },
  features: {
    gap: 12,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    backgroundColor: DS.white,
    borderRadius: 16,
    padding: 16,
    ...hairlineBorder,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DS.inputFill,
    alignItems: 'center',
    justifyContent: 'center',
    ...hairlineBorder,
  },
  featureEmoji: {
    fontSize: 18,
  },
  featureCopy: {
    flex: 1,
  },
  featureLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: DS.gray900,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: DS.gray500,
  },
  primaryButton: {
    backgroundColor: DS.btnPrimary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    ...hairlineBorder,
  },
  primaryButtonText: {
    color: DS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: DS.white,
    ...hairlineBorder,
  },
  secondaryButtonText: {
    color: DS.gray900,
    fontSize: 15,
    fontWeight: '600',
  },
});
