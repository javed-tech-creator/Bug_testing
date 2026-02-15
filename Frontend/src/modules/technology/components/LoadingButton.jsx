// // src/components/LoadingButton.jsx
// import React from "react";

// const Spinner = ({ size = 16, thickness = 2 }) => (
//   <span
//     className="inline-block animate-spin rounded-full border-white border-t-transparent mr-2"
//     style={{
//       width: size,
//       height: size,
//       borderWidth: thickness,
//     }}
//   />
// );

// const LoadingButton = ({ isLoading, children, loadingText = "Submitting...", ...props }) => {
//   return (
//     <button
//       {...props}   // sabse pehle spread karo
//       disabled={isLoading || props.disabled} // aur baad me override karo
//       className={`${
//         isLoading || props.disabled
//           ? "cursor-not-allowed bg-gray-400"
//           : "cursor-pointer bg-orange-500 hover:bg-orange-600"
//       } px-4 py-2 text-sm rounded-sm text-white flex items-center justify-center min-w-28`}
//     >
//       {isLoading ? (
//         <>
//           <Spinner /> {loadingText}
//         </>
//       ) : (
//         children
//       )}
//     </button>
//   );
// };

// export default LoadingButton;
