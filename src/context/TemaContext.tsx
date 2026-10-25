import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useColorScheme } from "react-native";

export type ModeTema = "terang" | "gelap" | "sistem";

const KUNCI_MODE = "mode_tema";

export const paletTerang = {
  latar: "#F5F7FA",
  kartu: "#FFFFFF",
  teks: "#111827",
  teksSekunder: "#4B5563",
  garis: "#D1D5DB",
  aksen: "#2563EB",
  bahaya: "#B91C1C",
  suksesLatar: "#DCFCE7",
  suksesTeks: "#166534",
  peringatanLatar: "#FEF3C7",
  peringatanTeks: "#92400E",
};

export type PaletWarna = typeof paletTerang;

export const paletGelap: PaletWarna = {
  latar: "#0F172A",
  kartu: "#1E293B",
  teks: "#F1F5F9",
  teksSekunder: "#A8B3C5",
  garis: "#334155",
  aksen: "#60A5FA",
  bahaya: "#DC2626",
  suksesLatar: "#14532D",
  suksesTeks: "#BBF7D0",
  peringatanLatar: "#78350F",
  peringatanTeks: "#FDE68A",
};

interface NilaiTema {
  mode: ModeTema;
  setMode: (m: ModeTema) => void;
  warna: PaletWarna;
  gelap: boolean;
}

const TemaContext = createContext<NilaiTema | null>(null);

export function TemaProvider({ children }: { children: ReactNode }) {
  const skemaSistem = useColorScheme();
  const [mode, setModeState] = useState<ModeTema>("sistem");
  const [siap, setSiap] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const tersimpan = await AsyncStorage.getItem(KUNCI_MODE);
        if (
          tersimpan === "terang" ||
          tersimpan === "gelap" ||
          tersimpan === "sistem"
        ) {
          setModeState(tersimpan);
        }
      } catch {
        // abaikan, pakai default "sistem"
      } finally {
        setSiap(true);
      }
    })();
  }, []);

  function setMode(m: ModeTema) {
    setModeState(m);
    AsyncStorage.setItem(KUNCI_MODE, m).catch(() => {});
  }

  const gelap =
    mode === "gelap" || (mode === "sistem" && skemaSistem === "dark");

  const nilai = useMemo<NilaiTema>(
    () => ({ mode, setMode, warna: gelap ? paletGelap : paletTerang, gelap }),
    [mode, gelap],
  );

  if (!siap) return null;

  return <TemaContext.Provider value={nilai}>{children}</TemaContext.Provider>;
}

export function useTema(): NilaiTema {
  const ctx = useContext(TemaContext);
  if (!ctx) throw new Error("useTema harus dipakai di dalam <TemaProvider>");
  return ctx;
}