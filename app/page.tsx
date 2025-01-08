"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";

import { GamepadIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const LogoutMax = () => {
    signOut();
    router.push("./");
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Image
                className="left-9 relative"
                src="https://host-two-ochre.vercel.app/files/valley_sem_fundo.png"
                width={65}
                height={65}
                alt="Logo"
              />
            </div>

            <div className="flex items-center space-x-4">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center space-x-2 focus:outline-none">
                      <img
                        src={session.user.image || ""}
                        alt={session.user.name || "Avatar"}
                        className="w-10 h-10 rounded-full"
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-black text-white"
                  >
                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard")}
                      className="hover:bg-yellow-500 hover:text-black cursor-pointer"
                    >
                      Painel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={LogoutMax}
                      className="hover:bg-yellow-500 hover:text-black cursor-pointer"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => signIn("discord")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Conectar
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0b0f]" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-6"
            >
              MELHOR SERVIDOR DE ROLEPLAY DO BRASIL!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 text-gray-300"
            >
              Entre agora e faça parte da nossa comunidade incrível!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex space-x-4"
            >
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
                onClick={() => router.push("https://discord.gg/newvalleyrp")}
              >
                Começar a Jogar
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
            </motion.div>
            <div className="flex relative -top-80 -right-full">
              <Image
                className="flex relative"
                src="https://cdn.discordapp.com/attachments/951553615468826724/1326423653352734730/cG5n.png?ex=677f5fca&is=677e0e4a&hm=4f377315ed4a9b1f05fb9b677142d9655684c20edf75d2c456598a6877960605&"
                width={350}
                height={350}
                alt="Imagen"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
