const DesignOptionCard = ({ data }) => {
  const detailFields = [
    { label: "Design Title", value: data.designTitle },
    { label: "Font Name", value: data.fontName },
    { label: "Colors Name", value: data.colorsName },
    { label: "Lit Colors Name", value: data.litColorsName },
  ];

  const sizeFields = [
    { label: "Width", value: data.size.width },
    { label: "Height", value: data.size.height },
    { label: "Depth", value: data.size.depth },
  ];

  return (
    <div className="bg-white border rounded-b-sm shadow-sm ">
      <div className="p-5 space-y-6">
        {/* OPTION TAG */}
        <span className="inline-block bg-gray-100 text-blue-600 px-3 py-1 rounded-sm text-sm font-medium">
          {data.optionLabel}
        </span>

        {/* DETAILS + IMAGES */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT DETAILS */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailFields.map((item, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-900 mb-1">
                  {item.label}
                </label>
                <input
                  value={item.value}
                  readOnly
                  className="w-full px-3 py-2 border rounded-sm text-gray-700 bg-gray-100"
                />
              </div>
            ))}
          </div>

          {/* RIGHT IMAGES */}
          <div className="grid grid-cols-2 lg:col-span-2 gap-4">
            {[
              { label: data.optionLabel, img: data.images.design },
              { label: "Supporting Assets", img: data.images.asset },
            ].map((img, index) => (
              <div
                key={index}
                className="relative border-2 border-green-500 rounded-sm p-2 overflow-hidden"
              >
                <img
                  src={img.img}
                  alt=""
                  className="w-full h-40 object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-green-600 text-white text-xs px-2 py-1 rounded">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SIZE SPECIFICATION */}
        <div >
          <h4 className="font-semibold text-gray-900 mb-4 pb-2 border-b-2 ">
            Size Specification
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sizeFields.map((item, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {item.label}
                </label>
                <input
                  value={item.value}
                  readOnly
                  className="w-full px-3 py-2 border rounded-sm text-gray-700 bg-gray-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="border-t-2 pt-4">
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Short Description
          </label>
          <textarea
            rows={1}
            readOnly
            value={data.description}
            className="w-full px-3 py-2 border rounded-sm text-gray-700 bg-gray-100 resize-none"
          />
        </div>
      </div>
    </div>
  );
};

export default DesignOptionCard;
