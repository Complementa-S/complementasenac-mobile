# 🎓 Complementa+ (Mobile - Senac)

Sistema acadêmico mobile para gestão de horas complementares do Senac. Alunos submetem atividades com comprovante diretamente pelo celular, coordenadores avaliam, e administradores gerenciam a plataforma.

**Stack:** React Native (Expo v54) + TypeScript + Node.js (Express) + Firebase Auth + Firestore + Firebase Storage.

---

## 📋 Requisitos

* Node.js 18+ (LTS recomendado)
* Aplicativo **Expo Go** instalado no celular (iOS ou Android)
* Conta Firebase com Auth, Firestore e Storage habilitados
* Arquivo JSON de *service account* do Firebase Admin para o backend

---

## 📁 Estrutura do projeto

| Pasta | Descrição |
| :--- | :--- |
| `mobile/` | Interface Mobile (React Native, Expo v54) |
| `backend/` | API REST (Node.js + Express) |

---

## ⚙️ Configuração de ambiente

### Backend (`backend/.env`)
Copie `backend/.env.example` para `backend/.env` e preencha:

| Variável | Obrigatória | Descrição |
| :--- | :--- | :--- |
| `PORT` | Não | Porta da API (padrão: 8080) |
| `CORS_ORIGIN` | Não | Em dev: `*`. Em prod: domínios permitidos. |
| `FIREBASE_CREDENTIALS_FILE` | Sim | Caminho relativo ou absoluto para o JSON do Admin SDK. |
| `FIREBASE_STORAGE_BUCKET` | Sim | Bucket do Storage: `pi-3-286ed.firebasestorage.app` |
| `MAIL_ENABLED` | Não | `true` para enviar e-mails (padrão: `false`) |
| *(Outras vars SMTP)* | Não | Credenciais para envio de e-mails (Host, Port, User, Pass) |

### App Mobile (`mobile/.env`)
No Expo, as variáveis públicas devem começar com `EXPO_PUBLIC_`. Copie `mobile/.env.example` para `mobile/.env` e preencha:

| Variável | Obrigatória | Descrição |
| :--- | :--- | :--- |
| `EXPO_PUBLIC_API_BASE` | Sim | URL da API (dev: IP da sua máquina ex: `http://192.168.0.x:8080`, prod: URL do backend) |
| `EXPO_PUBLIC_FIREBASE_APIKEY` | Sim | API Key do Firebase Web SDK |
| `EXPO_PUBLIC_FIREBASE_AUTHDOMAIN` | Sim | Ex: `pi-3-286ed.firebaseapp.com` |
| `EXPO_PUBLIC_FIREBASE_PROJECTID` | Sim | Ex: `pi-3-286ed` |
| `EXPO_PUBLIC_FIREBASE_STORAGEBUCKET` | Sim | Ex: `pi-3-286ed.firebasestorage.app` |
| `EXPO_PUBLIC_FIREBASE_MESSAGINGSENDERID`| Sim | Sender ID do Firebase |
| `EXPO_PUBLIC_FIREBASE_APPID` | Sim | App ID do Firebase Web |

> **Atenção:** Para testar no Expo Go pelo celular físico, o `EXPO_PUBLIC_API_BASE` **não pode ser localhost**. Deve ser o endereço IPv4 da máquina onde o backend está rodando na sua rede Wi-Fi.

---

## 🚀 Como rodar localmente

### 1. Backend
Em um terminal:
```bash
cd backend
npm install
# Configure backend/.env com o JSON do Firebase
npm run dev
