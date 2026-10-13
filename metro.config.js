// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Izinkan Metro memuat file WebAssembly untuk expo-sqlite di web
config.resolver.assetExts.push("wasm");

// Header yang dibutuhkan SQLite di web (SharedArrayBuffer)
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    middleware(req, res, next);
  };
};

module.exports = config;
