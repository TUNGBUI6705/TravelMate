import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../config/firebase.js";

/**
 * @typedef {Object} DashboardStats
 * @property {number} totalUsers
 * @property {number} totalPlaces
 * @property {number} pendingReviews
 * @property {number} blockedUsers
 */

export const dashboardService = {
  async getStats() {
    const usersCollection = collection(db, "users");
    const placesCollection = collection(db, "places");
    const reviewsCollection = collection(db, "reviews");

    const blockedUsersQuery = query(usersCollection, where("status", "==", "banned"));
    const pendingReviewsQuery = query(reviewsCollection, where("status", "==", "pending"));

    const [usersCount, placesCount, pendingReviewsCount, blockedUsersCount] = await Promise.all([
      getCountFromServer(usersCollection),
      getCountFromServer(placesCollection),
      getCountFromServer(pendingReviewsQuery),
      getCountFromServer(blockedUsersQuery),
    ]);

    return {
      totalUsers: usersCount.data().count,
      totalPlaces: placesCount.data().count,
      pendingReviews: pendingReviewsCount.data().count,
      blockedUsers: blockedUsersCount.data().count,
    };
  },
};
