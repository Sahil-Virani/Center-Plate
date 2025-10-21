# CenterPlate

CenterPlate is a group dining coordination and recommendation app designed to make meeting up with friends and family for a meal easier and more convenient. By inputting the addresses of people who want to dine together, the app calculates the midpoint, recommends restaurants, and helps everyone decide on a venue with a voting system. This solution aims to streamline group dining decisions and enhance social experiences.

## Tech Stack

### Frontend
- **React Native with Expo**: Cross-platform mobile development for Android and iOS, easy setup, and debugging.
- **Routing**: React Navigation for handling navigation between screens.
- **Form Handling**: React Hook Form for efficient and accessible form management.

### Backend
- **Node.js with Express.js**: Backend framework to handle API requests and business logic.
- **Database**: MongoDB Atlas for scalable, cloud-based data storage.
- **Socket.IO**: Socket.IO for real-time updates.
- **API Integration**: REST API built with Express.js.

### Mapping/Location
- **Geolocation API**: OpenStreetMap with Leaflet.js for mapping services and location-based features.
- **Retaurant Data**: FoursquareAPI for restaurant data.
- **Midpoint Calculation**: Custom implementation using the Haversine formula.

### Miscellaneous Tools
- **Authentication**: Firebase Authentication for user login and registration.

## Features
1. **User Profiles**: Users can create accounts, manage their profiles, and set dietary preferences and budget constraints.
2. **Location Triangulation**: Calculates the midpoint between multiple users to find convenient dining locations.
3. **Group Voting System**: Allows users to create and participate in votes to select a dining venue.

## Getting Started

### Prerequisites
- **Node.js**: You need Node.js installed to run the backend server.
- **MongoDB Atlas**: A MongoDB Atlas account and cluster.
- **Firebase**: A Firebase project for authentication.
- **Android Emulator**: You need an Android Emulator from Android Studio.

### Installation
1. **Clone the Repository**
   ```sh
   git clone https://github.com/your-username/CenterPlate.git
   cd CenterPlate
   ```

2. **Frontend Setup**
   ```sh
   cd frontend
   npm install
   ```

   Create a `.env` file in the frontend directory with the following variables:
   ```sh
   EXPO_PUBLIC_API_IP=your-local-ip-address
   EXPO_PUBLIC_API_PORT=3000
   EXPO_PUBLIC_API_URL=http://$EXPO_PUBLIC_API_IP:$EXPO_PUBLIC_API_PORT/api
   EXPO_PUBLIC_SOCKET_URL=http://$EXPO_PUBLIC_API_IP:$EXPO_PUBLIC_API_PORT

   EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   EXPO_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   ```

3. **Backend Setup**
   ```sh
   cd ../backend
   npm install
   ```

   Create a `.env` file in the backend directory with the following variables:
   ```sh
   MONGO_URI=your-mongodb-connection-string
   DB_NAME=db-name
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
   FOURSQUARE_API_KEY=your_foursquare_api_key
   ```

### Running the Application
1. **Backend**
   ```sh
   cd backend
   npm start
   ```

   You can run the following command to sync mongoDB and Firebase users:
   ```sh
   npm run sync:firebase
   ```

2. **Frontend**
   ```sh
   cd ../frontend
   npm start
   ```

## Project Structure
```
CenterPlate/
│
├── frontend/                # React Native project folder
|   ├── app/                 # Main entry point for the app (Expo uses file based routing)
|   ├── hooks/               # Authentication hook to handle user authorization
|   ├── firebase/            # Firebase setup files
|   ├── styles/              # Globla styles for the app
│   ├── app.json             # Expo configuration file
│   ├── babel.config.js      # Babel configuration
│   └── package.json         # Project dependencies and scripts
|
├── backend/                 # Node.js backend folder
│   ├── config/              # DB Configuration files
│   ├── controllers/         # Request handlers for routes
│   ├── models/              # MongoDB schemas and models
│   ├── routes/              # API route definitions
│   ├── middleware/          # Custom middleware functions
│   ├── utils/               # Utility functions and helpers
│   ├── services/            # DB CRUD operations
│   ├── socket/              # socket.io setup
│   ├── server.js            # Main entry point for backend server
|   └── package.json         # Project dependencies and scripts
│
├── docs/                   # Documentation and diagrams
├── .gitignore             # Files excluded from GitHub
└── README.md              # Project description and setup guide
```

## Contribution
1. **Clone** the repository.
2. **Create** a new branch (`git checkout -b feature-branch-name`).
3. **Commit** your changes (`git commit -m 'Add some feature'`).
4. **Push** to the branch (`git push origin feature-branch-name`).
5. **Open a Pull Request**.