import { createContext, useContext, type ReactNode } from 'react';
import type { AboutPageData } from '@/types/about-page.types';
import { DEFAULT_ABOUT_PAGE_DATA } from '@/lib/about-page-data';

const AboutPageContext = createContext<AboutPageData>(DEFAULT_ABOUT_PAGE_DATA);

export function AboutPageProvider({
  value,
  children,
}: {
  value: AboutPageData;
  children: ReactNode;
}) {
  return <AboutPageContext.Provider value={value}>{children}</AboutPageContext.Provider>;
}

export function useAboutPage(): AboutPageData {
  return useContext(AboutPageContext);
}
