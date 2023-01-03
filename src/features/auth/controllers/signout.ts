import HTTP_STATUS from 'http-status-codes';
import { Request, Response } from 'express';

export class SignOut {
  public async update(req: Request, res: Response): Promise<void> {
    /**
     * reset the cookie's session to null for sign out
     */
    req.session = null;
    res.status(HTTP_STATUS.OK).json({ message: 'Logout successful', user: {}, token: '' });
  }
}
