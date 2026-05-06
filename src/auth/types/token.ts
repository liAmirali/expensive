import { UUID } from 'crypto';

export type AccessTokenPayload = {
  sub: string;
  email: string;
  tokenType: 'access';
};

export type RefreshTokenPayload = {
  sub: string;
  email: string;
  jti: UUID;
  tokenType: 'refresh';
};