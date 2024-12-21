'use client'

import { useEffect, useState } from "react";
import { fetchStoreItems } from "@/utils/nhost";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Diamond } from "lucide-react";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { deductUserGems, insertInventoryItem } from "@/utils/nhost";

const categories = [
  {
    name: "Propriedades",
    subcategories: ["Extra Luxo", "Mansão"]
  },
  {
    name: "Veículos",
    subcategories: ["Sport", "Super", "Importados", "Luxo"]
  },
  {
    name: "Premium",
    subcategories: ['Premium']
  },
  {
    name: "Outros",
    subcategories: ['Outros']
  }
];

interface StoreItem {
  id: string;
  name: string;
  price: string;
  benefits: string[];
  category: string;
  subcategory?: string;
  img: string; // Adicionando a propriedade 'img'
}

export default function StorePage() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("Todos");
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session, status } = useSession();

  // Função para escolher uma subcategoria aleatória de uma lista
  const getRandomSubcategory = (subcategories: string[]): string => {
    const randomIndex = Math.floor(Math.random() * subcategories.length);
    return subcategories[randomIndex];
  };

  const handleBuy = async (item: StoreItem) => {
    if (!session?.user?.id) {
      alert("Você precisa estar logado para realizar a compra!");
      return;
    }

    const discordId = session.user.id;
    const price = parseInt(item.price.replace(/\D/g, ""));

    if (isNaN(price) || price <= 0) {
      alert("Preço inválido!");
      return;
    }

    // Verifica as gemas do usuário
    const gems = await deductUserGems(discordId, price);

    if (!gems) {
      alert("Você não tem gemas suficientes para realizar esta compra.");
      return;
    }

    // Passa o nome do item para obter o item_id e inserir no inventário
    const success = await insertInventoryItem(discordId, item.name, item.category);

    if (success) {
      alert("Compra realizada com sucesso!");
    } else {
      alert("Erro ao inserir item no inventário.");
    }
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        // Passa tanto a categoria quanto a subcategoria, se houver
        const items = await fetchStoreItems(
          selectedCategory,
          selectedSubcategory === "Todos" ? undefined : selectedSubcategory
        );
        setStoreItems(items);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [selectedCategory, selectedSubcategory]);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);

    // Se a categoria tem subcategorias, seleciona uma aleatória
    const categoryObj = categories.find((cat) => cat.name === category);
    if (categoryObj?.subcategories.length) {
      const randomSubcategory = getRandomSubcategory(categoryObj.subcategories);
      setSelectedSubcategory(randomSubcategory);
    } else {
      setSelectedSubcategory("Todos");
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Loja VIP</h1>

      {/* Selecção da Categoria */}
      <div className="flex space-x-4">
        {categories.map((category) => (
          <Button
            key={category.name}
            variant={selectedCategory === category.name ? "default" : "outline"}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </div>

      {/* Selecção da Subcategoria, se a categoria for "Veículos" ou "Propriedades" */}
      {["Propriedades", "Veículos"].includes(selectedCategory) && (
        <div className="mt-4 flex space-x-4">
          {categories
            .find((cat) => cat.name === selectedCategory)?.subcategories.map((subcategory) => (
              <Button
                key={subcategory}
                variant={selectedSubcategory === subcategory ? "default" : "outline"}
                onClick={() => setSelectedSubcategory(subcategory)}
              >
                {subcategory}
              </Button>
            ))}
        </div>
      )}

      {/* Carregando ou produtos */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin h-8 w-8" />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {storeItems.length === 0 ? (
            <p className="text-center text-lg">Nenhum produto encontrado.</p>
          ) : (
            storeItems.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Exibindo a imagem */}
                  {item.img && <img src={item.img} alt={item.name} className="w-full h-auto rounded-md" />}
                    
                  <p className="text-2xl font-bold flex font-mono items-center space-x-2">
                    <Diamond className="text-yellow-500" size={20} />
                    <span>{item.price}</span>
                  </p>
                  <ul className="space-y-2">
                    {/* Descomentar quando os benefícios estiverem prontos */}
                    {/* {item.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        {benefit}
                      </li>
                    ))} */}
                  </ul>
                  <Button className="w-full" onClick={() => handleBuy(item)}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
