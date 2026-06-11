# Walkthrough - Remove Category and Coordinates from Destinations

I have successfully removed the `category` and `coordinates` (latitude/longitude) properties from the Destination management system. The application now focuses on "Interest" (Tags) for classification and uses name-based searches for maps.

## Changes Made

### Data & Services
- **[adminData.ts](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/data/adminData.ts)**: Removed `category` from `AdminPlace` interface.
- **[placeService.js](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/data/services/placeService.js)**: Removed `category` normalization in `normalizePlaceRecord`.

### UI Components
- **[PlaceList.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/PlaceList.tsx)**:
    - Removed the "Category" filter dropdown.
    - Removed the "Category" column from the table.
    - Updated map logic to search by name/location instead of coordinates.
- **[PlaceFormModal.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/components/PlaceFormModal.tsx)**:
    - Removed "Phân loại chính" (Category) input.
    - Removed "Vĩ độ" and "Kinh độ" (Coordinates) inputs.
    - Simplified form state and change handlers.
- **[PlaceDetails.jsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/PlaceDetails.jsx)**:
    - Removed category badges.
    - Removed the interactive map (iframe) and coordinate-based directions.
    - Added a "View on Google Maps" button that searches by place name.
- **[Dashboard.tsx](file:///C:/Users/PC/Documents/GitHub/TravelMate/src/app/pages/Dashboard.tsx)**:
    - Updated "Destination Types" chart to "Interest Types".
    - The chart now aggregates counts from `categoryTags` instead of the single `category` field.

## Verification Summary

### Manual Verification Results
- **Destination Management**: The UI is cleaner, with "Category" related elements removed. Filtering by "Interest" (Tags) remains fully functional.
- **Add/Edit Flow**: Creating and editing destinations works correctly without needing to provide category or coordinates.
- **Details View**: Map section now provides a direct link to Google Maps based on the place name, ensuring users can still find directions.
- **Dashboard**: The chart correctly reflects the distribution of interest tags across all destinations.

> [!NOTE]
> Existing data in Firebase that still has `category` or `coordinates` fields will not break the UI, as the code now gracefully ignores these properties.
