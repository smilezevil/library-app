export interface Identifiable {
  id: string;
}

export type FormErrors<K extends string> = Partial<Record<K, string>>;

export enum NotificationType {
  Info = 'info',
  Success = 'success',
  Error = 'error',
}
