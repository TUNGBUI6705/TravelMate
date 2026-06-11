# Implementation Plan - Remove Category and Coordinates from Destinations

This plan outlines the removal of the `category` and `coordinates` (latitude/longitude) properties from the "Destination" (Place) model and UI. The application will transition to using only "Interest" (based on `categoryTags`) for classification and search-by-name for maps.

## Proposed Changes

### Data Models & Services

#### [adminData.ts](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/data/adminData.ts)
- Remove `category` from the `AdminPlace` interface.

#### [placeService.js](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/data/services/placeService.js)
- Remove `category` from `normalizePlaceRecord`.
- Ensure other functions (like `filterByType` if still needed, or remove it) are updated.

---

### UI Components

#### [PlaceList.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/PlaceList.tsx)
- Remove the `category` state.
- Remove the "Tất cả phân loại" dropdown filter.
- Update `filteredPlaces` to remove the category filtering logic.
- Remove the "Category" column from the table header and rows.
- Simplify logic that uses `place.category || place.type`.

#### [PlaceFormModal.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/components/PlaceFormModal.tsx)
- Remove `category` and `coordinates` from the `formData` state.
- Remove the "Phân loại chính" input field.
- Remove the "Vĩ độ (Lat)" and "Kinh độ (Lng)" input fields.
- Update the `handleChange` function to remove logic for nested property updates (since `coordinates` is gone).

#### [PlaceDetails.jsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/PlaceDetails.jsx)
- Remove the category badge/text.
- Remove the "Location" section that displays a map and "Directions" button using `coordinates`.

#### [Dashboard.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/Dashboard.tsx)
- Update `destinationStats` to use `categoryTags` instead of `category`.
- Update the "Destination Types" chart label to "Interest Types".

---

## Verification Plan

### Automated Tests
- Not applicable as there are no existing unit tests for these components.

### Manual Verification
1. **Destination Management Page**:
   - Verify that the "Category" column is gone.
   - Verify that the "Category" filter dropdown is gone.
   - Verify that filtering by "Interest" still works.
2. **Add/Edit Destination Modal**:
   - Verify that "Phân loại chính", "Vĩ độ", and "Kinh độ" fields are removed.
   - Verify that adding a new destination still works correctly without these fields.
   - Verify that editing an existing destination still works and doesn't break when saving.
3. **Destination Details Page**:
   - Verify that the category information is gone.
   - Verify that the map and directions section is gone.
4. **Dashboard**:
   - Verify that the "Destination Types" chart now shows "Interest Types" and counts tags correctly.
5. **General**:
   - Check the browser console for any errors related to undefined properties.
