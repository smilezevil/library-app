export interface Identifiable {
  id: string;
}

export type FormErrors<K extends string> = Partial<Record<K, string>>;
