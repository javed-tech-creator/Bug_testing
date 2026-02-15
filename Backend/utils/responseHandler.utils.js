
const successResponse = (res, status = 200, message, data, error) => {
  res.status(status).send({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, status, message, data, error) => {
  // logger.error(typeof error === "Array" ? JSON.stringify(error) : message);
  res.status(status).send({
    success: false,
    message,
    data,
    error,
  });
};

export default {
  successResponse,
  errorResponse,
};