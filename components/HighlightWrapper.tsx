import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HighlightWrapperProps {
  stepKey: string;
  children: React.ReactNode;
}

const HighlightWrapper: React.FC<HighlightWrapperProps> = ({ stepKey, children }) => {
  const [isHighlighted, setIsHighlighted] = useState(false);

  useEffect(() => {
    const checkHighlight = async () => {
      try {
        const seenSteps = await AsyncStorage.getItem("tourProgress");
        if (!seenSteps) {
          setIsHighlighted(true); // Se não houver progresso salvo, destaca
          return;
        }
        const parsedSteps = JSON.parse(seenSteps);
        setIsHighlighted(!parsedSteps.includes(stepKey)); // Se o passo não foi concluído, mantém o destaque
      } catch (error) {
        console.error("Erro ao carregar progresso do tutorial:", error);
      }
    };

    checkHighlight();
  }, [stepKey]);

  return (
    <View style={isHighlighted ? styles.highlightContainer : {}}>
      <View style={isHighlighted ? styles.highlight : {}}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  highlightContainer: {
    position: "relative",
    padding: 10,
    backgroundColor: "rgba(255, 255, 0, 0.3)", // Destaque amarelo translúcido
    borderRadius: 10,
  },
  highlight: {
    borderWidth: 2,
    borderColor: "yellow",
    borderRadius: 8,
  },
});

export default HighlightWrapper;
