# MyIoTProject 🏠

Aplicativo mobile que monitora temperatura, umidade e controla a luz de uma casa via MQTT, usando o HiveMQ como broker.

https://github.com/user-attachments/assets/d84e7d0c-1f8a-46ca-8df4-5dea0d1f5903

## Tecnologias

- Expo / React Native
- HiveMQ Cloud (Broker MQTT)
- react_native_mqtt

## Tópicos MQTT

| Tópico      | Descrição                           |
|-------------|-------------------------------------|
| `casa/temp` | Temperatura em °C                   |
| `casa/umid` | Umidade em %                        |
| `casa/luz`  | Estado da luz (`1` = on, `0` = off) |

## Como rodar

```bash
git clone https://github.com/seu-usuario/MyIoTProject.git
cd MyIoTProject
npx expo install
```

Crie um `.env` baseado no `.env.example` com suas credenciais do HiveMQ e rode:

```bash
npx expo start
```

---

Trabalho de PAM — Etec Bento Quirino, 2026.
