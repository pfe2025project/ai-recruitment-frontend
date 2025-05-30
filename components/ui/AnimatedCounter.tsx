// ui/AnimatedCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

// Composant d'animation de compteur
const AnimatedCounter: React.FC<{ targetValue: string }> = ({ targetValue }) => {
  const [currentValue, setCurrentValue] = useState(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 2000; // Durée de l'animation en millisecondes (2 secondes)
    let startTimestamp: DOMHighResTimeStamp | null = null;

    // Extrait la partie numérique et le suffixe du texte cible (ex: "10", "K+")
    const numericPartMatch = targetValue.match(/(\d+\.?\d*)([Kk\+\%]*)/);
    if (!numericPartMatch) {
      // Si aucune partie numérique n'est trouvée, réinitialise la valeur et arrête.
      setCurrentValue(parseFloat(targetValue.replace(/[^\d.]/g, '') || '0'));
      return;
    }
    const rawNumericValue = parseFloat(numericPartMatch[1]);
    const suffix = numericPartMatch[2];

    let targetNumberForAnimation: number;

    // Convertit la valeur cible en un nombre pur pour l'animation interne.
    // Si le suffixe est 'K+', la cible est multipliée par 1000 pour animer le nombre complet.
    // Sinon, la cible est le nombre brut.
    if (suffix.toLowerCase() === 'k+') {
      targetNumberForAnimation = rawNumericValue * 1000;
    } else {
      targetNumberForAnimation = rawNumericValue;
    }

    const animate = (currentTime: DOMHighResTimeStamp) => {
      if (!startTimestamp) startTimestamp = currentTime;
      const progress = (currentTime - startTimestamp) / duration;

      if (progress < 1) {
        // Applique une fonction d'accélération/décélération (ease-in-out) pour un effet plus doux
        const easedProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
        const newValue = easedProgress * targetNumberForAnimation; // Anime vers le nombre brut
        setCurrentValue(newValue);
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // S'assure que la valeur finale est atteinte précisément
        setCurrentValue(targetNumberForAnimation);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
    };

    // Démarre l'animation
    animationFrameRef.current = requestAnimationFrame(animate);

    // Fonction de nettoyage pour annuler l'animation si le composant est démonté
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue]); // Re-déclenche l'animation si la valeur cible change

  // Formatte la valeur affichée avec son suffixe et la logique 'K+'
  const formatDisplayedValue = (value: number) => {
    const numericPartMatch = targetValue.match(/(\d+\.?\d*)([Kk\+\%]*)/);
    if (!numericPartMatch) return targetValue; // Fallback si l'analyse échoue
    const originalSuffix = numericPartMatch[2];

    // Si le suffixe original est 'K+' et que la valeur actuelle est >= 1000, affiche en format 'K+'
    if (originalSuffix.toLowerCase() === 'k+' && value >= 1000) {
      return `${Math.floor(value / 1000)}K+`;
    } else if (originalSuffix === '%') {
      // Pour les pourcentages, arrondir à l'entier le plus proche
      return `${Math.round(value)}%`;
    } else if (originalSuffix === '+') {
      // Pour les nombres avec '+', arrondir vers le bas
      return `${Math.floor(value)}+`;
    }
    // Pour les nombres simples ou si la valeur est < 1000 (même pour les cibles en K), arrondir vers le bas
    return `${Math.floor(value)}`;
  };

  return <span>{formatDisplayedValue(currentValue)}</span>;
};

export default AnimatedCounter;
