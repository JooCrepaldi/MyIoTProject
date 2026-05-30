import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MQTTService from './src/services/mqttService';
import StatusModal from './src/components/StatusModal';
import LightControl from './src/components/LightControl';
import Gauges from './src/components/Gauges';

const mqtt = new MQTTService();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLightOn, setIsLightOn] = useState(false);
  const [temp, setTemp] = useState(0);
  const [hum, setHum] = useState(0);

  const mqttHost = process.env.EXPO_PUBLIC_MQTT_HOST ?? process.env.MQTT_HOST;
  const mqttPort = process.env.EXPO_PUBLIC_MQTT_PORT ?? process.env.MQTT_PORT;
  const mqttPath = process.env.EXPO_PUBLIC_MQTT_PATH ?? process.env.MQTT_PATH;
  const mqttUser = process.env.EXPO_PUBLIC_MQTT_USER ?? process.env.MQTT_USER;
  const mqttPass = process.env.EXPO_PUBLIC_MQTT_PASS ?? process.env.MQTT_PASS;

  const mqttConfig = {
    host: mqttHost,
    port: parseInt(mqttPort, 10),
    path: mqttPath,
    user: mqttUser,
    pass: mqttPass,
    clientId: 'RN_App_' + Math.random(),
  };

  useEffect(() => {
    startConnection();
  }, []);
  
  const startConnection = () => {
    const isConfigComplete = mqttHost && mqttPort && mqttPath && mqttUser && mqttPass;

    if (!isConfigComplete) {
      setIsConnected(false);
      setErrorMessage('Configuração do broker incompleta. Preencha as variáveis EXPO_PUBLIC_MQTT_HOST, EXPO_PUBLIC_MQTT_PORT, EXPO_PUBLIC_MQTT_PATH, EXPO_PUBLIC_MQTT_USER e EXPO_PUBLIC_MQTT_PASS no arquivo .env.');
      setShowError(true);
      return;
    }

    setShowError(false);
    setErrorMessage('');
    mqtt.connect(
      mqttConfig,
      (topic, message) => {
        if (topic === 'casa/temp') setTemp(parseFloat(message));
        if (topic === 'casa/umid') setHum(parseFloat(message));
        if (topic === 'casa/luz') setIsLightOn(message === "1");
      },
      () => {
        setIsConnected(true);
        mqtt.subscribe('casa/temp');
        mqtt.subscribe('casa/umid');
        mqtt.subscribe('casa/luz');
      },
      (err) => {
        setIsConnected(false);
        setErrorMessage('Não foi possível conectar ao Broker HiveMQ. Verifique sua conexão e credenciais.');
        setShowError(true);
      }
    );
  };

  const toggleLight = () => {
    const newState = isLightOn ? "0" : "1";
    mqtt.publish('casa/luz', newState);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Smart Home IoT</Text>

      <LightControl isLightOn={isLightOn} onToggle={toggleLight} />

      <Gauges temp={temp} hum={hum} />

      {/* Componente de Status de Conexão */}
      <StatusModal
        visible={showError}
        message={errorMessage}
        onRetry={startConnection}
        onLater={() => setShowError(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
  },
});