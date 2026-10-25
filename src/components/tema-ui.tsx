import { ReactNode } from "react";
import { Text, TextProps, View, ViewProps } from "react-native";
import { useTema } from "../context/TemaContext";

export function Layar({
  children,
  style,
  ...rest
}: ViewProps & { children?: ReactNode }) {
  const { warna } = useTema();
  return (
    <View style={[{ flex: 1, backgroundColor: warna.latar }, style]} {...rest}>
      {children}
    </View>
  );
}

export function Teks({ style, ...rest }: TextProps) {
  const { warna } = useTema();
  return <Text style={[{ color: warna.teks }, style]} {...rest} />;
}