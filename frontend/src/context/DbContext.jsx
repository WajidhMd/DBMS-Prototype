import React, { createContext, useContext, useState, useEffect } from 'react';

const DbContext = createContext();

const ALLOWED_DATABASES = ['postgresql', 'mongodb'];
const DEFAULT_DATABASE = 'postgresql';

export const DbProvider = ({ children }) => {
  const [targetDb, setTargetDbState] = useState(() => {
    const stored = (localStorage.getItem('targetDb') || '').toLowerCase();
    if (ALLOWED_DATABASES.includes(stored)) {
      return stored;
    }
    localStorage.setItem('targetDb', DEFAULT_DATABASE);
    return DEFAULT_DATABASE;
  });

  const setTargetDb = (db) => {
    const candidate = (db || '').toLowerCase();
    const validDb = ALLOWED_DATABASES.includes(candidate) ? candidate : DEFAULT_DATABASE;
    setTargetDbState(validDb);
    localStorage.setItem('targetDb', validDb);
  };

  return (
    <DbContext.Provider value={{ targetDb, setTargetDb, allowedDatabases: ALLOWED_DATABASES }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => useContext(DbContext);
