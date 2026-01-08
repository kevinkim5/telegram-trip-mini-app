# Telegram CloudStorage - Group Trip Sharing Guide

## What Changed

Your Trip Tracker app now uses **Telegram CloudStorage** instead of browser localStorage. This means:

✅ **Data is shared** - All group members see the same trips
✅ **Automatic sync** - Changes sync across all users in real-time
✅ **No server needed** - Telegram handles all the storage
✅ **Cross-device** - Access your trips from any device

## How CloudStorage Works

### For Individual Chats
When the Mini App is opened in a **1-on-1 chat with the bot**, CloudStorage stores data privately for that specific user-bot pair. Only you can see your trips.

### For Group Chats (THIS IS WHAT YOU WANT!)
When the Mini App is opened in a **Telegram group**, CloudStorage is **shared among all group members**. Everyone in the group can:
- See all trips
- Add new trips
- Edit existing trips
- Delete trips

This makes it perfect for planning group trips with friends or family!

## Setting Up for Group Sharing

### Step 1: Create Your Bot (if not done yet)

1. Message [@BotFather](https://t.me/botfather) in Telegram
2. Send `/newbot` and follow prompts
3. Send `/newapp` to create a Mini App
4. Upload your deployed app URL

### Step 2: Enable Group Mode

After creating your bot with BotFather, you need to configure it for groups:

```
/mybots
→ Select your Trip Tracker bot
→ Bot Settings
→ Group Privacy
→ Turn OFF "Group Privacy"
```

This allows the bot to work in groups and enable shared CloudStorage.

### Step 3: Add Bot to Your Group

1. Create a Telegram group (or use existing)
2. Add your bot as a group member:
   - Open the group
   - Click "Add Members"
   - Search for your bot
   - Add it

### Step 4: Open the Mini App in the Group

1. In the group chat, type `/start` or click the bot
2. You should see a "Mini App" button or menu option
3. Click it to open the Trip Tracker
4. **Everyone in the group will now share the same trip data!**

## How Data Sharing Works

### Same Storage Key for All Group Members

The app uses a single storage key: `trip_tracker_data`

When opened in a group:
- **User A** adds a trip → Saved to CloudStorage
- **User B** opens the app → Sees User A's trip
- **User C** edits the trip → Changes visible to A and B
- **User D** deletes a trip → Removed for everyone

### Automatic Fallback

The code includes a smart fallback:

```typescript
if (isCloudStorageAvailable()) {
  // Use Telegram CloudStorage (for group sharing)
  // Data is shared with group members
} else {
  // Fallback to localStorage (for testing/development)
  // Data is private to your browser
}
```

This means:
- **In Telegram group**: Shared CloudStorage ✅
- **In web browser**: Private localStorage (for testing)

## Testing Group Sharing

### Quick Test Process

1. **Deploy your app** to Vercel/Netlify/GitHub Pages
2. **Set up bot** with @BotFather
3. **Create test group** with yourself + friend(s)
4. **Add bot** to the group
5. **Open app** in the group chat
6. **Add a trip** from your phone
7. **Friend opens app** and should see your trip!

### Debugging Issues

**App opens but data doesn't sync?**
- Check if Group Privacy is OFF in bot settings
- Ensure bot is actually in the group
- Try removing and re-adding the bot

**Changes not appearing?**
- Close and reopen the Mini App
- CloudStorage updates may take a moment
- Check if you're in the same group

**Data disappeared?**
- CloudStorage is tied to the bot-group pair
- If bot is removed from group, data may be lost
- Always keep bot as group admin

## Code Overview

### storage.ts

The key changes in `src/storage.ts`:

```typescript
// Check if running in Telegram with CloudStorage
const isCloudStorageAvailable = (): boolean => {
  const tg = getTelegramWebApp();
  return !!(tg && tg.CloudStorage);
};

// Load from CloudStorage (async)
export const loadTrips = async (): Promise<Trip[]> => {
  if (isCloudStorageAvailable()) {
    const tg = getTelegramWebApp()!;

    return new Promise((resolve) => {
      tg.CloudStorage.getItem(STORAGE_KEY, (error, value) => {
        if (error || !value) {
          resolve([]);
        } else {
          resolve(JSON.parse(value));
        }
      });
    });
  }
  // Fallback to localStorage...
};

// Save to CloudStorage (async)
export const saveTrips = async (trips: Trip[]): Promise<void> => {
  if (isCloudStorageAvailable()) {
    const tg = getTelegramWebApp()!;

    return new Promise((resolve, reject) => {
      tg.CloudStorage.setItem(STORAGE_KEY, JSON.stringify(trips), (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
  // Fallback to localStorage...
};
```

### All operations are now async

Because CloudStorage uses callbacks, all storage operations are now `async`:
- `loadTrips()` → `await loadTrips()`
- `saveTrips()` → `await saveTrips()`
- `addTrip()` → `await addTrip()`
- `updateTrip()` → `await updateTrip()`
- `deleteTrip()` → `await deleteTrip()`

## Benefits for Group Trips

Perfect for:
- 🏖️ **Family vacations** - Everyone can see the itinerary
- 🎒 **Friends' trips** - Collaborative planning
- 💼 **Work retreats** - Team coordination
- 🎉 **Bachelor/bachelorette parties** - Group organization

Each person can:
- Add their flight details
- Suggest activities
- Update itinerary items
- See countdown together

## Limitations to Know

1. **Storage Size**: CloudStorage has a limit (usually a few KB per key)
   - Should handle dozens of trips fine
   - If you need more, consider splitting data

2. **No Conflict Resolution**: Last write wins
   - If two people edit at the same time, one change may overwrite
   - For most use cases, this is fine

3. **Group-Specific**: Data is tied to that specific group
   - Different groups have different trip lists
   - Private chats have separate data

4. **Bot Dependency**: If bot is removed, data access is lost
   - Keep bot as permanent group member
   - Consider bot as "admin" for safety

## Privacy Notes

- **Group members only**: Only people in the group can see data
- **Telegram-hosted**: Data is stored on Telegram's servers
- **Not end-to-end encrypted**: Telegram can technically access it
- **Per-group isolation**: Each group's data is separate

## Migration from localStorage

If you were testing locally with localStorage:

1. Open the app in browser
2. Export trips: `JSON.stringify(localStorage.getItem('trip_tracker_data'))`
3. Open app in Telegram group
4. Manually re-add trips (CloudStorage and localStorage are separate)

Or wait for the first group member to add trips - that becomes the source of truth!

## Advanced: Multiple Groups

You can use the same bot in multiple groups:
- **Group A** (Family) - Has family vacation trips
- **Group B** (Friends) - Has friends trip plans
- **Group C** (Work) - Has work retreat plans

Each group has **completely separate data**. The `trip_tracker_data` key is scoped to each group-bot pair.

## Conclusion

Your Trip Tracker now has true collaborative features! Everyone in your group can plan trips together in real-time, all thanks to Telegram's CloudStorage API.

No backend servers, no databases, no authentication - just Telegram's built-in cloud storage making collaboration effortless.

Happy trip planning! 🌍✈️
