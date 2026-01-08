# Firebase Setup Guide

This guide will walk you through setting up Firebase for the Telegram Trip Mini App.

## Prerequisites

- A Google account
- A Telegram bot (created via @BotFather)
- Node.js and npm installed

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Enter a project name (e.g., "telegram-trip-app")
4. Follow the setup wizard:
   - Enable/disable Google Analytics (optional)
   - Accept terms and create project

## Step 2: Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll add security rules later)
4. Select a location for your database (choose closest to your users)
5. Click **Enable**

## Step 3: Enable Authentication

1. Go to **Build** → **Authentication**
2. Click **Get started**
3. Enable **Anonymous** authentication:
   - Click on "Anonymous"
   - Toggle it to **Enabled**
   - Click **Save**

## Step 4: Get Firebase Configuration

1. Go to **Project Settings** (gear icon next to "Project Overview")
2. Scroll down to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register your app with a nickname (e.g., "Trip Mini App")
5. Copy the Firebase configuration object

You'll see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};
```

## Step 5: Configure Environment Variables

1. Create a `.env` file in the root of your project
2. Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

**Important:** Never commit the `.env` file to version control. It's already in `.gitignore`.

## Step 6: Deploy Firestore Security Rules

1. Install Firebase CLI (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:

   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:

   ```bash
   firebase init firestore
   ```

   - Select your Firebase project
   - Use `firestore.rules` as the rules file
   - Use `firestore.indexes.json` as the indexes file

4. Deploy the rules:

   ```bash
   firebase deploy --only firestore:rules
   ```

5. Deploy the indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

## Step 7: Install Dependencies

```bash
npm install
```

This will install Firebase SDK and other required dependencies.

## Step 8: Test the Setup

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open the app in your browser (for testing)
3. Check the browser console for any Firebase errors
4. Verify that Firebase authentication works

## Security Rules Explanation

The Firestore security rules ensure that:

- Only authenticated users can read/write trips
- Users can only access trips that belong to their group (`groupId`)
- The `groupId` field cannot be modified after creation
- Required fields (destination, dates) are validated

## Troubleshooting

### "Permission denied" errors

- Make sure security rules are deployed: `firebase deploy --only firestore:rules`
- Check that Anonymous authentication is enabled
- Verify the `groupId` is being set correctly

### "Index not found" errors

- Deploy indexes: `firebase deploy --only firestore:indexes`
- Wait a few minutes for indexes to build

### Authentication errors

- Verify Firebase config in `.env` is correct
- Check that Anonymous auth is enabled in Firebase Console
- Clear browser cache and try again

### Group ID not found

- Make sure the app is opened in a Telegram group (not private chat)
- Check browser console for Telegram WebApp initialization errors
- Verify `initData` is available in `window.Telegram.WebApp.initData`

## Next Steps

1. Deploy your app to a hosting service (Vercel, Netlify, etc.)
2. Update your Telegram bot's Mini App URL
3. Test in a Telegram group
4. Monitor Firebase Console for usage and errors

## Firebase Console Links

- [Firebase Console](https://console.firebase.google.com/)
- [Firestore Database](https://console.firebase.google.com/project/_/firestore)
- [Authentication](https://console.firebase.google.com/project/_/authentication)
- [Project Settings](https://console.firebase.google.com/project/_/settings/general)

## Cost Considerations

Firebase has a generous free tier:

- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Authentication**: Unlimited
- **Storage**: 1 GB stored, 10 GB downloaded per month

For most small to medium groups, this should be sufficient. Monitor usage in Firebase Console.
