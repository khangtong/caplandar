import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
