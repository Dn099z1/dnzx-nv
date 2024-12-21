import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AlertCircle, Book, HelpCircle } from 'lucide-react';

const serverRules = [
  {
    title: 'Regras Gerais',
    content: [
      'Respeite todos os jogadores',
      'Proibido usar cheats ou mods',
      'Proibido spam no chat',
      'Mantenha o RP realista',
    ],
  },
  {
    title: 'Regras de Combate',
    content: [
      'Sem RDM (Random Death Match)',
      'Sem VDM (Vehicle Death Match)',
      'Respeite as áreas safes',
      'Avise antes de iniciar ações hostis',
    ],
  },
  {
    title: 'Regras de Comunicação',
    content: [
      'Use Push-to-Talk',
      'Mantenha linguagem apropriada',
      'Não revele informações OOC no IC',
      'Respeite os administradores',
    ],
  },
];

const tutorials = [
  {
    title: 'Como começar?',
    content: 'Aprenda os primeiros passos para iniciar sua jornada no servidor...',
  },
  {
    title: 'Sistema de Economia',
    content: 'Entenda como funciona nosso sistema econômico e como prosperar...',
  },
  {
    title: 'Empregos e Profissões',
    content: 'Descubra todas as carreiras disponíveis e como progredir...',
  },
];

export default function InfoPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Informações do Servidor</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Regras do Servidor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {serverRules.map((rule, index) => (
                <AccordionItem key={index} value={`rule-${index}`}>
                  <AccordionTrigger>{rule.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-4 space-y-2">
                      {rule.content.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="h-5 w-5" />
                Tutoriais
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {tutorials.map((tutorial, index) => (
                  <AccordionItem key={index} value={`tutorial-${index}`}>
                    <AccordionTrigger>{tutorial.title}</AccordionTrigger>
                    <AccordionContent>{tutorial.content}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Suporte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Precisa de ajuda? Entre em contato com nossa equipe:</p>
              <ul className="space-y-2">
                <li>Discord: discord.gg/brfivem</li>
                <li>Email: suporte@brfivem.com</li>
                <li>Horário: 24/7</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}