import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";
import { Layar, Teks } from "../../components/tema-ui";
import { spacing, typeScale } from "../../constants/styles";
import { ModeTema, useTema } from "../../context/TemaContext";
import { hapusSemuaCache } from "../../services/cacheRepository";

type NamaIkon = keyof typeof Ionicons.glyphMap;

const PILIHAN_TEMA: { nilai: ModeTema; label: string; ikon: NamaIkon }[] = [
  { nilai: "terang", label: "Terang", ikon: "sunny-outline" },
  { nilai: "gelap", label: "Gelap", ikon: "moon-outline" },
  { nilai: "sistem", label: "Ikuti Sistem", ikon: "phone-portrait-outline" },
];

function konfirmasi(
  judul: string,
  isi: string,
  labelAksi: string,
  aksi: () => void,
) {
  Alert.alert(judul, isi, [
    { text: "Batal", style: "cancel" },
    { text: labelAksi, style: "destructive", onPress: aksi },
  ]);
}

export default function TabPengaturan() {
  const { mode, setMode, warna } = useTema();
  const [pesan, setPesan] = useState<string | null>(null);

  function hapusDataTersimpan() {
    konfirmasi(
      "Hapus Data Tersimpan",
      "Yakin hapus semua data cuaca tersimpan di perangkat?",
      "Hapus",
      async () => {
        await hapusSemuaCache();
        setPesan("Data cuaca tersimpan sudah dihapus.");
      },
    );
  }

  return (
    <Layar>
      <ScrollView
        contentContainerStyle={{ padding: spacing.sedang, gap: spacing.besar }}
      >
        <View style={{ gap: spacing.kecil }}>
          <Teks
            accessibilityRole="header"
            style={{ fontSize: typeScale.subjudul, fontWeight: "bold" }}
          >
            Mode Tampilan
          </Teks>

          {PILIHAN_TEMA.map((p) => {
            const aktif = mode === p.nilai;
            return (
              <TouchableOpacity
                key={p.nilai}
                onPress={() => setMode(p.nilai)}
                accessibilityRole="radio"
                accessibilityState={{ selected: aktif }}
                accessibilityLabel={`Mode ${p.label}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: aktif ? warna.aksen : warna.garis,
                  backgroundColor: warna.kartu,
                }}
              >
                <Ionicons
                  name={p.ikon}
                  size={22}
                  color={aktif ? warna.aksen : warna.teksSekunder}
                />
                <Teks style={{ flex: 1, fontSize: typeScale.isi }}>
                  {p.label}
                </Teks>
                <Ionicons
                  name={aktif ? "radio-button-on" : "radio-button-off"}
                  size={20}
                  color={aktif ? warna.aksen : warna.teksSekunder}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ gap: spacing.kecil }}>
          <Teks
            accessibilityRole="header"
            style={{ fontSize: typeScale.subjudul, fontWeight: "bold" }}
          >
            Data
          </Teks>
          <TouchableOpacity
            onPress={hapusDataTersimpan}
            accessibilityRole="button"
            accessibilityLabel="Hapus data cuaca tersimpan"
            style={{
              alignSelf: "flex-start",
              backgroundColor: warna.bahaya,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 8,
            }}
          >
            <Teks style={{ color: "white", fontWeight: "600" }}>
              Hapus Data Cuaca Tersimpan
            </Teks>
          </TouchableOpacity>
          {pesan && <Teks accessibilityLabel={pesan}>{pesan}</Teks>}
        </View>

        <Teks
          style={{ color: warna.teksSekunder, fontSize: typeScale.keterangan }}
        >
          Jelajah Aman • Versi 1.0.0
        </Teks>
      </ScrollView>
    </Layar>
  );
}