# Vue.js Todo App with Firebase

This project is a Todo application built using Vue.js and Firebase. It includes features for task management and user profile management, including uploading profile photos to Firebase Storage.

## Features

- **User Authentication**: Secure login and signup with Firebase Authentication.
- **Task Management**: Create, update, and delete tasks with real-time synchronization.
- **User Profile**: Manage user profiles with the ability to upload a photo and update personal information.

## Prerequisites

- Node.js (v14.x or higher)
- npm or yarn
- Vue CLI (optional, but recommended)

## Installation

### 1. Clone the Repository

```bash
    git clone https://github.com/anand-aot/Vue_User_management-To-Do.git
    cd Vue_User_management-To-Do
```
### 2. Create firebase project:
- add firestore database
- add authentication [ signin method -email/password ]
- add storage[ for profile photo upload ] { enable cors if you run project locally }
    - **if you using gcloud for enable cors**
      - gcloud init
      - gcloud config set project <project-id> 
      - gsutil cors set cors.json <yourbucket.appspot.com>

### 3. Create .env file in root repository:
- paste this content inside it and change code with you project id
```bash
    VUE_APP_FIREBASE_API_KEY=your-api-key
    VUE_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VUE_APP_FIREBASE_PROJECT_ID=your-project-id
    VUE_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VUE_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
    VUE_APP_FIREBASE_APP_ID=your-app-id
```
### 4. Additional Notes:

- Customize the Firebase project name and bucket name if they differ.
- Include additional troubleshooting steps or common issues specific encounter .

### 5. To run project
```bash
  npm run serve
```
### 6. To build project for production
```bash
  npm run build
```
