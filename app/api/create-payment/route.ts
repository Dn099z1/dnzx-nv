import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ASAAS_API_URL = 'https://www.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Requisição recebida:', body);

    const { discordId, amount, gems } = body;

    if (!discordId || !amount || !gems) {
      console.error('Dados ausentes:', { discordId, amount, gems });
      return NextResponse.json({ error: 'Dados ausentes' }, { status: 400 });
    }

    const response = await axios.post(
      `${ASAAS_API_URL}/payments`,
      {
        customer: discordId,
        value: amount,
        description: `Compra de ${gems} gemas`,
        paymentMethod: 'PIX',
        dueDate: new Date().toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${ASAAS_API_KEY}`,
        },
      }
    );

    console.log('Resposta da API Asaas:', response.data);

    return NextResponse.json({ checkoutUrl: response.data.invoiceUrl });
  } catch (error: any) {
    console.error('Erro ao criar cobrança:', error.message, error.response?.data);
    return NextResponse.json({ error: 'Erro interno ao criar cobrança' }, { status: 500 });
  }
}
