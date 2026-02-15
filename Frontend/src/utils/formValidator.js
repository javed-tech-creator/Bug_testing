 export const validatePhoneNumber = (phone)=>{
  const phoneStr = phone.toString().trim();
  const isValid = /^[6-9]\d{9}$/.test(phoneStr);
  return isValid ? null : "Invalid phone number. ";
}


