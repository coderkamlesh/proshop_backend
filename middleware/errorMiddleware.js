// const notFound = (req, res, next) => {
//   const error = new Error(`Not Found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };

const notFound = (req, res, next) => {
  next(new Error(`Not Found - ${req.originalUrl}`));
};

// const errorHandler = (err, req, res, next) => {
//   let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
//   let message = err.message;

//   //Check for mongoose bad ObjectId
//   if (err.name === "CastError" && err.kind === "ObjectId") {
//     message = "Resource not found. Invalid ID";
//     statusCode = 404;
//   }
//   res.status(statusCode);
//   res.json({
//     message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };

const errorHandler = (err, req, res, next) => {
  let statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message;

  // Mongoose bad ObjectId
  if (err.name === "CastError" && err.kind === "ObjectId") {
    message = "Resource not found. Invalid ID";
    statusCode = 404;
  }

  if (!res.headersSent) {
    res.status(statusCode).json({
      message,
      stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
  }
};

export { notFound, errorHandler };
