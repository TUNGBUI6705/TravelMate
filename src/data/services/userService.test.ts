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

import { userService } from "./userService";

describe("userService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("users-collection");
    firestoreMock.doc.mockImplementation((_db: unknown, _collection: string, id: string) => `users-doc-${id}`);
    firestoreMock.orderBy.mockReturnValue("created-at-desc");
    firestoreMock.query.mockImplementation((...parts: unknown[]) => ({ parts }));
    firestoreMock.where.mockImplementation((field: string, operator: string, value: string) => ({
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
    expect(result[1].id).toBe("u2");
  });

  it("getById returns null when user is missing", async () => {
    firestoreMock.getDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await userService.getById("missing");

    expect(result).toBeNull();
    expect(firestoreMock.doc).toHaveBeenCalledWith(firebaseConfigMock.db, "users", "missing");
  });

  it("update patches user and returns latest data", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "u1",
      exists: () => true,
      data: () => ({
        uid: "u1",
        email: "updated@example.com",
        displayName: "Updated Name",
        status: "active",
      }),
    });

    const result = await userService.update("u1", { displayName: "Updated Name" });

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("users-doc-u1", { displayName: "Updated Name" });
    expect(result?.displayName).toBe("Updated Name");
  });

  it("ban sets user status to banned with reason and bannedAt", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "u2",
      exists: () => true,
      data: () => ({
        uid: "u2",
        email: "blocked@example.com",
        displayName: "Blocked",
        status: "banned",
        bannedReason: "spam",
      }),
    });

    const result = await userService.ban("u2", "spam");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("users-doc-u2", {
      status: "banned",
      bannedReason: "spam",
      bannedAt: "mock-ts",
    });
    expect(result?.status).toBe("banned");
  });

  it("unban sets user status back to active and clears ban fields", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "u2",
      exists: () => true,
      data: () => ({
        uid: "u2",
        email: "restored@example.com",
        displayName: "Restored",
        status: "active",
        bannedReason: null,
        bannedAt: null,
      }),
    });

    const result = await userService.unban("u2");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("users-doc-u2", {
      status: "active",
      bannedReason: null,
      bannedAt: null,
    });
    expect(result?.status).toBe("active");
  });

  it("delete removes user document", async () => {
    firestoreMock.deleteDoc.mockResolvedValue(undefined);

    await userService.delete("u9");

    expect(firestoreMock.deleteDoc).toHaveBeenCalledWith("users-doc-u9");
  });

  it("filterByStatus returns users with requested status", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "u4",
          data: () => ({ uid: "u4", email: "banned@example.com", displayName: "Banned", status: "banned" }),
        },
      ],
    });

    const result = await userService.filterByStatus("banned");

    expect(firestoreMock.where).toHaveBeenCalledWith("status", "==", "banned");
    expect(result).toHaveLength(1);
    expect(result[0].status).toBe("banned");
  });

  it("search matches displayName or email case-insensitively", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "u1",
          data: () => ({ uid: "u1", email: "alice@example.com", displayName: "Alice Nguyen" }),
        },
        {
          id: "u2",
          data: () => ({ uid: "u2", email: "bob@example.com", displayName: "Bob Tran" }),
        },
      ],
    });

    const result = await userService.search("ALICE");

    expect(result).toHaveLength(1);
    expect(result[0].email).toBe("alice@example.com");
  });

  it("search with empty keyword returns all users", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "u1",
          data: () => ({ uid: "u1", email: "a@example.com", displayName: "A" }),
        },
        {
          id: "u2",
          data: () => ({ uid: "u2", email: "b@example.com", displayName: "B" }),
        },
      ],
    });

    const result = await userService.search("   ");

    expect(result).toHaveLength(2);
  });
});
