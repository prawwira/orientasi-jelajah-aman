// src/app/tambah-favorit.tsx
import { router, useLocalSearchParams } from "expo-router";
import { Button, View } from "react-native";
import { Layar, Teks } from "../components/tema-ui";
import { tambahFavorit } from "../services/favoritStorage";

export default function ModalTambahFavorit() {
  const { id, nama, lat, lon } = useLocalSearchParams<{
    id: string;
    nama: string;
    lat: string;
    lon: string;
  }>();

  async function simpan() {
    await tambahFavorit({
      id: Number(id),
      nama,
      latitude: Number(lat),
      longitude: Number(lon),
    });
    router.back();
  }

  return (
    <Layar>
      <View style={{ padding: 16, gap: 16 }}>
        <Teks>Tambahkan {nama} ke daftar favorit?</Teks>
        <Button title="Simpan" onPress={simpan} />
      </View>
    </Layar>
  );
}
