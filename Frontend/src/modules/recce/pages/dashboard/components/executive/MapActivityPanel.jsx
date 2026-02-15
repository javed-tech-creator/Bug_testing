import React from "react";

const MapActivityPanel = () => {
  return (
    <div className="border border-gray-300 rounded-xl bg-white p-4">
      <h2 className="text-2xl font-semibold mb-4">Map &amp; Activity Panel</h2>

      <div className="relative w-full h-[450px] rounded-lg overflow-hidden border border-gray-300">
        {/* MAP iframe */}
        <iframe
          title="google-map"
          width="100%"
          height="100%"
          loading="lazy"
          allowFullScreen
          className="rounded-lg"
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d14221.447410529829!2d80.946159!3d26.846708!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sin!4v1716275350000"
        ></iframe>

        {/* POPUP FLOATING CARD */}
        {/* <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white shadow-lg border border-gray-300 rounded-xl p-4 w-60">
          <p className="text-sm">
            <strong>Name:</strong> Xyz
          </p>
          <p className="text-sm">
            <strong>Add:</strong> Lucknow
          </p>
          <p className="text-sm">
            <strong>Recce status:</strong> Pending
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default MapActivityPanel;
