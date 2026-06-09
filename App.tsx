import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppShell } from './src/components/navigation/AppShell';
import { ProductTabId } from './src/data/productNavigation';
import { AuriaScreen } from './src/screens/AuriaScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { PlaceholderModuleScreen } from './src/screens/PlaceholderModuleScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { ThemeProvider } from './src/theme';

type AppPhase = 'welcome' | 'login' | 'main';

function renderProductScreen(tab: ProductTabId) {
  switch (tab) {
    case 'insights':
      return <HomeScreen />;
    case 'auria':
      return <AuriaScreen />;
    case 'tasks':
      return <PlaceholderModuleScreen title="Tasks" subtitle="Kanban, roadmap, and workload" />;
    case 'specialists':
      return <PlaceholderModuleScreen title="Specialists" subtitle="Chat with professionals" />;
    case 'integrations':
      return <PlaceholderModuleScreen title="Integrations" subtitle="Mail, calendar, and connectors" />;
    default:
      return null;
  }
}

export default function App() {
  const [phase, setPhase] = useState<AppPhase>('welcome');
  const [activeTab, setActiveTab] = useState<ProductTabId>('insights');

  const enterMain = () => setPhase('main');

  return (
    <SafeAreaProvider>
      <ThemeProvider initialPreference="light">
        {phase === 'welcome' ? (
          <WelcomeScreen onContinue={enterMain} onLogin={() => setPhase('login')} />
        ) : null}

        {phase === 'login' ? (
          <LoginScreen onBack={() => setPhase('welcome')} onContinue={enterMain} />
        ) : null}

        {phase === 'main' ? (
          <AppShell
            activeTab={activeTab}
            onTabChange={setActiveTab}
            renderScreen={renderProductScreen}
          />
        ) : null}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
