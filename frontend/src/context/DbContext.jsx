import React, { createContext, useContext, useState, useEffect } from 'react';

const DbContext = createContext();

export const DbProvider = ({ children }) => {
  const [targetDb, setTargetDbState] = useState(() => {
    return localStorage.getItem('targetDb') || 'mysql';
  });

  const setTargetDb = (db) => {
    const validDb = (db || 'mysql').toLowerCase();
    setTargetDbState(validDb);
    localStorage.setItem('targetDb', validDb);
  };

  return (
    <DbContext.Provider value={{ targetDb, setTargetDb }}>
      {children}
    </DbContext.Provider>
  );
};

export const useDb = () => useContext(DbContext);
