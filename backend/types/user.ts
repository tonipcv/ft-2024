import { User } from '@prisma/client';

export interface UserWithResetCode extends User {
  resetCode: string | null;
}
