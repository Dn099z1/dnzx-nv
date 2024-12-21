import { gql } from 'graphql-request';
import { nhost } from '@/nhost';

const FETCH_PRODUCTS = gql`
  query GetStoreItems($category: String, $subcategory: String) {
    store_items(where: {
      category: { _eq: $category },
      _or: [
        { subcategory: { _eq: $subcategory } },
        { subcategory: { _is_null: true } }
      ]
    }) {
      id
      name
      price
      benefits
      img
      category
      subcategory
    }
  }
`;

const INSERT_INVENTORY_ITEM = gql`
  mutation InsertInventoryItem($discordId: String!, $item: String!, $category: String!, $itemId: String!) {
    insert_inventory(objects: { user_discord: $discordId, item: $item, category: $category, item_id: $itemId }) {
      returning {
        id
        user_discord
        item
        category
        item_id
      }
    }
  }
`;


const FETCH_INVENTORY_ITEMS = gql`
  query GetInventoryItems($discordId: String!) {
    inventory(where: { user_discord: { _eq: $discordId } }) {
      id
      item
      category
      img
      item_id
      status
    }
  }
`;

const FETCH_USER_GEMS = gql`
  query GetUserGems($discordId: String!) {
    profiles(where: { discord: { _eq: $discordId } }) {
      id
      discord
      gems
    }
  }
`;



const UPDATE_USER_GEMS = gql`
mutation UpdateUserGems($discordId: String!, $gems: String!) {
  update_profiles(
    where: { discord: { _eq: $discordId } }
    _set: { gems: $gems }
  ) {
    returning {
      id
      discord
      gems
    }
  }
}



`;

const FETCH_GEMS_PACKS = gql`
  query GetGemsPacks {
    gems_pack {
      id
      name
      gems
      price
    }
  }
`;




export async function fetchGemsPacks() {
  try {
    const { data, error } = await nhost.graphql.request(FETCH_GEMS_PACKS);

    if (error) {
      console.error("Erro ao buscar pacotes de gemas:", error);
      return [];
    }

    return data.gems_pack || [];
  } catch (err) {
    console.error("Erro ao buscar pacotes de gemas:", err);
    return [];
  }
}


export async function updateUserGems(discordId: string, gems: number) {
  try {
    const variables = { discordId, gems };
    console.log("Atualizando gemas para:", variables); // Log para verificar os dados
    const { data, error } = await nhost.graphql.request(UPDATE_USER_GEMS, variables);

    if (error) {
      console.error("Erro ao atualizar as gemas do usuário:", JSON.stringify(error, null, 2));
      return null;
    }

    return data.update_profiles.returning[0];
  } catch (err) {
    console.error("Erro ao atualizar as gemas do usuário:", err);
    return null;
  }
}



export async function fetchUserGems(discordId: string) {
  try {
    const variables = { discordId };

    console.time("GraphQL Request");
    const { data, error } = await nhost.graphql.request(FETCH_USER_GEMS, variables);
    console.timeEnd("GraphQL Request");

    if (error) {
      console.error("Erro ao buscar gemas:", JSON.stringify(error, null, 2));
      return 0; 
    }

    if (!data || !data.profiles || data.profiles.length === 0) {
      console.error("Usuário não encontrado:", data);
      return 0; 
    }

    const user = data.profiles[0];
   // console.log("Gemas do usuário recebidas:", user.gems);
    return user.gems || 0; 
  } catch (err) {
    console.error("Erro na requisição GraphQL:", err);
    return 0; 
  }
}

export async function fetchStoreItems(category?: string, subcategory?: string) {
  try {
    const variables: any = {};

    if (category) {
      variables.category = category;
    }

    if (subcategory) {
      variables.subcategory = subcategory;
    }

    console.time("GraphQL Request");
    const { data, error } = await nhost.graphql.request(FETCH_PRODUCTS, variables);
    console.timeEnd("GraphQL Request");

    if (error) {
      console.error("Erro ao buscar produtos:", JSON.stringify(error, null, 2));
      return [];
    }

    if (!data || !data.store_items) {
      console.error("Dados não encontrados:", data);
      return [];
    }

    return data.store_items;
  } catch (err) {
    console.error("Erro na requisição GraphQL:", err);
    return [];
  }
}


export async function deductUserGems(discordId: string, value: number): Promise<boolean> {
  try {
    const userGems = await fetchUserGems(discordId);

    if (userGems < value) {
      console.error("Gemas insuficientes para deduzir.");
      return false;
    }

    const newGems = (userGems - value).toString();  
    const response = await nhost.graphql.request(
      gql`
        mutation DeductUserGems($discordId: String!, $newGems: String!) {
          update_profiles(
            where: { discord: { _eq: $discordId } }
            _set: { gems: $newGems }
          ) {
            affected_rows
            returning {
              discord
              gems
            }
          }
        }
      `,
      {
        discordId,
        newGems, 
      }
    );

   // console.log("Resposta da mutação:", response);

    if (response?.data?.update_profiles?.affected_rows > 0) {
      return true;
    } else {
      console.error("Erro ao atualizar gemas. Resposta da mutação:", response);
      if (response?.error) {
        console.error("Erro GraphQL:", response.error);
      }
      return false;
    }
  } catch (err) {
    console.error("Erro ao subtrair gemas:", err);
    return false;
  }
}

export async function insertInventoryItem(discordId: string, item: string, category: string): Promise<boolean> {
  try {
    const itemId = await fetchItemIdByName(item);

    if (!itemId) {
      console.error("Item não encontrado ou item_id não disponível.");
      return false;
    }

    const variables = { discordId, item, category, itemId };

    console.time("GraphQL Request");
    const { data, error } = await nhost.graphql.request(INSERT_INVENTORY_ITEM, variables);
    console.timeEnd("GraphQL Request");

    if (error) {
      console.error("Erro ao inserir item no inventário:", JSON.stringify(error, null, 2));
      return false;
    }

    if (!data || !data.insert_inventory || data.insert_inventory.returning.length === 0) {
      console.error("Falha ao inserir item no inventário. Dados:", data);
      return false;
    }

    const insertedItem = data.insert_inventory.returning[0];
    console.log("Item inserido no inventário:", insertedItem);
    return true;
  } catch (err) {
    console.error("Erro ao realizar inserção no inventário:", err);
    return false;
  }
}


export async function fetchItemIdByName(itemName: string): Promise<string | null> {
  try {
    const variables = { name: itemName };

    console.time("GraphQL Request");
    const { data, error } = await nhost.graphql.request(
      gql`
        query GetItemId($name: String!) {
          store_items(where: { name: { _eq: $name } }) {
            item_id
          }
        }
      `,
      variables
    );
    console.timeEnd("GraphQL Request");

    if (error) {
      console.error("Erro ao buscar item_id:", error);
      return null;
    }

    if (!data || !data.store_items || data.store_items.length === 0) {
      console.error("Produto não encontrado na loja:", data);
      return null;
    }

    const item = data.store_items[0];
    return item.item_id; 
  } catch (err) {
    console.error("Erro ao realizar a consulta:", err);
    return null;
  }
}



export async function fetchInventoryItems(discordId: string) {
  if (!discordId) {
    console.error("discordId não foi fornecido.");
    return []; // Retorna um array vazio caso discordId não esteja definido
  }

  try {
    const variables = { discordId };

    console.time("GraphQL Request");
    const { data, error } = await nhost.graphql.request(FETCH_INVENTORY_ITEMS, variables);
    console.timeEnd("GraphQL Request");

    if (error) {
      console.error("Erro ao buscar itens do inventário:", JSON.stringify(error, null, 2));
      return [];
    }

    if (!data || !data.inventory || data.inventory.length === 0) {
      console.error("Inventário vazio ou não encontrado para o usuário:", data);
      return [];
    }

    return data.inventory;
  } catch (err) {
    console.error("Erro na requisição GraphQL:", err);
    return [];
  }
}
