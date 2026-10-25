import { ScrollView } from "react-native";
import { Layar, Teks } from "../../components/tema-ui";
import { spacing, typeScale } from "../../constants/styles";
import { useTema } from "../../context/TemaContext";

export default function TabTentang() {
  const { warna } = useTema();

  return (
    <Layar>
      <ScrollView
        contentContainerStyle={{ padding: spacing.sedang, gap: spacing.kecil }}
      >
        <Teks
          accessibilityRole="header"
          accessibilityLabel="Judul halaman Tentang Aplikasi"
          style={{ fontSize: typeScale.judul, fontWeight: "bold" }}
        >
          Tentang Aplikasi
        </Teks>
        <Teks style={{ fontSize: typeScale.subjudul }}>Jelajah Aman</Teks>
        <Teks style={{ fontSize: typeScale.isi }}>Versi 1.0.0</Teks>
        <Teks style={{ fontSize: typeScale.isi }}>
          Dibuat oleh: Imam Prawira
        </Teks>
        <Teks
          style={{ fontSize: typeScale.keterangan, color: warna.teksSekunder }}
        >
          Data cuaca dan kualitas udara oleh Open-Meteo.com
        </Teks>
      </ScrollView>
    </Layar>
  );
}