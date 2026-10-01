// components/IndikatorAQI.tsx
import { Text, View } from "react-native";
import { LaporanUdara } from "../../types/cuaca";

const WARNA_TINGKAT: Record<LaporanUdara["tingkat"], string> = {
  BAIK: "green",
  SEDANG: "orange",
  TIDAK_SEHAT: "red",
  BERBAHAYA: "purple",
};

export default function IndikatorAQI({
  kota,
  indeksAQI,
  tingkat,
  diperbaruiPada,
}: LaporanUdara) {
  const warna = WARNA_TINGKAT[tingkat];

  return (
    <View style={{ padding: 16, borderRadius: 8, backgroundColor: "#F4F7FA" }}>
      <Text style={{ fontWeight: "bold", fontSize: 18 }}>{kota}</Text>
      <Text style={{ fontSize: 32 }}>{indeksAQI}</Text>
      <Text style={{ color: warna, fontWeight: "bold" }}>{tingkat}</Text>
      {diperbaruiPada && (
        <Text style={{ fontSize: 12, color: "#888" }}>
          Diperbarui: {diperbaruiPada}
        </Text>
      )}
    </View>
  );
}