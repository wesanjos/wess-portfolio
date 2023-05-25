import React, { createContext, useContext, useMemo } from 'react';
import get from 'loadsh/get';

const CMSContext = createContext({
  cmsContent: {},
});

export const getCmsContent = (path = '') => {
  const { cmsContent } = useContext(CMSContext);

  if (path === '') return cmsContent;

  const output = get(cmsContent, path);

  if (!output)
    throw new Error(
      `Não foi possível identificar a chave: ${path}. Verifique a query e tente novamente!`,
    );

  return output;
};

export default function CMSProvider({ cmsContent, children }) {
  const content = useMemo(() => ({ cmsContent }), []);

  return <CMSContext.Provider value={content}>{children}</CMSContext.Provider>;
}
