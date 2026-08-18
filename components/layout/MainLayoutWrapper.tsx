'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import BreakingTicker from './BreakingTicker';
import Footer from './Footer';
import SplashLoader from '@/components/ui/SplashLoader';
import TajSamacharDrawer from '@/components/ui/TajSamacharDrawer';

interface Props {
  children: React.ReactNode;
}

export default function MainLayoutWrapper({ children }: Props) {
  const pathname = usePathname();

  // Admin and login pages manage their own layout — skip all frontend chrome
  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  // News brief has a minimal wrapper
  if (pathname === '/news-brief') {
    return <main className="min-h-screen bg-[#F8F9FA]">{children}</main>;
  }

  return (
    <>
      {pathname === '/' && <SplashLoader />}
      <Header />
      <BreakingTicker />
      <main>{children}</main>
      <Footer />
      <TajSamacharDrawer />
    </>
  );
}
