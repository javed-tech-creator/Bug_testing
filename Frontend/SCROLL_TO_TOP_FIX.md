# Nested Routes Scroll-to-Top Solution

## Problem Identified
Your nested routes weren't scrolling to top because:
1. The scrollable container was a fixed-height `<main>` element with `overflow-y-auto`, not the window
2. The `ScrollToTop` component only watched `pathname` but didn't account for dynamic content rendering
3. No scroll handling was in the nested layout components

## Solution Implemented

### 1. **Enhanced ScrollToTop Component** (Updated)
- Now tracks `pathname`, `search`, and `hash` for complete location changes
- Uses immediate scroll + a scheduled timeout to handle render timing
- Works for window-level scrolling

**Location:** `src/components/ScrollToTop.jsx`

### 2. **RecceLayout Updated** (Main Fix)
- Added `useRef` to reference the scrollable main content container
- Added `useLocation` hook to detect route changes
- Scrolls both the container AND the window on pathname changes
- This is the KEY fix for your nested routes issue

**Location:** `src/modules/recce/layouts/RecceLayout.jsx`

### 3. **Reusable Hook Created** (Optional)
- New `useScrollToTop()` hook for any component that needs scroll functionality
- Can be used in individual pages if they have their own scrollable containers

**Location:** `src/hooks/useScrollToTop.js`

## How to Apply to Other Modules

For each nested module's layout file (VendorLayout, SalesLayout, etc.), add this pattern:

```jsx
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

const YourModuleLayout = () => {
  const mainContentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll the main content area to top
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
    // Also scroll window
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    // ... your JSX with ref={mainContentRef} on scrollable container
  );
};
```

## Files Modified
1. ✅ `src/components/ScrollToTop.jsx` - Enhanced to track all location changes
2. ✅ `src/modules/recce/layouts/RecceLayout.jsx` - Added scroll handling for nested routes
3. ✅ `src/hooks/useScrollToTop.js` - Created new reusable hook

## Testing
1. Navigate between `/recce/dashboard` and `/recce/total-recce`
2. Navigate between `/vendor/*` routes
3. Check that page scrolls to top each time

## Next Steps (Optional)
- Apply the same pattern to other module layouts:
  - `src/modules/vendor/layouts/VendorLayout.jsx`
  - `src/modules/sales/layouts/SalesLayout.jsx`
  - `src/modules/customer/layouts/CustomerLayout.jsx`
  - And other module layouts as needed

---

**Note:** The main fix is in RecceLayout because your nested routes use a fixed scrollable container. The ScrollToTop component works at the window level, but the container needed its own scroll handling.
