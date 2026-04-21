import { collection, getCountFromServer, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";

export interface DashboardStats {
  totalUsers: number;
  totalPlaces: number;
  pendingReviews: number;
  blockedUsers: number;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
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

