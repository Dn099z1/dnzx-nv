'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchGemsPacks, fetchUserGems, updateUserGems } from '@/utils/nhost';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const GemPurchasePage = () => {
  const [gemsPacks, setGemsPacks] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [gems, setGems] = useState<string | number>('');
  const { data: session } = useSession();
  const discordId = session?.user.id;

  const getGems = async () => {
    if (discordId) {
      try {
        const gemsValue = await fetchUserGems(discordId as string);
        setGems(gemsValue);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (session) {
      getGems();
    }
  }, [session]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const packs = await fetchGemsPacks();
        setGemsPacks(packs);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handlePurchase = async () => {
    try {
      const discordId = session?.user.id;
      const response = await axios.post('/api/create-payment', {
        discordId,
        amount: selectedAmount,
        gems: selectedAmount,
      });
  
      if (response.data.checkoutUrl) {
        
        window.location.href = response.data.checkoutUrl; // Redireciona para o PIX
      } else {
        alert('Erro ao gerar pagamento.');
      }
    } catch (error) {
      console.error('Erro ao processar compra:', error);
      alert('Erro ao processar compra.');
    }
  };
  

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Comprar Gemas</h1>

      <div className="grid gap-6 md:grid-cols-3">
        {gemsPacks.map(({ gems, price }) => (
          <Card key={gems}>
            <CardHeader>
              <CardTitle>{gems} Gemas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">R$ {price}</p>
              <Button
                variant={selectedAmount === gems ? 'default' : 'outline'}
                onClick={() => handleAmountSelect(gems)}
                className="w-full mt-4"
              >
                {selectedAmount === gems ? 'Selecionado' : 'Comprar'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <Button onClick={handlePurchase} disabled={!selectedAmount} className="w-full mt-8">
          Confirmar Compra
        </Button>
      )}

      <p className="text-center">Gemas atuais: {gems}</p>
    </div>
  );
};

export default GemPurchasePage;
