const AppError = require('./../utils/appError');

// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);
//   const message = `Duplicate field value: ${value}. please use another value!`;
//   return new AppError(message, 400);
// }
// const handleValidationErrorDB = err => {
//   const errors = Object.values(err.errors).map(el => el.message);
//   const message = `Invalid input data. ${errors.join('. ')}`;
//   return new AppError(message, 400)
// };

// const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

// const handleJWTExpiredError = () => new AppError('Your token has ecpired. Please log in again!', 401);

// const sendErrorDev = (err, req, res) => {
//   // (A) API
//   if (req.originalUrl.startsWith('/api')) {
//     return res.status(err.statusCode).json({
//       status: err.status,
//       error: err,
//       message: err.message,
//       stack: err.stack
//     });

//   }
//   // (B) Rendered website
//   console.error('ERROR', err);
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong!',
//     msg: err.message
//   });

// };

// const sendErrorProd = (err, req, res) => {
//   // (A) API
//   if (req.originalUrl.startsWith('/api')) {
//     // (A) operational, trusted error: send message to client

//     if (err.isOperational) {
//       return res.status(err.statusCode).json({
//         status: err.status,
//         message: err.message
//       });

//     }

//     // (B) Programming or other unknown error: don't leak error details to client
//     // (1)log error
//     console.error('ERROR', err);

//     //(2) send generic message
//     return res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong'
//     });

//   }

//   // (B) Rendered website
//   // (A) operational, trusted error: send message to client

//   if (err.isOperational) {
//     return res.status(err.statusCode).render('error', {
//       title: 'Something went wrong!',
//       msg: err.message
//     });

//   }

//   // (B) Programming or other unknown error: don't leak error details to client
//   // (1)log error
//   console.error('ERROR', err);

//   //(2) send generic message
//   return res.status(err.statusCode).render('error', {
//     title: 'Something went wrong!',
//     msg: 'Please try again later.'
//   });

// };


// module.exports = (err, req, res, next) => {
const globalErrorHandler = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    const sendErrorDev = (err, req, res) => {
      // (A) API
      if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
          status: err.status,
          error: err,
          message: err.message,
          stack: err.stack
        });

      }
      // (B) Rendered website
      console.error('ERROR', err);
      return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message
      });

    };

    sendErrorDev(err, req, res);

  };

  let error = { ...err };
  error.message = err.message;

  if (error.name === 'CastError') {
    const handleCastErrorDB = err => {
      const message = `Invalid ${err.path}: ${err.value}.`;
      return new AppError(message, 400);
    };
    error = handleCastErrorDB(error);
  };

  if (error.code === 11000) {
    const handleDuplicateFieldsDB = err => {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      console.log(value);
      const message = `Duplicate field value: ${value}. please use another value!`;
      return new AppError(message, 400);
    };
    error = handleDuplicateFieldsDB(error);
  };

  if (error.name === 'ValidationError') {
    const handleValidationErrorDB = err => {
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return new AppError(message, 400)
    };

    error = handleValidationErrorDB(error);
  };

  if (error.name === 'JsonWebTokenError') {
    const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

    error = handleJWTError();
  };

  if (error.name === 'TokenExpiredError') {
    const handleJWTExpiredError = () => new AppError('Your token has expired. Please log in again!', 401);

    error = handleJWTExpiredError();
  };

  // (B) Rendered website
  // (A) operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });

  }
  //  (B) Programming or other unknown error: don't leak error details to client
  // (1)log error
  console.error('ERROR', err);

  //(2) send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });

};



// const handleCastErrorDB = (err) => {
//   const message = `Invalid ${err.path}: ${err.value}.`;
//   return new AppError(message, 400);
// };

// const handleDuplicateFieldsDB = (err) => {
//   const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//   console.log(value);
//   const message = `Duplicate field value: ${value}. please use another value!`;
//   return new AppError(message, 400);
// }

// const sendErrorDev = (err, res, next) => {
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack
//   });
// };

// const sendErrorProd = (err, res) => {
//   //operational, trusted error: send message to client

//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     });

//     //Programming or other unknown error: don't leak error details to client
//   } else {
//     // (1)log error
//     console.error('ERROR', err);

//     //(2) send generic message
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong'
//     });

//   }

// };



// const globalErrorHandler = (err, req, res, next) => {
//   // console.log(err.stack);

//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';

//   if (process.env.NODE_ENV === 'development') {
//     const sendErrorDev = (err, res) => {

//       res.status(err.statusCode).json({
//         status: err.status,
//         error: err,
//         message: err.message,
//         stack: err.stack
//       });
//     };
//     sendErrorDev(err, res);
//   }

//   if (err.name === 'CastError') {
//     const handleCastErrorDB = err => {
//       const message = `Invalid ${err.path}: ${err.value}.`;
//       return new AppError(message, 400);
//     };
//     err = handleCastErrorDB(err);
//   };

//   if (err.code === 11000) {
//     const handleDuplicateFieldsDB = err => {
//       const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
//       console.log(value);
//       const message = `Duplicate field value: ${value}. please use another value!`;
//       return new AppError(message, 400);
//     }
//     err = handleDuplicateFieldsDB(err);
//   };

//   if (err.name === 'ValidationError') {
//     const handleValidationErrorDB = err => {
//       const errors = Object.values(err.errors).map(el => el.message);
//       const message = `Invalid input data. ${errors.join('. ')}`;
//       return new AppError(message, 400);
//     }

//     err = handleValidationErrorDB(err);
//   };

//   //Protecting tour routes - part-2 error handling
//   if (err.name === 'JsonWebTokenError') {
//     const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

//     err = handleJWTError();
//   };

//   if (err.name === 'TokenExpiredError') {
//     const handleJWTExpiredError = () => new AppError('Your token has ecpired. Please log in again!', 401);

//     err = handleJWTExpiredError();
//   };

//   if (err.isOperational) {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message
//     });

//     //Programming or other unknown error: don't leak error details to client
//   } else {
//     // (1)log error
//     console.error('ERROR', err);

//     //(2) send generic message
//     res.status(500).json({
//       status: 'error',
//       message: 'Something went very wrong'
//     });

//   }


/*   module.exports = (err, req, res, next) => {
 
 err.statusCode = err.statusCode || 500;
 err.status = err.status || 'error';
 
 if (process.env.NODE_ENV === 'development') {
 
   sendErrorDev(err, res);
 
 } else if (process.env.NODE_ENV === 'production') {
 
   let error = { ...err };
 
   if (error.name === 'CastError') error = handleCastErrorDB(error);
   if (error.code === 11000) error = handleDuplicateFieldsDB(error);
 
   sendErrorProd(error, res);
 }    */

// };
module.exports = globalErrorHandler;