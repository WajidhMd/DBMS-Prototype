export function dbSelectorMiddleware(req, res, next) {
  const headerDbType = req.headers['x-database-type'];
  const queryDbType = req.query.dbType;
  const bodyDbType = req.body && req.body.dbType;

  const dbType = (headerDbType || queryDbType || bodyDbType || 'mysql').toLowerCase();
  
  // Validate allowed database types
  if (!['mysql', 'postgresql', 'postgres', 'mongodb', 'mongo'].includes(dbType)) {
    req.dbType = 'mysql';
  } else {
    req.dbType = dbType;
  }

  next();
}
