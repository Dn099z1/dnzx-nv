"use client";
import { useEffect, useState } from "react";
import { fetchInventoryItems } from "@/utils/nhost"; // Importa a função que você criou para o backend
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function InventoryPage({ A }: { A: string }) {
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { data: session, status } = useSession();
  const discordId = session?.user.id;

  const setVip = async (discordId: string, index: number) => {
    const url = "http://localhost:8080/setVip";
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      discordId,
      index,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer a requisição");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const addHome = async (discordId: string, home: string) => {
    const url = "http://localhost:8080/addHome";
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      discordId,
      home,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer a requisição");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const addVehicle = async (discordId: string, carro: string) => {
    const url = "http://localhost:8080/addVehicle";
    const headers = {
      "Content-Type": "application/json",
    };
    const body = JSON.stringify({
      discordId,
      carro,
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
      });

      if (!response.ok) {
        throw new Error("Erro ao fazer a requisição");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  useEffect(() => {
    if (!discordId) {
      console.error("discordId não encontrado.");
      return;
    }

    const loadInventoryItems = async () => {
      try {
        const items = await fetchInventoryItems(discordId);
        setInventoryItems(items);
      } catch (error) {
        console.error("Erro ao carregar itens:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInventoryItems();
  }, [discordId]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  const handleRescue = (item: any) => {
    const { category, item_id } = item;

    switch (category) {
      case "Propriedades":
        addHome(discordId, item.item);
        break;
      case "Veículos":
        addVehicle(discordId, item.item); 
        break;
      case "Premium":
        setVip(discordId, item_id);
        break;
      default:
        console.log("Categoria não reconhecida");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Inventário</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {inventoryItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.item}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Image
                  src={item.img} 
                  alt={item.name}
                  className="w-32 h-32 rounded-md"
                  width={80} 
                  height={80} 
                />
                <p>Categoria: {item.category}</p>
                <p>Status: {item.status}</p>
                <Button
                  className="font-mono font-bold font-extrabold"
                  onClick={() => handleRescue(item)}
                >
                  RESGATAR
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
