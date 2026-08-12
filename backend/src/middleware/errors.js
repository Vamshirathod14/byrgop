export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, next) {
  let status = err.status || 500;
  if (err.name === 'ValidationError') status = 400;
  else if (err.name === 'CastError') status = 400;
  else if (err.name === 'MongoServerError' && err.code === 11000) status = 409;
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: err.message || 'Internal server error' });
}
