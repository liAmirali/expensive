import type { GroupMembership } from '../generated/prisma/client.js';

declare global {
  namespace Express {
    interface Request {
      user?: { id: ID };
      groupMembership?: GroupMembership;
    }
  }
}

export {};
