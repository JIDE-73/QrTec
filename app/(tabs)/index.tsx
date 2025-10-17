import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  const [textoMostrado, setTextoMostrado] = useState<string>(
    "Presiona el botón para escanear QR"
  );
  const [mostrarScanner, setMostrarScanner] = useState<boolean>(false);
  const [qrEscaneado, setQrEscaneado] = useState<boolean>(false);
  const [puedeEscanear, setPuedeEscanear] = useState<boolean>(false);
  const [permission, requestPermission] = useCameraPermissions();

  const activarScanner = () => {
    setMostrarScanner(true);
    setPuedeEscanear(false);
    setQrEscaneado(false);

    // Timeout de 2 segundos antes de permitir escanear
    setTimeout(() => {
      setPuedeEscanear(true);
    }, 2000);
  };

  const desactivarScanner = () => {
    setMostrarScanner(false);
    setPuedeEscanear(false);
  };

  const handleQRScanned = ({ data }: { data: string }) => {
    // Prevenir múltiples escaneos y verificar si puede escanear
    if (qrEscaneado || !puedeEscanear) return;

    setQrEscaneado(true);
    setPuedeEscanear(false);
    setTextoMostrado(`QR Escaneado: ${data}`);
    setMostrarScanner(false);

    // Mostrar alert solo una vez
    Alert.alert("QR Escaneado Exitosamente", `Contenido: ${data}`, [
      { text: "OK", onPress: () => console.log("Alert closed") },
    ]);
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
      <StatusBar barStyle="dark-content" />

      {mostrarScanner ? (
        // Vista del Scanner QR
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
            onPress={desactivarScanner}
          >
            <Text style={styles.textoBoton}>
              {qrEscaneado ? "Volver" : "Cancelar"}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Vista principal con solo el botón de scanner
        <View style={styles.mainContainer}>
          {/* Texto mostrado */}
          <View style={styles.textContainer}>
            <Text style={styles.textoPrincipal}>{textoMostrado}</Text>
            {textoMostrado.includes("QR Escaneado") && (
              <Text style={styles.mensajeExito}>¡Escaneo completado!</Text>
            )}
          </View>

          {/* Botón Scanner QR */}
          <View style={styles.botonContainer}>
            <TouchableOpacity
              style={styles.botonScanner}
              onPress={activarScanner}
            >
              <Text style={styles.textoBoton}>
                {textoMostrado.includes("QR Escaneado")
                  ? "Escanear otro QR"
                  : "Escanear QR"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
    justifyContent: "space-between",
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
    color: "#333",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 10,
  },
  mensajeExito: {
    fontSize: 18,
    color: "#27ae60",
    fontWeight: "600",
    marginTop: 10,
  },
  botonContainer: {
    padding: 40,
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
  botonScanner: {
    backgroundColor: "#6c5ce7",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
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
});
