// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { KotaFavorit } from "../../../types/favorit";
import { Layar, Teks } from "../../components/tema-ui";
import { useTema } from "../../context/TemaContext";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
  MAKS_RIWAYAT,
} from "../../services/riwayatPencarianStorage";

export default function TabRiwayat() {
  const { warna } = useTema();
  const [daftarFavorit, setDaftarFavorit] = useState<KotaFavorit[]>([]);
  const [riwayat, setRiwayat] = useState<string[]>([]);

  // Muat ulang setiap kali tab ini difokuskan
  useFocusEffect(
    useCallback(() => {
      ambilSemuaFavorit().then(setDaftarFavorit);
      ambilRiwayatPencarian().then(setRiwayat);
    }, []),
  );

  // Buka Beranda dan jalankan pencarian kota tersebut otomatis
  function bukaDiBeranda(nama: string) {
    router.navigate({
      pathname: "/",
      params: { cari: nama, t: String(Date.now()) },
    });
  }

  async function hapusRiwayat() {
    await hapusSemuaRiwayatPencarian();
    setRiwayat([]);
  }

  async function hapus(id: number) {
    await hapusFavorit(id);
    setDaftarFavorit((prev) => prev.filter((k) => k.id !== id));
  }

  function konfirmasiHapus(kota: KotaFavorit) {
    if (Platform.OS === "web") {
      // Alert.alert tidak berfungsi di web, pakai window.confirm sebagai gantinya
      const yakin = window.confirm(`Yakin hapus ${kota.nama}?`);
      if (yakin) hapus(kota.id);
      return;
    }

    Alert.alert("Konfirmasi Hapus", `Yakin hapus ${kota.nama}?`, [
      { text: "Batal", style: "cancel" },
      { text: "Hapus", style: "destructive", onPress: () => hapus(kota.id) },
    ]);
  }

  return (
    <Layar>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Bagian 1: riwayat pencarian terakhir */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Teks style={{ fontSize: 18, fontWeight: "bold" }}>
            Pencarian Terakhir ({riwayat.length}/{MAKS_RIWAYAT})
          </Teks>
          {riwayat.length > 0 && (
            <TouchableOpacity
              onPress={hapusRiwayat}
              accessibilityRole="button"
              accessibilityLabel="Hapus semua riwayat pencarian"
            >
              <Teks style={{ color: warna.bahaya, fontSize: 12 }}>
                Hapus Riwayat
              </Teks>
            </TouchableOpacity>
          )}
        </View>

        {riwayat.length === 0 && <Teks>Belum ada riwayat pencarian</Teks>}

        {riwayat.map((nama) => (
          <TouchableOpacity
            key={nama}
            onPress={() => bukaDiBeranda(nama)}
            accessibilityRole="button"
            accessibilityLabel={`Cari ulang cuaca ${nama}`}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: warna.garis,
            }}
          >
            <Teks>{nama}</Teks>
          </TouchableOpacity>
        ))}

        {/* Bagian 2: favorit */}
        <Teks style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>
          Kota Favorit
        </Teks>
        <Teks>Tersimpan {daftarFavorit.length} kota</Teks>

        {daftarFavorit.length === 0 && <Teks>Belum ada kota favorit</Teks>}

        {daftarFavorit.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Teks>{kota.nama}</Teks>
            <Button title="Hapus" onPress={() => konfirmasiHapus(kota)} />
          </View>
        ))}
      </ScrollView>
    </Layar>
  );
}
