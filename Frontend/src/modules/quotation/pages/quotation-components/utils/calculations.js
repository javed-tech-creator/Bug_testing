/**
 * Calculate size and amount for board products
 */
// export const calculateSizeAndAmount = (row) => {
//   const lengthFt = Number(row.lengthFt || 0);
//   const heightFt = Number(row.heightFt || 0);
//   const size = lengthFt * heightFt;
//   const quantity = Number(row.quantity || 0);
//   const rate = Number(row.rate || 0);
//   const amount = size * quantity * rate;

//   return {
//     size: size.toFixed(2),
//     amount: amount.toFixed(2),
//   };
// };

/**
 * Calculate size and amount for letter products
 */
// export const calculateLetterSizeAndAmount = (row) => {
//   const length = Number(row.length || 0);
//   const height = Number(row.height || 0);
//   const size = length * height;
//   const quantity = Number(row.quantity || 0);
//   const rate = Number(row.rate || 0);
//   const amount = size * quantity * rate;

//   return {
//     size: size.toFixed(2),
//     amount: amount.toFixed(2),
//   };
// };

/**
 * Generate unique ID
 */
export const uniqueId = () => Date.now() + Math.random();
