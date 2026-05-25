import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseConfigMock = vi.hoisted(() => ({
  db: {},
}));

const firestoreMock = vi.hoisted(() => ({
  collection: vi.fn(),
  getCountFromServer: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
}));

vi.mock("../../config/firebase.js", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { dashboardService } from "./dashboardService.js";

describe("dashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockImplementation((_db, name) => `${name}-collection`);
    firestoreMock.where.mockImplementation((field, operator, value) => ({
      field,
      operator,
      value,
    }));
    firestoreMock.query.mockImplementation((...parts) => ({ parts }));
  });

  it("getStats returns aggregated numbers for dashboard cards", async () => {
    firestoreMock.getCountFromServer
      .mockResolvedValueOnce({ data: () => ({ count: 21 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 13 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 5 }) })
      .mockResolvedValueOnce({ data: () => ({ count: 4 }) });

    const result = await dashboardService.getStats();

    expect(result).toEqual({
      totalUsers: 21,
      totalPlaces: 13,
      pendingReviews: 5,
      blockedUsers: 4,
    });
    expect(firestoreMock.where).toHaveBeenCalledWith("status", "==", "pending");
    expect(firestoreMock.where).toHaveBeenCalledWith("status", "==", "banned");
  });
});
