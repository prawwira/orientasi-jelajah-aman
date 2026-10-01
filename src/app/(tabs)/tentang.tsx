// app/(tabs)/tentang.tsx
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { spacing, typeScale } from "../../constants/styles";

export default function TabTentang() {
  return (
    <SafeAreaView style={{ flex: 1, padding: spacing.sedang }}>
      <Text
        accessibilityLabel="Judul halaman Tentang Aplikasi"
        style={{
          fontSize: typeScale.judul,
          fontWeight: "bold",
          marginBottom: spacing.kecil,
        }}
      >
        Tentang Aplikasi
      </Text>

      <Text style={{ fontSize: typeScale.subjudul, marginBottom: spacing.kecil }}>
        Jelajah Aman
      </Text>
      <Text style={{ fontSize: typeScale.isi, marginBottom: spacing.kecil }}>
        Versi 1.0.0
      </Text>
      <Text style={{ fontSize: typeScale.isi }}>
        Dibuat oleh: [Nama Kamu]
      </Text>
    </SafeAreaView>
  );
}