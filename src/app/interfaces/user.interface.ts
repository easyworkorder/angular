import { TObjectId } from './common.interface';

export type TUserId = TObjectId;

export interface IUser {
  id: TUserId;
  email: string;
  firstName: string;
  lastName: string;
}

// TODO: interfaces for id seem redundant

export interface IUserId {
  id: TUserId;
}
