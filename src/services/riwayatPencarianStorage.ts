// src/services/riwayatPencarianStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KUNCI = "@jelajah_aman:riwayat_pencarian";
export const MAKS_RIWAYAT = 10;

export async function ambilRiwayatPencarian(): Promise<string[]> {
  try {
    const json = await AsyncStorage.getItem(KUNCI);
    return json ? (JSON.parse(json) as string[]) : [];
  } catch {
    return [];
  }
}

// Terbaru di depan, tanpa duplikat, maksimal 10
export async function tambahRiwayatPencarian(nama: string): Promise<void> {
  const bersih = nama.trim();
  if (!bersih) return;

  const lama = await ambilRiwayatPencarian();
  const tanpaDuplikat = lama.filter(
    (k) => k.toLowerCase() !== bersih.toLowerCase(),
  );
  const baru = [bersih, ...tanpaDuplikat].slice(0, MAKS_RIWAYAT);
  await AsyncStorage.setItem(KUNCI, JSON.stringify(baru));
}

export async function hapusSemuaRiwayatPencarian(): Promise<void> {
  await AsyncStorage.removeItem(KUNCI);
}