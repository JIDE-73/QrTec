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
import QRScanner from "../qr/qr";

export default function App() {
  const [textoMostrado, setTextoMostrado] = useState<string>(
    "Presiona el botón para escanear QR"
  );
  const [mostrarScanner, setMostrarScanner] = useState<boolean>(false);
  const [qrEscaneado, setQrEscaneado] = useState<boolean>(false);

  const activarScanner = () => {
    setMostrarScanner(true);
    setQrEscaneado(false);
    setTextoMostrado("Presiona el botón para escanear QR");
  };

  const desactivarScanner = () => {
    setMostrarScanner(false);
  };

  const handleCierreAutomatico = () => {
    setMostrarScanner(false);
    setTextoMostrado("El escaneo fue cancelado automáticamente");

    Alert.alert(
      "Tiempo agotado",
      "No se detectó ningún código QR. Por favor, intenta de nuevo.",
      [{ text: "OK" }]
    );
  };

  const handleQRScanned = (data: string) => {
    setQrEscaneado(true);
    setTextoMostrado(`QR Escaneado: ${data}`);
    setMostrarScanner(false);

    Alert.alert("QR Escaneado Exitosamente", `Contenido: ${data}`, [
      {
        text: "OK",
        onPress: () => console.log("Alert cerrado"),
      },
    ]);
  };

  const handleErrorScanner = (mensaje: string) => {
    setMostrarScanner(false);
    setTextoMostrado(mensaje);

    Alert.alert("Error", mensaje, [{ text: "OK" }]);
  };

  if (mostrarScanner) {
    return (
      <QRScanner
        onQRScanned={handleQRScanned}
        onClose={desactivarScanner}
        onCierreAutomatico={handleCierreAutomatico}
        onError={handleErrorScanner}
        qrEscaneado={qrEscaneado}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Vista principal con solo el botón de scanner */}
      <View style={styles.mainContainer}>
        {/* Texto mostrado */}
        <View style={styles.textContainer}>
          <Text style={styles.textoPrincipal}>{textoMostrado}</Text>
          {textoMostrado.includes("QR Escaneado") && (
            <Text style={styles.mensajeExito}>¡Escaneo completado!</Text>
          )}
          {textoMostrado.includes("cancelado") && (
            <Text style={styles.mensajeError}>Tiempo agotado</Text>
          )}
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
      </View>
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
  mensajeError: {
    fontSize: 18,
    color: "#e74c3c",
    fontWeight: "600",
    marginTop: 10,
  },
  botonContainer: {
    padding: 40,
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
  textoBoton: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
});
