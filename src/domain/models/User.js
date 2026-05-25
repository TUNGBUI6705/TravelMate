// User Role type definition
const UserRole = {
  USER: "user",
  ADMIN: "admin"
};

// User Status type definition
const UserStatus = {
  ACTIVE: "active",
  BANNED: "banned"
};

// Date Value type - can be Date, string, number, or Firestore timestamp
const DateValue = {};

/**
 * @typedef {Object} UserStats
 * @property {number} totalTrips
 * @property {number} totalPlaces
 * @property {number} totalReviews
 * @property {number} totalExpense
 */

/**
 * @typedef {Object} UserPreferences
 * @property {string[]} types
 * @property {string} budget
 * @property {string} travelStyle
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} uid
 * @property {string} email
 * @property {string} displayName
 * @property {string} photoUrl
 * @property {string} phone
 * @property {string} role
 * @property {string} status
 * @property {string|null} bannedReason
 * @property {*} bannedAt
 * @property {UserStats} stats
 * @property {UserPreferences} preferences
 * @property {*} createdAt
 */

export { UserRole, UserStatus, DateValue };
