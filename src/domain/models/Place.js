// Map Provider type definition
const MapProvider = {
  GOOGLE: "google",
  OPENSTREETMAP: "openstreetmap",
  MANUAL: "manual"
};

// Place Status type definition
const PlaceStatus = {
  ACTIVE: "active",
  HIDDEN: "hidden"
};

/**
 * @typedef {Object} PlaceLocation
 * @property {number} lat
 * @property {number} lng
 */

/**
 * @typedef {Object} PlaceStats
 * @property {number} avgRating
 * @property {number} totalReviews
 * @property {number} totalVisits
 */

/**
 * @typedef {Object} Place
 * @property {string} id
 * @property {string} name
 * @property {string} province
 * @property {string} city
 * @property {string} type
 * @property {string} description
 * @property {string} address
 * @property {PlaceLocation} location
 * @property {string|null} googleMapsUrl
 * @property {string|null} googlePlaceId
 * @property {number|null} googleRating
 * @property {number|null} googleTotalRatings
 * @property {string} mapProvider
 * @property {string|number|null} osmNodeId
 * @property {string[]} images
 * @property {string} coverImage
 * @property {string[]} tags
 * @property {string} openingHours
 * @property {number} entryFee
 * @property {PlaceStats} stats
 * @property {string} status
 * @property {*} createdAt
 * @property {*} updatedAt
 * @property {string} createdBy
 */

export { MapProvider, PlaceStatus };
