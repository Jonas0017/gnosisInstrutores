import "dotenv/config";

export default {
  expo: {
    name: "Instrutores",
    slug: "Instrutores",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.gnosisbrasil.instrutores",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ecf0f1"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          android: {
            kotlinVersion: "1.9.10",
            gradlePluginVersion: "7.4.1",
            compileSdkVersion: 34,
            targetSdkVersion: 34,
            minSdkVersion: 23
          }
        }
      ],
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ecf0f1"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false,
        output: ".expo"
      },
      eas: {
        projectId: "6dc0832b-8654-4d0d-98a4-1b7528c58b1b"
      }
    }
  }
};
