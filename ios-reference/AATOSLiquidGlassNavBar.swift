// AATOS Mobile — referência Liquid Glass (iOS 26+)
// Compilar com Xcode 26+. Integração activa via expo-glass-effect em ProductNavBar.tsx.
// Este ficheiro é documentação nativa; o runtime usa GlassView.swift do pacote Expo.

import UIKit

@available(iOS 26.0, *)
enum AATOSLiquidGlassNavBar {
    /// Barra inferior com UIGlassEffect — espelha o comportamento do ProductNavBar.
    static func makeGlassBar(frame: CGRect, interactive: Bool = true) -> UIVisualEffectView {
        let effect = UIGlassEffect(style: .regular)
        effect.isInteractive = interactive

        let view = UIVisualEffectView(effect: effect)
        view.frame = frame
        view.autoresizingMask = [.flexibleWidth, .flexibleTopMargin]
        view.layer.cornerRadius = 28
        view.layer.cornerCurve = .continuous
        view.clipsToBounds = true
        return view
    }

    /// Agrupa vários elementos glass (tab activa + rail).
    static func makeGlassContainer(frame: CGRect) -> UIVisualEffectView {
        let container = UIGlassContainerEffect()
        let view = UIVisualEffectView(effect: container)
        view.frame = frame
        view.autoresizingMask = [.flexibleWidth, .flexibleTopMargin]
        return view
    }
}

// Info.plist — não definir UIDesignRequiresCompatibility (ou false) para Liquid Glass activo.
