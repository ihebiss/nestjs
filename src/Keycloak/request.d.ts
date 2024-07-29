import { KeyCloakUserType } from './keycloak-user-type'; // Ajuste le chemin si nécessaire

declare global {
  namespace Express {
    interface Request {
      user?: KeyCloakUserType;
    }
  }
}
