export function dbSelectorMiddleware(req, res, next) {
  const headerDbType = req.headers['x-database-type'];
  const queryDbType = req.query.dbType;
  const bodyDbType = req.body && req.body.dbType;

  const dbType = (headerDbType || queryDbType || bodyDbType || 'postgresql').toLowerCase();
  
  // Validate allowed database types (PostgreSQL and MongoDB only)
  if (!['postgresql', 'postgres', 'mongodb', 'mongo'].includes(dbType)) {
    req.dbType = 'postgresql';
  } else {
    req.dbType = dbType;
  }

  next();
}
