// src/app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { TemaProvider, useTema } from "../context/TemaContext";

function IsiRoot() {
  const { gelap, warna } = useTema();

  return (
    <>
      <StatusBar style={gelap ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: warna.kartu },
          headerTintColor: warna.teks,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: warna.latar },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="detail/[kota]" options={{ title: "Detail Cuaca" }} />
        {/* kalau layar lain (mis. tambah-favorit) dulu terdaftar di sini, tambahkan lagi */}
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <TemaProvider>
      <IsiRoot />
    </TemaProvider>
  );
}