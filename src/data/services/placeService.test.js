import { beforeEach, describe, expect, it, vi } from "vitest";

const firebaseConfigMock = vi.hoisted(() => ({
  db: {},
}));

const firestoreMock = vi.hoisted(() => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  serverTimestamp: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  where: vi.fn(),
}));

vi.mock("../../config/firebase.js", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { placeService } from "./placeService.js";

describe("placeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("places-collection");
    firestoreMock.doc.mockImplementation((_db, _collection, id) => `places-doc-${id}`);
    firestoreMock.query.mockImplementation((...parts) => ({ parts }));
    firestoreMock.where.mockImplementation((field, operator, value) => ({
      field,
      operator,
      value,
    }));
    firestoreMock.serverTimestamp.mockReturnValue("mock-ts");
    vi.stubGlobal("fetch", vi.fn());
  });

  it("getAll returns all places", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "p1",
          data: () => ({ name: "Ho Xuan Huong", province: "Lam Dong" }),
        },
        {
          id: "p2",
          data: () => ({ name: "My Khe", province: "Da Nang" }),
        },
      ],
    });

    const result = await placeService.getAll();

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("p1");
  });

  it("hide sets status to hidden and updates updatedAt", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "p1",
      exists: () => true,
      data: () => ({ status: "hidden", name: "Ho Xuan Huong" }),
    });

    const result = await placeService.hide("p1");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("places-doc-p1", {
      status: "hidden",
      updatedAt: "mock-ts",
    });
    expect(result?.status).toBe("hidden");
  });
});
