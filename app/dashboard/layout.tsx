
import { DashboardNav } from '@/components/dashboard-nav';
import { NavHeader } from '@/components/nav-header';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    
    <div className="min-h-screen">
      
      <NavHeader />
      <div className="flex">
        <DashboardNav />
  
        <main className="flex-1 p-8 bg-muted/10">{children}</main>
       
      </div>
    </div>
    
  );
}