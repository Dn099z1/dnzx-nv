'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Router from 'next/router';
import {
  Store,
  Info,
  Package,
  Wallet,
  Home,
  Gift,
  ArrowBigLeft,
  LogOut,
  GamepadIcon,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from './ui/button';




const navItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Loja',
    href: '/dashboard/store',
    icon: Store,
  },
  {
    title: 'Informações',
    href: '/dashboard/info',
    icon: Info,
  },
  {
    title: 'Inventário',
    href: '/dashboard/inventory',
    icon: Package,
  },
  {
    title: 'Voltar',
    href: '/',
    icon: ArrowBigLeft,
  },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter()
  const LogoutMax = () => {
    signOut({ callbackUrl: '/' });  // Redireciona para a página inicial após o logout
  };

  return (
    <div className="flex h-screen w-64 flex-col bg-card">
      <div className="flex items-center space-x-2 p-4">
      <Image
      className='left-9 relative'
      src="https://host-two-ochre.vercel.app/files/valley_sem_fundo.png"
      width={150}
      height={150}
      alt="Logo"
    />
        
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent',
              pathname === item.href ? 'bg-accent' : 'transparent'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4">
        <Button
        onClick={LogoutMax}
          variant="outline"
          className="w-full justify-start relative -top-44 space-x-2"

        >
          
          <LogOut className="h-5 w-5 " />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}
