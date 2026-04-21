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

vi.mock("../../config/firebase", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { reviewService } from "./reviewService";

describe("reviewService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("reviews-collection");
    firestoreMock.doc.mockImplementation((_db: unknown, _collection: string, id: string) => `reviews-doc-${id}`);
    firestoreMock.orderBy.mockReturnValue("created-at-desc");
    firestoreMock.query.mockImplementation((...parts: unknown[]) => ({ parts }));
    firestoreMock.where.mockImplementation((field: string, operator: string, value: string | number) => ({
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

  it("getPending returns pending reviews only", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r2",
          data: () => ({ placeName: "Da Lat", authorName: "Bob", status: "pending" }),
        },
      ],
    });

    const result = await reviewService.getPending();

    expect(firestoreMock.where).toHaveBeenCalledWith("status", "==", "pending");
    expect(result[0].status).toBe("pending");
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

  it("hide sets status to hidden and updates updatedAt", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "r1",
      exists: () => true,
      data: () => ({ status: "hidden", placeName: "My Khe" }),
    });

    const result = await reviewService.hide("r1");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("reviews-doc-r1", {
      status: "hidden",
      updatedAt: "mock-ts",
    });
    expect(result?.status).toBe("hidden");
  });

  it("delete removes review document", async () => {
    firestoreMock.deleteDoc.mockResolvedValue(undefined);

    await reviewService.delete("r5");

    expect(firestoreMock.deleteDoc).toHaveBeenCalledWith("reviews-doc-r5");
  });

  it("filterByStatus returns reviews by status", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r9",
          data: () => ({ status: "hidden", placeName: "Hoi An" }),
        },
      ],
    });

    const result = await reviewService.filterByStatus("hidden");

    expect(firestoreMock.where).toHaveBeenCalledWith("status", "==", "hidden");
    expect(result).toHaveLength(1);
  });

  it("filterByRating returns reviews with exact rating", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r3",
          data: () => ({ rating: 5, placeName: "Cuc Phuong" }),
        },
      ],
    });

    const result = await reviewService.filterByRating(5);

    expect(firestoreMock.where).toHaveBeenCalledWith("rating", "==", 5);
    expect(result[0].rating).toBe(5);
  });

  it("search matches placeName authorName or comment", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r1",
          data: () => ({ placeName: "Hoi An", authorName: "Alice", comment: "Great food" }),
        },
        {
          id: "r2",
          data: () => ({ placeName: "Da Lat", authorName: "Bob", comment: "Cold weather" }),
        },
      ],
    });

    const result = await reviewService.search("FOOD");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("r1");
  });

  it("search with empty keyword returns all reviews", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "r1",
          data: () => ({ placeName: "A", authorName: "A", comment: "A" }),
        },
        {
          id: "r2",
          data: () => ({ placeName: "B", authorName: "B", comment: "B" }),
        },
      ],
    });

    const result = await reviewService.search("   ");

    expect(result).toHaveLength(2);
  });
});

