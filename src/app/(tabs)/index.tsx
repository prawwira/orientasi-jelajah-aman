// src/app/(tabs)/index.tsx
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native"; // TEMA: Text dan SafeAreaView dihapus
import {
  HasilCuacaOffline,
  RingkasanKotaTersimpan,
} from "../../../types/cache";
import { HasilGeocoding } from "../../../types/geocoding";
import AtribusiCuaca from "../../components/AtribusiCuaca";
import SearchBox from "../../components/SearchBox";
import StatusData from "../../components/StatusData";
import { Layar, Teks } from "../../components/tema-ui"; // TEMA
import WeatherCard from "../../components/WeatherCard";
import { labelKodeCuaca } from "../../constants/weatherCodes";
import { useTema } from "../../context/TemaContext";
import { useDebounce } from "../../hooks/use-debounce";
import {
  bersihkanCacheLama,
  daftarKotaTersimpan,
  hapusSemuaCache,
} from "../../services/cacheRepository";
import {
  ambilCuacaOfflineFirst,
  BATAS_CACHE_MS,
} from "../../services/cuacaRepository";
import { cariKota } from "../../services/geocodingService";
import {
  ambilKoordinatSaatIni,
  mintaIzinLokasi,
} from "../../services/locationService";
import { tambahRiwayatPencarian } from "../../services/riwayatPencarianStorage";
import { konversiTingkatAQI } from "../../services/weatherAdapter";

export default function HalamanUtama() {
  // Parameter dari tab Riwayat (nama kota + penanda waktu)
  const { cari, t } = useLocalSearchParams<{ cari?: string; t?: string }>();

  const { warna } = useTema();

  const [teksCari, setTeksCari] = useState("");
  const [hasilPencarian, setHasilPencarian] = useState<HasilGeocoding[]>([]);
  const [kotaTerpilih, setKotaTerpilih] = useState<HasilGeocoding | null>(null);
  const [hasil, setHasil] = useState<HasilCuacaOffline | null>(null);
  const [kotaTersimpan, setKotaTersimpan] = useState<RingkasanKotaTersimpan[]>(
    [],
  );
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [pesanError, setPesanError] = useState<string | null>(null);
  const [pesanLokasi, setPesanLokasi] = useState<string | null>(null);
  const teksTertunda = useDebounce(teksCari, 500);
  const requestIdRef = useRef(0); // pencegah race condition

  async function muatKotaTersimpan() {
    setKotaTersimpan(await daftarKotaTersimpan());
  }

  async function hapusSemuaTersimpan() {
    await hapusSemuaCache();
    muatKotaTersimpan(); // muat ulang, daftar jadi kosong
  }

  // Saat aplikasi dibuka: buang cache > 7 hari, lalu tampilkan daftar tersimpan
  useEffect(() => {
    bersihkanCacheLama(BATAS_CACHE_MS)
      .then(muatKotaTersimpan)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (teksTertunda.trim().length === 0) {
      setHasilPencarian([]);
      return;
    }
    cariKota(teksTertunda)
      .then(setHasilPencarian)
      .catch(() => setHasilPencarian([]));
  }, [teksTertunda]);

  // Dibuka dari tab Riwayat -> isi kotak pencarian dan cari kota itu otomatis
  useEffect(() => {
    if (!cari) return;
    setTeksCari(cari);
    bukaKotaDariNama(cari);
  }, [cari, t]);

  async function bukaKotaDariNama(nama: string) {
    try {
      const hasilCari = await cariKota(nama);
      if (hasilCari.length > 0) {
        pilihKota(hasilCari[0]);
        return;
      }
    } catch {
      // gagal (misalnya offline): coba cari di cache di bawah
    }

    try {
      const tersimpan = await daftarKotaTersimpan();
      const cocok = tersimpan.find(
        (k) => k.nama.toLowerCase() === nama.toLowerCase(),
      );
      if (cocok) {
        pilihKota({
          id: cocok.id,
          name: cocok.nama,
          latitude: cocok.latitude,
          longitude: cocok.longitude,
          country: "",
        });
        return;
      }
    } catch {
      // abaikan
    }

    setPesanError("Kota tidak ditemukan atau tidak ada koneksi internet.");
  }

  async function pilihKota(kota: HasilGeocoding, paksaPerbarui = false) {
    setKotaTerpilih(kota);
    const idSaatIni = ++requestIdRef.current;

    setSedangMemuat(true);
    setPesanError(null);
    try {
      const data = await ambilCuacaOfflineFirst(
        {
          id: kota.id,
          nama: kota.name,
          latitude: kota.latitude,
          longitude: kota.longitude,
        },
        { paksaPerbarui },
      );

      if (idSaatIni !== requestIdRef.current) return; // hasil basi, abaikan

      setHasil(data);
      muatKotaTersimpan();

      // catat ke riwayat pencarian (lewati "Lokasi Saat Ini")
      if (kota.id !== -1) {
        tambahRiwayatPencarian(kota.name).catch(() => {});
      }
    } catch (err) {
      if (idSaatIni !== requestIdRef.current) return;
      setHasil(null);
      setPesanError(
        "Belum ada data tersimpan dan tidak ada koneksi internet. Sambungkan internet lalu coba lagi.",
      );
    } finally {
      if (idSaatIni === requestIdRef.current) setSedangMemuat(false);
    }
  }

  async function gunakanLokasiSaatIni() {
    const status = await mintaIzinLokasi();

    if (status === "denied") {
      setPesanLokasi(
        "Izin lokasi ditolak. Silakan cari kota secara manual di atas.",
      );
      return;
    }
    if (status === "unavailable") {
      setPesanLokasi(
        "Layanan lokasi tidak aktif di perangkat ini. Silakan cari kota secara manual.",
      );
      return;
    }

    setPesanLokasi(null);
    const koordinat = await ambilKoordinatSaatIni();
    pilihKota({
      id: -1,
      name: "Lokasi Saat Ini",
      latitude: koordinat.latitude,
      longitude: koordinat.longitude,
      country: "",
    });
  }

  return (
    // TEMA: Layar memberi warna latar sesuai mode terang/gelap
    <Layar>
      <ScrollView
        contentContainerStyle={{ padding: 16, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        <SearchBox onCari={setTeksCari} nilai={teksCari} />
        <Button
          title="Gunakan Lokasi Saat Ini"
          onPress={gunakanLokasiSaatIni}
        />
        {pesanLokasi && (
          <Teks accessibilityLabel={pesanLokasi}>{pesanLokasi}</Teks>
        )}

        {/* TEMA: hasil pencarian tampil sebagai kartu */}
        {hasilPencarian.map((kota) => (
          <TouchableOpacity
            key={kota.id}
            onPress={() => pilihKota(kota)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: warna.kartu,
            }}
          >
            <Teks>{kota.name}</Teks>
          </TouchableOpacity>
        ))}

        {sedangMemuat && <ActivityIndicator color={warna.aksen} />}

        {pesanError && (
          <View style={{ gap: 8 }}>
            <Teks accessibilityLabel={pesanError}>{pesanError}</Teks>
            <Button
              title="Coba Lagi"
              onPress={() => kotaTerpilih && pilihKota(kotaTerpilih, true)}
            />
          </View>
        )}

        {hasil && kotaTerpilih && !sedangMemuat && (
          <>
            <StatusData
              sumber={hasil.sumber}
              disimpanPada={hasil.disimpanPada}
            />
            <WeatherCard
              kota={kotaTerpilih.name}
              suhu={hasil.cuaca.saatIni.suhu}
              tingkatAQI={konversiTingkatAQI(hasil.kualitasUdara.indeksAQI)}
            />
            <Teks style={{ fontSize: 12, color: warna.teksSekunder }}>
              Kondisi: {labelKodeCuaca(hasil.cuaca.saatIni.kodeCuaca)}{" "}
              {"\u2022"} Angin {hasil.cuaca.saatIni.kecepatanAngin} km/j
            </Teks>
            <Button
              title="Perbarui Sekarang"
              onPress={() => pilihKota(kotaTerpilih, true)}
            />
            <Button
              title="Tambahkan ke Favorit"
              onPress={() =>
                router.push({
                  pathname: "/tambah-favorit",
                  params: {
                    id: String(kotaTerpilih.id),
                    nama: kotaTerpilih.name,
                    lat: String(kotaTerpilih.latitude),
                    lon: String(kotaTerpilih.longitude),
                  },
                })
              }
            />
          </>
        )}

        {/* TEMA: daftar tersimpan tampil sebagai kartu */}
        {kotaTersimpan.length > 0 && (
          <View
            style={{
              gap: 6,
              padding: 12,
              borderRadius: 8,
              backgroundColor: warna.kartu,
            }}
          >
            <Teks style={{ fontWeight: "bold" }}>
              Tersimpan di perangkat (bisa dibuka offline)
            </Teks>

            {kotaTersimpan.map((k) => (
              <TouchableOpacity
                key={k.kunci}
                onPress={() =>
                  pilihKota({
                    id: k.id,
                    name: k.nama,
                    latitude: k.latitude,
                    longitude: k.longitude,
                    country: "",
                  })
                }
              >
                <Teks>{k.nama}</Teks>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={hapusSemuaTersimpan}
              accessibilityRole="button"
              accessibilityLabel="Hapus semua data cuaca tersimpan"
              style={{
                alignSelf: "flex-start",
                backgroundColor: warna.bahaya,
                paddingVertical: 4,
                paddingHorizontal: 10,
                borderRadius: 6,
                marginTop: 4,
              }}
            >
              <Teks style={{ color: "white", fontSize: 12, fontWeight: "600" }}>
                Hapus Semua
              </Teks>
            </TouchableOpacity>
          </View>
        )}

        <AtribusiCuaca />
      </ScrollView>
    </Layar>
  );
}
