    /**
 * TEMPLATE FOR APPLYING SCROLL-TO-TOP FIX TO OTHER MODULE LAYOUTS
 * 
 * Copy this pattern to update other module layouts like:
 * - VendorLayout.jsx
 * - SalesLayout.jsx  
 * - CustomerLayout.jsx
 * - And other nested route layouts
 */

import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
// ... other imports ...

const ModuleLayout = () => {
  // Create a ref to the scrollable container
  const mainContentRef = useRef(null);
  const { pathname } = useLocation();

  // Scroll to top whenever the route changes
  useEffect(() => {
    // Scroll the main content area to top
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
    // Also scroll window (for fixed layouts)
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header or other fixed components */}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar or navigation */}
        
        {/* Main scrollable content area - ADD ref={mainContentRef} HERE */}
        <main 
          ref={mainContentRef}
          className="flex-1 overflow-y-auto bg-gray-50"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ModuleLayout;

/**
 * CHECKLIST FOR APPLYING TO OTHER LAYOUTS:
 * 
 * 1. ✅ Import useEffect, useRef from "react"
 * 2. ✅ Import Outlet, useLocation from "react-router-dom"
 * 3. ✅ Create const mainContentRef = useRef(null)
 * 4. ✅ Get pathname from useLocation()
 * 5. ✅ Add useEffect hook that runs on pathname change
 * 6. ✅ Scroll both mainContentRef AND window
 * 7. ✅ Add ref={mainContentRef} to your scrollable <main> or <div>
 * 
 * Module Layouts That Need This Fix:
 * - [ ] VendorLayout.jsx
 * - [ ] SalesLayout.jsx
 * - [ ] CustomerLayout.jsx
 * - [ ] financeLayout.jsx
 * - [ ] TechLayout.jsx
 * - [ ] HrLayout.jsx
 * - [ ] ProjectLayout.jsx
 * - [ ] QuatationLayout.jsx
 * - [ ] accountLayout.jsx
 */
