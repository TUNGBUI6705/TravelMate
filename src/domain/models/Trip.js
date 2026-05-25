// Trip Status type definition
const TripStatus = {
  PLANNING: "planning",
  COMPLETED: "completed",
  CANCELLED: "cancelled"
};

// Trip Visibility type definition
const TripVisibility = {
  PRIVATE: "private",
  SHARED: "shared"
};

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} ownerUid
 * @property {string} title
 * @property {string} description
 * @property {string} coverImage
 * @property {*} startDate
 * @property {*} endDate
 * @property {number} duration
 * @property {string[]} destinations
 * @property {string} status
 * @property {string} visibility
 * @property {string|null} shareCode
 * @property {string[]} sharedWith
 * @property {number} totalBudget
 * @property {number} totalExpense
 * @property {number} memberCount
 * @property {*} createdAt
 * @property {*} updatedAt
 */

export { TripStatus, TripVisibility };
