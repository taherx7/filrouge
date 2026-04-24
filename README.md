## Prérequis

- Node.js installé
- MySQL installé et en cours d'exécution
- Base de données `filrouge` créée

## Installation

### 1. Frontend

À la racine du projet :

```bash
npm install
```

### 2. Backend

```bash
cd backend
npm install
```

## Lancement

### Backend

```bash
cd backend
node server.js
```

Le serveur démarre sur `http://localhost:5000`

### Frontend

À la racine du projet :

```bash
npm run dev
```

L'application démarre sur `http://localhost:5173`

## Comptes de test

| Nom    | Email                      | Mot de passe |
|--------|----------------------------|--------------|
| Taher  | taherayadi2005@gmail.com   | taher123     |
| Mohsen | mohsen.dev@gmail.com       | mohsen123    |

fil-rouge-frontend/
├── backend/
│   ├── db.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── MainLayout.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── AssignTasks.jsx
│   │   ├── Login.jsx
│   │   ├── projects.jsx
│   │   ├── Register.jsx
│   │   └── tasks.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json