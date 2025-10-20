import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface QRScannerProps {
  onQRScanned: (data: string) => void;
  onClose: () => void;
  qrEscaneado: boolean;
}

export default function QRScanner({
  onQRScanned,
  onClose,
  qrEscaneado,
}: QRScannerProps) {
  const [puedeEscanear, setPuedeEscanear] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    // Timeout de 2 segundos antes de permitir escanear
    const timer = setTimeout(() => {
      setPuedeEscanear(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleQRScanned = ({ data }: { data: string }) => {
    // Prevenir múltiples escaneos y verificar si puede escanear
    if (qrEscaneado || !puedeEscanear) return;

    setPuedeEscanear(false);
    onQRScanned(data);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textoPrincipal}>
            Necesitamos permiso para usar la cámara
          </Text>
          <TouchableOpacity style={styles.boton} onPress={requestPermission}>
            <Text style={styles.textoBoton}>Conceder Permiso</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Vista del Scanner QR */}
      <View style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={
            puedeEscanear && !qrEscaneado ? handleQRScanned : undefined
          }
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>
            {!puedeEscanear
              ? "Preparando escáner..."
              : qrEscaneado
              ? "QR Escaneado"
              : "Escanea un código QR"}
          </Text>
          {!puedeEscanear && (
            <Text style={styles.textoPreparacion}>Espere un momento...</Text>
          )}
        </View>
        <TouchableOpacity
          style={[styles.boton, styles.botonCancelar]}
          onPress={onClose}
        >
          <Text style={styles.textoBoton}>
            {qrEscaneado ? "Volver" : "Cancelar"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  camera: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "white",
    backgroundColor: "transparent",
  },
  scanText: {
    color: "white",
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  textoPreparacion: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    opacity: 0.8,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  textoPrincipal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 20,
  },
  boton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  botonCancelar: {
    backgroundColor: "#636e72",
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  textoBoton: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
});
