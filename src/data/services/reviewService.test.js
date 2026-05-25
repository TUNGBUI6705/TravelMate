import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseConfigMock = vi.hoisted(() => ({
  db: {},
}));

const firestoreMock = vi.hoisted(() => ({
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}));

vi.mock("../../config/firebase.js", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { reviewService } from "./reviewService.js";

describe("reviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("reviews-collection");
    firestoreMock.doc.mockImplementation((_db, _collection, id) => `reviews-doc-${id}`);
    firestoreMock.orderBy.mockReturnValue("created-at-desc");
    firestoreMock.query.mockImplementation((...parts) => ({ parts }));
    firestoreMock.where.mockImplementation((field, operator, value) => ({
      field,
      operator,
      value,
    }));
    firestoreMock.serverTimestamp.mockReturnValue("mock-ts");
  });

  it("getAll returns reviews ordered by createdAt desc", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r1",
          data: () => ({ placeName: "Hoi An", authorName: "Alice" }),
        },
      ],
    });

    const result = await reviewService.getAll();

    expect(firestoreMock.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r1");
  });

  it("approve sets status to visible and updates updatedAt", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "r1",
      exists: () => true,
      data: () => ({ status: "visible", placeName: "My Khe" }),
    });

    const result = await reviewService.approve("r1");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("reviews-doc-r1", {
      status: "visible",
      updatedAt: "mock-ts",
    });
    expect(result?.status).toBe("visible");
  });
});
