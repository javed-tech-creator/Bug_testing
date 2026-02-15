

import React from "react";

const dummyMockup = {
  before_image: "https://picsum.photos/900/500?random=10",
  after_image: "https://picsum.photos/900/500?random=20",
};

const BeforeAfterMockup = () => {
  // API commented out. Using dummy data only.
  const mockup = dummyMockup;

  return (
    <div className="relative border rounded-lg overflow-hidden h-80">
      {/* AFTER */}
      <img
        src={mockup.after_image}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* BEFORE */}
      <div className="absolute inset-0 w-1/2 overflow-hidden">
        <img
          src={mockup.before_image}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-white shadow" />

      <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        Before
      </span>
      <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        After
      </span>
    </div>
  );
};

export default BeforeAfterMockup;
