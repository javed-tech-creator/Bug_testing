// utils/dateUtils.js
/**
 * Calculates number of days between today and a given date
 * @param {string|Date} endDateValue
 * @returns {number} diffDays - positive if future, negative if past
 */
export const calculateDaysLeft = (endDateValue) => {
  const endDate = new Date(endDateValue);
  const today = new Date();

  // Reset hours for exact day difference
  endDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = endDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Returns status and days left
 */
export const getWarrantyStatus = (endDateValue) => {
  const diffDays = calculateDaysLeft(endDateValue);
  if (diffDays < 0) return { status: "Expired", diffDays };
  return { status: `${diffDays} days left`, diffDays };
};
