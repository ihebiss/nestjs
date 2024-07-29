// src/types/keycloak-user.type.ts
export interface KeyCloakUserType {
    exp: number;
    iat: number;
    auth_time: number;
    jti: string;
    iss: string;
    aud: string[];
    sub: string;
    typ: string;
    azp: string;
    session_state: string;
    acr: string;
    realm_access: RealmAccess;
    resource_access: ResourceAccess;
    scope: string;
    sid: string;
    email_verified: boolean;
    name?: string;
    preferred_username?: string;
    given_name?: string;
    family_name?: string;
    email: string;
    [otherOptions: string]: unknown;
  }
  
  interface RealmAccess {
    [name: string]: string[] | undefined;
  }
  
  interface ResourceAccess {
    [name: string]: {
      [name: string]: string[] | undefined;
    } | undefined;
  }
  