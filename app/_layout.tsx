import React from "react";
import { TourGuideProvider } from "rn-tourguide";
import { Stack } from "expo-router";

const Layout = () => {
  return (
<TourGuideProvider
  backdropColor="rgba(100, 00, 100, 0.3)"
  
  maskOffset={0} // 🔥 Ajusta a máscara para evitar que o foco fique muito distante
  androidStatusBarVisible={false}
  labels={{ next: "Próximo", skip: "Pular", finish: "Finalizar", previous: "Voltar" }}
>
  <Stack screenOptions={{ headerShown: false }} />
</TourGuideProvider>

  );
};

export default Layout;
