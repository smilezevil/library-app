import { Identifiable } from '../../types';

export interface IUser extends Identifiable {
  readonly id: string;
  name: string;
  email: string;
}
