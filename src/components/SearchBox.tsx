// src/components/SearchBox.tsx
import { useState } from "react";
import { TextInput, View } from "react-native";
import { useTema } from "../context/TemaContext";

interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilai?: string; // opsional: isi kotak dari luar
}

export default function SearchBox({ onCari, nilai }: SearchBoxProps) {
  const { warna } = useTema();
  const [teksLokal, setTeksLokal] = useState("");
  const teks = nilai ?? teksLokal;

  function handleChange(nilaiBaru: string) {
    setTeksLokal(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }

  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        placeholderTextColor={warna.teksSekunder}
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{
          borderWidth: 1,
          borderColor: warna.garis,
          padding: 8,
          borderRadius: 8,
          color: warna.teks,
          backgroundColor: warna.kartu,
        }}
      />
    </View>
  );
}
