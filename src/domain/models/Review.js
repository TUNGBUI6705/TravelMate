// Review Status type definition
const ReviewStatus = {
  VISIBLE: "visible",
  HIDDEN: "hidden",
  PENDING: "pending"
};

/**
 * @typedef {Object} Review
 * @property {string} id
 * @property {string} placeId
 * @property {string} placeName
 * @property {string} authorUid
 * @property {string} authorName
 * @property {string} authorPhoto
 * @property {number} rating
 * @property {string} comment
 * @property {string[]} photos
 * @property {*} visitedDate
 * @property {string} status
 * @property {number} helpfulCount
 * @property {number} reportCount
 * @property {*} createdAt
 * @property {*} updatedAt
 */

export { ReviewStatus };
