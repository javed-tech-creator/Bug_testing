// const responseHandler = require('./responseHandler.utils');

import responseHandler from './responseHandler.utils.js';

const tryCatchFn = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // console.log("in error ------------__>>>>>>>>>>>>>",error)
      const errorInfo = {
        message: error?.message,
        stack: error?.stack,
        // ...(error.response && { response: error.response }),
        // ...(error.request && { request: error.request }),
        // ...(error.config && { config: error.config }),
      };



      console.log("ERROR: ", error)
      return responseHandler.errorResponse(
        res,
        error.statusCode || 500,
        error.message || "SOMETHING_WRONG",
        { error: error.message }
      );

      next(error);
    }
  };
};

export default tryCatchFn;