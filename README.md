# Trip Tracker - Telegram Mini App

A powerful Telegram Mini App for tracking and planning trips with **cloud storage** and **group collaboration** features.

## 🌟 What Makes This Special

### ☁️ **Firebase Cloud Storage**

- All trip data stored in Firebase Firestore
- Real-time synchronization across all group members
- Secure group-based access control
- Automatic updates when any member makes changes

### 👥 **Group Collaboration**

- Share trips with your Telegram group
- Everyone can add, edit, and view trips
- Perfect for planning group vacations together
- Real-time updates for all members
- Data isolated per group - each group has its own trip list

### 📱 **Full Feature Set**

- Beautiful mobile-first interface
- Countdown to next trip
- Comprehensive flight tracking
- Detailed day-by-day itineraries
- Automatic trip categorization (upcoming/past)

## Features in Detail

### Trip Management

- Add, edit, and delete trips with ease
- Automatic categorization into upcoming and past trips
- Beautiful countdown timer to your next trip
- Trip cards with images, dates, and quick stats
- Refresh button to sync latest changes

### Flight Details

Store comprehensive flight information:

- Airline and flight number
- Departure and arrival airports with codes
- Terminal, gate, and seat information
- Booking references
- Multiple flights per trip

### Detailed Itinerary

Plan every moment with:

- Activities, accommodations, transport, dining, and more
- Specific dates, times, and locations
- Descriptions and notes
- Automatic chronological sorting
- Color-coded activity types

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **date-fns** for date manipulation
- **Lucide React** for icons
- **Firebase Firestore** for real-time data persistence
- **Firebase Authentication** for secure access

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Note:** You need to set up Firebase before running the app. See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed instructions.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deployment & Setup

### Prerequisites

1. **Set up Firebase** (required):

   - Follow the complete guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Create a Firebase project
   - Enable Firestore and Anonymous Authentication
   - Configure environment variables

2. **Create Telegram Bot:**
   - Talk to [@BotFather](https://t.me/botfather)
   - `/newbot` → Create your bot
   - `/newapp` → Add Mini App (you'll add the URL after deployment)

### Deployment Steps

1. **Configure Environment Variables:**

   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration values

2. **Deploy to a hosting platform:**

   - Vercel (recommended): `vercel --prod`
   - Netlify: Connect your repo and add environment variables
   - GitHub Pages: See deployment docs

3. **Update Telegram Bot:**

   - Get your deployment URL
   - Use `/newapp` or `/editapp` with @BotFather
   - Set the Mini App URL to your deployment

4. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   firebase deploy --only firestore:indexes
   ```

### For Group Sharing

1. **Enable group mode:**

   - `/setjoingroups` with @BotFather
   - Turn OFF "Group Privacy" in bot settings

2. **Add bot to group:**

   - Create or open a Telegram group
   - Add your bot as a member

3. **Open Mini App in group:**
   - In the group chat, click on the bot
   - Open the Mini App
   - All group members now share the same trip data!

**Note:** Each Telegram group has its own isolated trip data. Data from one group is not visible to members of other groups.

## How Data Storage Works

### Firebase Firestore

- All trip data is stored in Firebase Firestore
- Real-time synchronization using Firestore listeners
- Automatic updates when any group member makes changes
- Secure access control based on Telegram group ID

### Group-Based Isolation

- Each Telegram group has its own `groupId`
- Trips are stored with the `groupId` field
- Only members of the same group can see and edit trips
- Data is completely isolated between different groups

### Individual vs Group Mode

- **Private Chat**: Uses `user_<userId>` as groupId - trips are private to that user
- **Group Chat**: Uses `group_<chatId>` as groupId - trips are shared with all group members

**Important:** The same bot can be used in multiple groups. Each group has completely separate trip data!

## Usage Guide

### Adding a Trip

1. Click the "+" button
2. Fill in destination and dates (required)
3. Add optional image URL and description
4. Click "Add Flight" to add flight details
5. Click "Add Item" to build your itinerary
6. Save your trip

### Managing Trips

- **View Details**: Click any trip card
- **Edit**: Open trip → Click edit icon
- **Delete**: Open trip → Click delete icon
- **Refresh**: Click refresh icon in header to sync latest changes

### Flight Information

For each flight, you can store:

- Airline name and flight number
- Departure/arrival airports and codes
- Departure/arrival times
- Terminal, gate, seat assignments
- Booking/confirmation reference

### Itinerary Planning

Build your day-by-day plan with:

- **Activities**: Tours, sightseeing, events
- **Accommodation**: Hotels, check-ins
- **Transport**: Trains, car rentals
- **Dining**: Restaurant reservations
- **Other**: Miscellaneous items

Each item includes:

- Date and optional time
- Title and description
- Location information
- Automatic chronological sorting

## Project Structure

```
src/
├── components/          # React components
│   ├── Countdown.tsx   # Next trip countdown widget
│   ├── TripCard.tsx    # Individual trip display
│   ├── TripDetail.tsx  # Full trip view
│   ├── TripForm.tsx    # Add/edit trip form
│   └── TripList.tsx    # Main trips list view
├── types.ts            # TypeScript interfaces
├── store.ts            # Zustand state management
├── storage.ts          # Telegram Cloud Storage integration
├── utils.ts            # Helper functions
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## Key Files

- **storage.ts**: Telegram Cloud Storage integration with localStorage fallback
- **store.ts**: Global state management with async operations
- **types.ts**: TypeScript type definitions for Trip, Flight, and ItineraryItem
- **components/**: All React components with full TypeScript typing

## Development Notes

### Testing Cloud Storage Locally

Cloud Storage only works in production. During development:

- The app automatically uses localStorage
- Data won't sync between devices
- Deploy to test cloud storage features

### Testing Group Sharing

1. Deploy the app to production
2. Create a test Telegram group
3. Add your bot to the group
4. Test with multiple accounts

## Troubleshooting

### "Data not syncing between group members"

**Check:**

- Is everyone opening the app FROM the group chat?
- Is the bot added to the group?
- Are you all in the same group?

**Solution:** Make sure everyone opens the Mini App by clicking it in the group chat, not from their personal bot chat.

### "My personal trips disappeared"

**This is normal!**

- Personal trips (opened via bot chat) have separate storage from group trips
- Switch contexts to see different trip lists
- Both are preserved independently

### "Changes aren't appearing"

- Click the refresh button (↻) in the header
- Close and reopen the Mini App
- Check your internet connection

## Future Enhancements

Potential features to add:

- [ ] Push notifications for trip updates
- [ ] Activity log (who changed what)
- [ ] Comments on trips/itinerary
- [ ] Photo uploads and galleries
- [ ] Expense tracking
- [ ] Packing lists
- [ ] Weather integration
- [ ] Map view of locations
- [ ] Export to PDF/Calendar
- [ ] Voting on activities
- [ ] Task assignments

## Documentation

- **[README.md](README.md)** - This file (technical overview)
- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step deployment guide
- **[GROUP_SHARING.md](GROUP_SHARING.md)** - Complete group collaboration setup
- **demo-data.js** - Sample data for testing

## Security & Privacy

### What's Stored

- Trip information (destinations, dates, descriptions)
- Flight details (airlines, times, booking references)
- Itinerary items (activities, locations, notes)

### Where It's Stored

- **Production**: Telegram Cloud Storage (encrypted by Telegram)
- **Development**: Browser localStorage
- **Backup**: localStorage (in production too, as fallback)

### Who Can Access

- **Individual mode**: Only you
- **Group mode**: All group members
- **Telegram**: Data stored on Telegram servers (standard encryption)

### Best Practices

- Don't store highly sensitive info (passport numbers, credit cards)
- Use booking references instead of full payment details
- Trust your group members - they have full access in group mode
- Remove members from group to revoke their access

## Contributing

This is an open-source project. Feel free to:

- Fork and modify for your needs
- Submit pull requests
- Report issues
- Suggest features

## License

MIT License - feel free to use this for your own projects!

## Support

- Review the documentation files
- Check Telegram's Mini Apps documentation
- Test with a small group first
- Join our community (if applicable)

---

**Built with ❤️ for travelers everywhere 🌍✈️**

Happy trip planning!
