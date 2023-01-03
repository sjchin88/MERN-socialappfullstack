import { IUserDocument } from '@user/interfaces/user.interface';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

/**
 * Creata a new property currentUser?: AuthPayload inside existing namespace
 * type AuthPayload is declared later in this.ts file
 */
declare global {
  namespace Express {
    interface Request {
      currentUser?: AuthPayload;
    }
  }
}

/**
 * Declare the properties required for AuthPayload
 */
export interface AuthPayload {
  userId: string;
  uId: string;
  email: string;
  username: string;
  avatarColor: string;
  iat?: number;
}

export interface IAuthDocument extends Document {
  _id: string | ObjectId;
  uId: string;
  username: string;
  email: string;
  password?: string;
  avatarColor: string;
  createdAt: Date;
  //passwordResetToken?: string;
  //passwordResetExpires?: number | string;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

export interface ISignUpData {
  _id: ObjectId;
  uId: string;
  email: string;
  username: string;
  password: string;
  avatarColor: string;
}

export interface IAuthJob {
  value?: string | IAuthDocument | IUserDocument;
}
