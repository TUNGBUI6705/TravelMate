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

vi.mock("../../config/firebase", () => firebaseConfigMock);
vi.mock("firebase/firestore", () => firestoreMock);

import { placeService } from "./placeService";

describe("placeService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    firestoreMock.collection.mockReturnValue("places-collection");
    firestoreMock.doc.mockImplementation((_db: unknown, _collection: string, id: string) => `places-doc-${id}`);
    firestoreMock.query.mockImplementation((...parts: unknown[]) => ({ parts }));
    firestoreMock.where.mockImplementation((field: string, operator: string, value: string) => ({
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

  it("getById returns null when document does not exist", async () => {
    firestoreMock.getDoc.mockResolvedValue({
      exists: () => false,
    });

    const result = await placeService.getById("missing");

    expect(result).toBeNull();
  });

  it("add with explicit id stores data using setDoc", async () => {
    firestoreMock.setDoc.mockResolvedValue(undefined);

    const result = await placeService.add({
      id: "place_001",
      name: "Ho Xuan Huong",
      province: "Lam Dong",
      city: "Da Lat",
      type: "ho",
      description: "desc",
      address: "address",
      location: { lat: 11.9, lng: 108.4 },
      googleMapsUrl: null,
      googlePlaceId: null,
      googleRating: null,
      googleTotalRatings: null,
      mapProvider: "manual",
      osmNodeId: null,
      images: [],
      coverImage: "",
      tags: [],
      openingHours: "all day",
      entryFee: 0,
      stats: { avgRating: 0, totalReviews: 0, totalVisits: 0 },
      createdBy: "admin_001",
    });

    expect(result).toBe("place_001");
    expect(firestoreMock.setDoc).toHaveBeenCalledWith("places-doc-place_001", expect.any(Object));
  });

  it("add without id stores data using addDoc and returns generated id", async () => {
    firestoreMock.addDoc.mockResolvedValue({
      id: "generated-id",
    });

    const result = await placeService.add({
      name: "My Khe",
      province: "Da Nang",
      city: "Da Nang",
      type: "bien",
      description: "desc",
      address: "address",
      location: { lat: 16.0, lng: 108.2 },
      googleMapsUrl: null,
      googlePlaceId: null,
      googleRating: null,
      googleTotalRatings: null,
      mapProvider: "manual",
      osmNodeId: null,
      images: [],
      coverImage: "",
      tags: [],
      openingHours: "all day",
      entryFee: 0,
      stats: { avgRating: 0, totalReviews: 0, totalVisits: 0 },
      createdBy: "admin_001",
    });

    expect(result).toBe("generated-id");
    expect(firestoreMock.addDoc).toHaveBeenCalledTimes(1);
  });

  it("update patches place and refreshes updatedAt", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "p1",
      exists: () => true,
      data: () => ({
        name: "Updated Place",
        province: "Lam Dong",
      }),
    });

    const result = await placeService.update("p1", { name: "Updated Place" });

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("places-doc-p1", {
      name: "Updated Place",
      updatedAt: "mock-ts",
    });
    expect(result?.name).toBe("Updated Place");
  });

  it("delete removes place document", async () => {
    firestoreMock.deleteDoc.mockResolvedValue(undefined);

    await placeService.delete("p1");

    expect(firestoreMock.deleteDoc).toHaveBeenCalledWith("places-doc-p1");
  });

  it("hide changes status to hidden", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "p1",
      exists: () => true,
      data: () => ({
        name: "Place A",
        status: "hidden",
      }),
    });

    const result = await placeService.hide("p1");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("places-doc-p1", {
      status: "hidden",
      updatedAt: "mock-ts",
    });
    expect(result?.status).toBe("hidden");
  });

  it("show changes status to active", async () => {
    firestoreMock.updateDoc.mockResolvedValue(undefined);
    firestoreMock.getDoc.mockResolvedValue({
      id: "p1",
      exists: () => true,
      data: () => ({
        name: "Place A",
        status: "active",
      }),
    });

    const result = await placeService.show("p1");

    expect(firestoreMock.updateDoc).toHaveBeenCalledWith("places-doc-p1", {
      status: "active",
      updatedAt: "mock-ts",
    });
    expect(result?.status).toBe("active");
  });

  it("filterByType returns only requested type", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "p1",
          data: () => ({ name: "My Khe", type: "bien", province: "Da Nang" }),
        },
      ],
    });

    const result = await placeService.filterByType("bien");

    expect(firestoreMock.where).toHaveBeenCalledWith("type", "==", "bien");
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe("bien");
  });

  it("search matches by name or province", async () => {
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

    const result = await placeService.search("lam dong");

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p1");
  });

  it("search with empty keyword returns all places", async () => {
    firestoreMock.getDocs.mockResolvedValue({
      docs: [
        {
          id: "p1",
          data: () => ({ name: "A", province: "X" }),
        },
        {
          id: "p2",
          data: () => ({ name: "B", province: "Y" }),
        },
      ],
    });

    const result = await placeService.search(" ");

    expect(result).toHaveLength(2);
  });

  it("fetchGooglePlaceInfo returns mapped google fields", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "OK",
        result: {
          rating: 4.8,
          user_ratings_total: 1234,
          url: "https://maps.google.com/test",
          photos: [{ photo_reference: "photo_ref_1" }],
        },
      }),
    });

    const result = await placeService.fetchGooglePlaceInfo("place_google_1", "test-key");

    expect(result.googleRating).toBe(4.8);
    expect(result.googleTotalRatings).toBe(1234);
    expect(result.googleMapsUrl).toBe("https://maps.google.com/test");
    expect(result.photos[0]).toContain("photoreference=photo_ref_1");
  });

  it("fetchGooglePlaceInfo throws when api key is missing", async () => {
    await expect(placeService.fetchGooglePlaceInfo("place_google_1", "")).rejects.toThrow(
      "Google Maps API key is not configured",
    );
  });

  it("fetchGooglePlaceInfo throws when network response is not ok", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    await expect(placeService.fetchGooglePlaceInfo("place_google_1", "test-key")).rejects.toThrow(
      "Google Places request failed with status 500",
    );
  });

  it("fetchGooglePlaceInfo throws when google status is not OK", async () => {
    const fetchMock = globalThis.fetch as unknown as ReturnType<typeof vi.fn>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        status: "REQUEST_DENIED",
        error_message: "invalid key",
      }),
    });

    await expect(placeService.fetchGooglePlaceInfo("place_google_1", "test-key")).rejects.toThrow("invalid key");
  });
});

