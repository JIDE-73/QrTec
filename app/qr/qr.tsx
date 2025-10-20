import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
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
  onCierreAutomatico: () => void;
  onError: (mensaje: string) => void;
  qrEscaneado: boolean;
}

export default function QRScanner({
  onQRScanned,
  onClose,
  onCierreAutomatico,
  qrEscaneado,
}: QRScannerProps) {
  const [puedeEscanear, setPuedeEscanear] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const escaneadoRef = useRef<boolean>(false);
  const URL_ = process.env.EXPO_PUBLIC_API_URL;
  console.log("URL de la API:", URL_);

  const send = async (data: any) => {
    try {
      console.log("Enviando a:", `${URL_}/user/boleto`);
      const response = await fetch(`${URL_}/user/boleto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: parseInt(data) }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      Alert.alert("GUARDADO");
    } catch (error) {
      console.error("Error en la solicitud:", error);
      Alert.alert("Error de conexión", "No se pudo conectar al servidor.");
    }
  };

  useEffect(() => {
    const prepararTimer = setTimeout(() => {
      setPuedeEscanear(true);

      timeoutRef.current = setTimeout(() => {
        if (!escaneadoRef.current) {
          onCierreAutomatico();
        }
      }, 1000);
    }, 1000);

    return () => {
      clearTimeout(prepararTimer);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [onCierreAutomatico]);

  const handleQRScanned = ({ data }: { data: string }) => {
    if (escaneadoRef.current || !puedeEscanear) return;

    escaneadoRef.current = true;
    setPuedeEscanear(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    onQRScanned(data);
    send(data);
  };

  const handleClose = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onClose();
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.textoBlanco}>Cargando permisos...</Text>
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
          <TouchableOpacity
            style={[styles.boton, styles.botonCancelar]}
            onPress={handleClose}
          >
            <Text style={styles.textoBoton}>Cancelar</Text>
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
          <TouchableOpacity
            style={[styles.boton, styles.botonCancelar]}
            onPress={handleClose}
          >
            <Text style={styles.textoBoton}>Cancelar</Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 14,
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
  textoBlanco: {
    color: "white",
    fontSize: 18,
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
    marginVertical: 10,
  },
  botonCancelar: {
    backgroundColor: "#636e72",
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  textoBoton: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
});
