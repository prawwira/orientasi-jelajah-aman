// src/components/SearchBox.tsx
import { useState } from "react";
import { TextInput, View } from "react-native";
interface SearchBoxProps {
  onCari: (teks: string) => void;
  nilai?: string; // BARU: opsional, untuk mengisi kotak dari luar
}
export default function SearchBox({ onCari, nilai }: SearchBoxProps) {
  const [teksLokal, setTeksLokal] = useState("");
  const teks = nilai ?? teksLokal; // BARU: pakai nilai dari luar kalau ada

  function handleChange(nilaiBaru: string) {
    setTeksLokal(nilaiBaru);
    onCari(nilaiBaru); // kirim setiap perubahan, debounce diatur di pemanggilnya
  }
  return (
    <View>
      <TextInput
        placeholder="Cari nama kota..."
        value={teks}
        onChangeText={handleChange}
        accessibilityLabel="Cari cuaca untuk kota yang dimasukkan"
        style={{ borderWidth: 1, padding: 8, borderRadius: 8 }}
      />
    </View>
  );
}