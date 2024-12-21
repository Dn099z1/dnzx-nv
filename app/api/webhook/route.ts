import { NextApiRequest, NextApiResponse } from 'next';
import { updateUserGems } from '@/utils/nhost';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { event, payment } = req.body;

  if (event === 'PAYMENT_CONFIRMED') {
    const discordId = payment.customer;
    const gems = payment.description.match(/(\d+) gemas/)[1]; 

    try {
      await updateUserGems(discordId, gems);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao atualizar gemas do usuário' });
    }
  } else {
    res.status(400).json({ error: 'Evento não suportado' });
  }
}
