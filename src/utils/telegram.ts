/**
 * Utility functions for extracting data from Telegram WebApp
 */

interface TelegramInitData {
  user?: {
    id: number;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  chat?: {
    id: number;
    type: string;
    title?: string;
  };
  chat_type?: string;
  chat_instance?: string;
}

/**
 * Parse Telegram initData string into an object
 */
function parseInitData(initData: string): Record<string, string> {
  const params: Record<string, string> = {};
  const pairs = initData.split("&");

  for (const pair of pairs) {
    const [key, value] = pair.split("=");
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  }

  return params;
}

/**
 * Extract user data from initData
 */
function extractUserData(initData: string): TelegramInitData["user"] | null {
  try {
    const params = parseInitData(initData);
    const userStr = params.user;

    if (!userStr) return null;

    const user = JSON.parse(userStr);
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Extract chat data from initData
 */
function extractChatData(initData: string): TelegramInitData["chat"] | null {
  try {
    const params = parseInitData(initData);
    const chatStr = params.chat;

    if (!chatStr) return null;

    const chat = JSON.parse(chatStr);
    return {
      id: chat.id,
      type: chat.type,
      title: chat.title,
    };
  } catch (error) {
    console.error("Error parsing chat data:", error);
    return null;
  }
}

/**
 * Get the group ID from Telegram WebApp
 * Returns chat.id for groups, or user.id for private chats
 */
export function getGroupId(): string | null {
  if (!window.Telegram?.WebApp?.initData) {
    console.warn("Telegram WebApp initData not available");
    return null;
  }

  const initData = window.Telegram.WebApp.initData;

  // Try to get chat ID (for groups)
  const chat = extractChatData(initData);
  if (chat && chat.type !== "private") {
    return `group_${chat.id}`;
  }

  // Fallback to user ID (for private chats)
  const user = extractUserData(initData);
  if (user) {
    return `user_${user.id}`;
  }

  return null;
}

/**
 * Get user ID from Telegram WebApp
 */
export function getUserId(): number | null {
  if (!window.Telegram?.WebApp?.initData) {
    return null;
  }

  const user = extractUserData(window.Telegram.WebApp.initData);
  return user?.id || null;
}

/**
 * Check if we're in a group chat
 */
export function isGroupChat(): boolean {
  if (!window.Telegram?.WebApp?.initData) {
    return false;
  }

  const chat = extractChatData(window.Telegram.WebApp.initData);
  return !!chat && chat.type !== "private";
}

/**
 * Check if Telegram WebApp is available
 */
export function isTelegramWebApp(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  // The Telegram script can be loaded in any browser, which sets window.Telegram.WebApp,
  // but the app is considered truly \"launched\" in Telegram only when initData is present.
  const webApp = window.Telegram?.WebApp;
  const hasInitData =
    typeof webApp?.initData === "string" && webApp.initData.length > 0;

  return !!webApp && hasInitData;
}
