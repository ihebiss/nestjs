import { KeycloakConnectOptions } from 'nest-keycloak-connect';

export const keycloakConfig: KeycloakConnectOptions = {
  authServerUrl: 'http://localhost:8081', // URL de votre serveur Keycloak
  realm: 'myrealm',
  clientId: 'myhanen',
  secret:''
 
};
