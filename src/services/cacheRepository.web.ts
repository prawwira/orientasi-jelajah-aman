// src/services/cacheRepository.web.ts
// Versi web: cache disimpan di localStorage (pengganti SQLite)
import {
    DataTersimpan,
    KotaUntukCache,
    RingkasanKotaTersimpan,
} from "../../types/cache";
import { DataCuacaLengkap, DataKualitasUdara } from "../../types/weather";

const KUNCI_STORAGE = "@jelajah_aman:cache_cuaca";
const BATAS_DAFTAR = 5;

interface EntriCache {
  kotaId: number;
  nama: string;
  latitude: number;
  longitude: number;
  cuaca: DataCuacaLengkap;
  kualitasUdara: DataKualitasUdara;
  disimpanPada: number;
}

type PetaCache = Record<string, EntriCache>;

// Koordinat dibulatkan 2 desimal, sama seperti versi SQLite
export function buatKunci(latitude: number, longitude: number): string {
  return latitude.toFixed(2) + "," + longitude.toFixed(2);
}

function bacaSemua(): PetaCache {
  // localStorage tidak ada saat render di server (static export)
  if (typeof localStorage === "undefined") return {};
  try {
    const teks = localStorage.getItem(KUNCI_STORAGE);
    return teks ? (JSON.parse(teks) as PetaCache) : {};
  } catch {
    return {};
  }
}

function tulisSemua(peta: PetaCache): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KUNCI_STORAGE, JSON.stringify(peta));
}

export async function simpanCache(
  kota: KotaUntukCache,
  cuaca: DataCuacaLengkap,
  kualitasUdara: DataKualitasUdara,
): Promise<void> {
  const peta = bacaSemua();
  peta[buatKunci(kota.latitude, kota.longitude)] = {
    kotaId: kota.id,
    nama: kota.nama,
    latitude: kota.latitude,
    longitude: kota.longitude,
    cuaca,
    kualitasUdara,
    disimpanPada: Date.now(),
  };
  tulisSemua(peta);
}

export async function ambilCache(
  latitude: number,
  longitude: number,
): Promise<DataTersimpan | null> {
  const entri = bacaSemua()[buatKunci(latitude, longitude)];
  if (!entri) return null;
  return {
    cuaca: entri.cuaca,
    kualitasUdara: entri.kualitasUdara,
    disimpanPada: entri.disimpanPada,
  };
}

export async function daftarKotaTersimpan(): Promise<RingkasanKotaTersimpan[]> {
  return Object.entries(bacaSemua())
    .map(([kunci, e]) => ({
      kunci,
      id: e.kotaId,
      nama: e.nama,
      latitude: e.latitude,
      longitude: e.longitude,
      disimpanPada: e.disimpanPada,
    }))
    .sort((a, b) => b.disimpanPada - a.disimpanPada)
    .slice(0, BATAS_DAFTAR);
}

// Invalidation otomatis: buang cache yang lebih tua dari batas umur
export async function bersihkanCacheLama(batasUmurMs: number): Promise<void> {
  const batas = Date.now() - batasUmurMs;
  const peta = bacaSemua();
  for (const kunci of Object.keys(peta)) {
    if (peta[kunci].disimpanPada < batas) delete peta[kunci];
  }
  tulisSemua(peta);
}

// Invalidation manual: kosongkan seluruh cache
export async function hapusSemuaCache(): Promise<void> {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(KUNCI_STORAGE);
}

// Hapus satu kota dari cache berdasarkan kuncinya
export async function hapusCache(kunci: string): Promise<void> {
  const peta = bacaSemua();
  delete peta[kunci];
  tulisSemua(peta);
}
