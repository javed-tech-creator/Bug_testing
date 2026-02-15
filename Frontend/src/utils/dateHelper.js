// src/utils/dateHelpers.js

// ✅ Date ko fix karne ka helper
export const formatDate = (dateString) => {
  if (!dateString) return null;

  try {
    return new Date(dateString).toLocaleDateString("en-CA"); // YYYY-MM-DD format
  } catch (error) {
    console.error("Invalid date passed to formatDate:", dateString);
    return null;
  }
};
