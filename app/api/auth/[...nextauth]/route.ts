import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { NextAuthOptions } from 'next-auth';
import { nhost } from '@/nhost'; 

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.id = profile.id; 
        token.username = profile.name;
        token.avatar = profile.image_url;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id; 
        session.user.username = token.username;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === 'discord') {
        const discordId = profile.id;
        const discordName = profile.name;

        const { data, error } = await nhost.graphql.request(
          `query GetProfile($discord: String!) {
            profiles(where: { discord: { _eq: $discord } }) {
              id
            }
          }`,
          { discord: discordId }
        );
        if (data.profiles.length === 0) {
          const { data: insertData, error: insertError } = await nhost.graphql.request(
            `mutation CreateProfile($discord: String!, $name: String!, $gems: String!) {
              insert_profiles_one(object: {discord: $discord, name: $name, gems: $gems}) {
                id
              }
            }`,
            { discord: discordId, name: discordName, gems: '0' } 
          );

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
          }
        }
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
