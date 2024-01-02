import { Request } from 'express';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    role: string;
  };
}
