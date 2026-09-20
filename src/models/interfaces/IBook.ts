import { Identifiable } from '../../types';

export interface IBook extends Identifiable {
  readonly id: string;
  title: string;
  author: string;
  year: number;
  readonly isBorrowed: boolean;
  readonly borrowedBy: string | null;
}
