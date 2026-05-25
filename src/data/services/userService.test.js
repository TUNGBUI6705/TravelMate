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

import { userService } from "./userService.js";

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("users-collection");
    firestoreMock.doc.mockImplementation((_db, _collection, id) => `users-doc-${id}`);
    firestoreMock.orderBy.mockReturnValue("created-at-desc");
    firestoreMock.query.mockImplementation((...parts) => ({ parts }));
    firestoreMock.where.mockImplementation((field, operator, value) => ({
      field,
      operator,
      value,
    }));
    firestoreMock.serverTimestamp.mockReturnValue("mock-ts");
  });

  it("getAll returns all users ordered by createdAt desc", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "u1",
          data: () => ({ uid: "u1", email: "alpha@example.com", displayName: "Alpha" }),
        },
        {
          id: "u2",
          data: () => ({ uid: "u2", email: "beta@example.com", displayName: "Beta" }),
        },
      ],
    });

    const result = await userService.getAll();

    expect(firestoreMock.orderBy).toHaveBeenCalledWith("createdAt", "desc");
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("u1");
  });

  it("ban updates user status to banned", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "u1",
      exists: () => true,
      data: () => ({ status: "banned", displayName: "Test User" }),
    });

    const result = await userService.ban("u1", "Inappropriate content");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("users-doc-u1", {
      status: "banned",
      bannedReason: "Inappropriate content",
      bannedAt: "mock-ts",
    });
    expect(result?.status).toBe("banned");
  });
});
