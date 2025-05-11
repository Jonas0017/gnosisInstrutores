import React from "react";
import { View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { globalStyles } from "../styles/globalStyles"; // Importando o CSS

const Loading = () => {
  return (
    <View style={globalStyles.loadingOverlay}>
      <LottieView
        source={require("../assets/loading-animation.json")} // Certifique-se de ter um arquivo Lottie na pasta assets
        autoPlay
        loop
        style={globalStyles.lottie}
      />
    </View>
  );
};

export default Loading;
