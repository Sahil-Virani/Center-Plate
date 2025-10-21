# CenterPlate Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technical Architecture](#technical-architecture)
3. [Setup Guide](#setup-guide)
4. [Development Workflow](#development-workflow)
5. [API Documentation](#api-documentation)
6. [Database Schema](#database-schema)
7. [Frontend Architecture](#frontend-architecture)
8. [Backend Architecture](#backend-architecture)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

## Project Overview

CenterPlate is a group dining coordination and recommendation application that helps users find optimal meeting points and restaurants for group dining. The application calculates midpoints between participants, provides restaurant recommendations, and facilitates group decision-making through a voting system.

### Key Features
- Location-based midpoint calculation
- Restaurant recommendations
- Group voting system
- Real-time updates
- Push notifications
- User preferences management

### Tech Stack
- **Frontend**: React Native with Expo
- **Backend**: Node.js with Express
- **Database**: MongoDB
- **Authentication**: Firebase
- **Real-time**: Socket.IO
- **Maps**: MapLibre/Leaflet
- **Notifications**: Firebase Cloud Messaging

## Technical Architecture

### System Components
1. **Mobile Application (Frontend)**
   - React Native with Expo
   - File-based routing
   - Context API for state management
   - Real-time updates via Socket.IO

2. **Backend Server**
   - Node.js with Express
   - RESTful API
   - WebSocket server
   - MongoDB integration
   - Firebase Admin SDK

3. **Database**
   - MongoDB Atlas
   - Mongoose ODM
   - User and Session models

4. **External Services**
   - Firebase Authentication
   - Firebase Cloud Messaging
   - Map services
   - Geolocation services

## Setup Guide

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Firebase project
- Expo CLI
- Android Studio (for Android development)

### Environment Setup
1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Set up Firebase project
5. Configure MongoDB Atlas

### Development Environment
1. Start the backend server
2. Launch the frontend application
3. Configure development tools
4. Set up debugging environment

## API Documentation

### REST Endpoints
- Authentication routes
- User management
- Session management
- Location services
- Restaurant recommendations

### WebSocket Events
- Real-time updates
- Voting system
- Location tracking
- Session management

## Database Schema

### Models
1. **User Model**
   - Authentication data
   - Preferences
   - Locations
   - Push tokens

2. **Session Model**
   - Participants
   - Voting data
   - Location data
   - Status tracking