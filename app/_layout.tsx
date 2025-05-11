import React from "react";
import { TourGuideProvider } from "rn-tourguide";
import { Stack } from "expo-router";

const labelsPT = {
  next: "Próximo",
  skip: "Pular",
  finish: "Finalizar",
  previous: "Voltar",
};

// Lista dos nomes dos tutoriais
const tutorialNames = ["Geral", "Instrutor", "Ano", "Perfil", "Turma"];

const Layout = () => {
  // Reduzimos os providers de fora para dentro
  const nestedProviders = tutorialNames.reduceRight((children, name) => {
    return (
      <TourGuideProvider
        key={name}
        name={name}
        labels={labelsPT}
        backdropColor="rgba(100, 00, 100, 0.3)"
        maskOffset={0}
        androidStatusBarVisible={false}
      >
        {children}
      </TourGuideProvider>
    );
  }, <Stack screenOptions={{ headerShown: false }} />); // folha final

  return nestedProviders;
};

export default Layout;
