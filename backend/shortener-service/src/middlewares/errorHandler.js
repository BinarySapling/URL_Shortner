// Central error handler — must have 4 args so Express recognises it as error middleware
export const errorHandler = (err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
  });
};
