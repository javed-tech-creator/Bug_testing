// const errorMiddleware = (err, req, res, next) => {

//     err.statusCode = err.statusCode || 500;
//     err.message = err.message;
  
//     return res.status(err.statusCode).json({
//       success: false,
//       message: err.message,
//       stack: err.stack,
//     });
//   };

const errorMiddleware=((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Something went wrong',
    statusCode,
  });
});
  
  export default errorMiddleware;