'use client'
import { useSession } from 'next-auth/react';
import { ThemeToggle } from './theme-toggle';
import { fetchUserGems } from '@/utils/nhost';
import { Bell, Diamond } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState, useEffect } from 'react';

export function NavHeader() {
  const [gems, setGems] = useState<string | number>(''); 
  const { data: session } = useSession();

  const getGems = async () => {
    const discordId = session?.user?.id;

    if (discordId) {
    
      try {
        const gemsValue = await fetchUserGems(discordId as string);
        setGems(gemsValue);
      } catch (error) {
      }
    } else {
    }
  };

  useEffect(() => {
    if (session) {
      getGems();
    }
  }, [session]);

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Diamond className="text-blue-400 -p-1" />
          <h1 className="text-blue-400 font-mono font-bold">{gems}</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[300px]">
              <DropdownMenuItem>
                <div className="flex flex-col">
                  <span className="font-medium">Novo Evento</span>
                  <span className="text-sm text-muted-foreground">
                    event_description
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
