export function adminAuth(req, res, next) {
  const key = process.env.ADMIN_KEY;
  if (!key) return next();
  const provided = req.headers['x-admin-key'];
  if (provided && provided === key) return next();
  res.status(401).json({ error: 'Unauthorized: invalid admin key' });
}
