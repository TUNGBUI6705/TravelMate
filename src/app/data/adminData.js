/**
 * @typedef {'active' | 'blocked' | 'pending'} UserStatus
 * @typedef {'draft' | 'published' | 'archived'} PlaceStatus
 * @typedef {'pending' | 'approved' | 'hidden'} ReviewStatus
 */

/**
 * @typedef {Object} AdminUser
 * @property {string} id
 * @property {string} fullName
 * @property {string} email
 * @property {string} joinedAt
 * @property {UserStatus} status
 */

/**
 * @typedef {Object} AdminPlace
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} category
 * @property {PlaceStatus} status
 */

/**
 * @typedef {Object} AdminReview
 * @property {string} id
 * @property {string} placeName
 * @property {string} reviewerName
 * @property {number} rating
 * @property {string} comment
 * @property {string} submittedAt
 * @property {ReviewStatus} status
 */

export const usersSeed = [];
export const placesSeed = [];
export const reviewsSeed = [];

export const systemDefaults = {
  platformName: "TravelMate",
  supportEmail: "support@travelmate.local",
  defaultLanguage: "en",
};
