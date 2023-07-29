/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-sequences */
import React, { createContext, useContext, useMemo, useState } from 'react';
import get from 'loadsh/get';

export const AppContext = createContext();
const CMSContext = createContext({
  cmsContent: {},
});

export const getCmsContent = (path = '') => {
  const { cmsContent } = useContext(CMSContext);

  if (path === '') return cmsContent;

  const output = get(cmsContent, path);

  if (!output) {
    throw new Error(
      `Não foi possível identificar a chave: ${path}. Verifique a query e tente novamente!`,
    );
  }

  return output;
};

export default function CMSProvider({ cmsContent, children }) {
  const content = useMemo(() => ({ cmsContent }), []);
  const [viewProjects, setViewProjects] = useState(false);

  return (
    <CMSContext.Provider value={content}>
      <AppContext.Provider value={{ viewProjects, setViewProjects }}>
        {children}
      </AppContext.Provider>
    </CMSContext.Provider>
  );
}
