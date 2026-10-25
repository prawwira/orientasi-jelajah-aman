// src/app/(tabs)/riwayat.tsx
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { KotaFavorit } from "../../../types/favorit";
import { ambilSemuaFavorit, hapusFavorit } from "../../services/favoritStorage";
import {
  ambilRiwayatPencarian,
  hapusSemuaRiwayatPencarian,
  MAKS_RIWAYAT,
} from "../../services/riwayatPencarianStorage";

export default function TabRiwayat() {
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        {/* Bagian 1: riwayat pencarian terakhir */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Pencarian Terakhir ({riwayat.length}/{MAKS_RIWAYAT})
          </Text>
          {riwayat.length > 0 && (
            <TouchableOpacity
              onPress={hapusRiwayat}
              accessibilityRole="button"
              accessibilityLabel="Hapus semua riwayat pencarian"
            >
              <Text style={{ color: "#DC2626", fontSize: 12 }}>
                Hapus Riwayat
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {riwayat.length === 0 && <Text>Belum ada riwayat pencarian</Text>}

        {riwayat.map((nama) => (
          <TouchableOpacity
            key={nama}
            onPress={() => bukaDiBeranda(nama)}
            accessibilityRole="button"
            accessibilityLabel={`Cari ulang cuaca ${nama}`}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
            }}
          >
            <Text>{nama}</Text>
          </TouchableOpacity>
        ))}

        {/* Bagian 2: favorit (kode asli) */}
        <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 12 }}>
          Kota Favorit
        </Text>
        <Text>Tersimpan {daftarFavorit.length} kota</Text>

        {daftarFavorit.length === 0 && <Text>Belum ada kota favorit</Text>}

        {daftarFavorit.map((kota) => (
          <View
            key={kota.id}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{kota.nama}</Text>
            <Button title="Hapus" onPress={() => konfirmasiHapus(kota)} />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}