'use client';

import { useSession } from 'next-auth/react'; // Importa o hook de sessão do NextAuth
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Router from 'next/navigation';
import { useState, useEffect } from 'react';
import { fetchUserGems } from '@/utils/nhost';
import { signOut } from 'next-auth/react';
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [gems, setGems] = useState<string | number>(''); 

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

  if (status === 'loading') {
    return <div>Carregando...</div>;
  }

  // Se não houver sessão (usuário não autenticado), você pode redirecionar ou mostrar uma mensagem.
  if (!session) {
    return <div>Você precisa estar logado para ver este conteúdo.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={session.user?.image ?? ''} />
          <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {session.user?.name}!</h1>
          <p className="text-muted-foreground">{session.user?.email}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gemas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
