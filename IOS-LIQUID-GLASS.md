# iOS — Liquid Glass (Apple)

Guia para ver o **Liquid Glass** nativo na barra de navegação inferior da app AATOS Mobile.

## O que está implementado

- Pacote **`expo-glass-effect`** (SDK 54) — usa `UIGlassEffect` + `UIVisualEffectView` no iOS 26+
- Componente **`ProductNavBar`** — `GlassContainer` + `GlassView` quando a API está disponível
- Fallback automático (rail cinza) em web, Android ou iOS &lt; 26
- **`app.json`** — `UIDesignRequiresCompatibility: false` para adoptar o design iOS 26

## Requisitos

| Item | Versão |
|------|--------|
| Xcode | **26+** (SDK iOS 26) |
| iPhone / Simulador | **iOS 26+** |
| Expo SDK | 54 (projecto actual) |

> **Expo Go:** o módulo está incluído, mas o efeito **só aparece** num dispositivo/simulador com iOS 26. Em versões anteriores vês o fallback (sem vidro).

## Como compilar para iOS (dev build)

```powershell
cd C:\Users\marti\AATOS_REBRANDING_TEST\AATOS_REBRANDING_MOBILE

# Gera a pasta ios/ com o módulo nativo
npx expo prebuild --platform ios

# Instala pods (Mac)
cd ios
pod install
cd ..

# Abrir no Xcode 26 e correr num simulador/dispositivo iOS 26
npx expo run:ios
```

## Ficheiros nativos (referência Apple)

O Swift do Liquid Glass vive no pacote Expo (não é preciso duplicar):

- `node_modules/expo-glass-effect/ios/GlassView.swift` — `UIGlassEffect`
- `node_modules/expo-glass-effect/ios/GlassContainer.swift` — `UIGlassContainerEffect`

Implementação UIKit equivalente (referência manual):

```swift
// iOS 26+ — Xcode 26+
if #available(iOS 26.0, *) {
    let effect = UIGlassEffect(style: .regular)
    effect.isInteractive = true
    let glassView = UIVisualEffectView(effect: effect)
    glassView.frame = tabBar.bounds
    tabBar.insertSubview(glassView, at: 0)
}
```

## Boas práticas Apple

1. **Não uses `opacity` &lt; 1** em `GlassView` nem nos pais — distorce o efeito
2. **Remove fundos opacos** por baixo da nav — o conteúdo deve ser visível através do vidro (nav flutuante no `AppShell`)
3. Verifica **`isGlassEffectAPIAvailable()`** antes de montar glass (já feito em `ProductNavBar`)
4. Testa com **Reduzir transparência** nas Definições de acessibilidade

## Documentação

- [Adopting Liquid Glass — Apple](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)
- [Expo GlassEffect](https://docs.expo.dev/versions/v54.0.0/sdk/glass-effect/)
