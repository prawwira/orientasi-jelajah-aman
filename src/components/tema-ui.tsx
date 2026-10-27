// src/components/tema-ui.tsx
import { ReactNode } from "react";
import { StyleProp, Text, TextProps, ViewStyle } from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../context/TemaContext";

export function Teks({ style, ...props }: TextProps) {
  const { warna } = useTema();
  return <Text {...props} style={[{ color: warna.teks }, style]} />;
}

interface LayarProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
}

// Header tab sudah menangani area atas, jadi hanya sisi kiri dan kanan
export function Layar({
  children,
  style,
  edges = ["left", "right"],
}: LayarProps) {
  const { warna } = useTema();
  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: warna.latar }, style]}
    >
      {children}
    </SafeAreaView>
  );
}