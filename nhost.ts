import { NhostClient } from '@nhost/nhost-js';
import { GraphQLClient } from 'graphql-request';

export const nhost = new NhostClient({
  subdomain: 'mhdpjrcumyqrzywr',
  region: 'sa-east-1',
});

export const graphqlClient = new GraphQLClient(nhost.graphql.url, {
  headers: {
    Authorization: `Bearer ${nhost.auth.getAccessToken()}`, // Token de acesso do NHost
  },
});
