import { Session } from '../../../session/domain/session.js';
import { User } from '../../../users/domain/user.js';

export type JwtPayloadType = Pick<User, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
