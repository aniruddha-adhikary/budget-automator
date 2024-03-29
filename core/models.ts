export enum TransactionType {
  Inwards = 'Inwards',
  Outwards = 'Outwards',
};

export interface Transaction {
  amount: number;
  currency: string;
  date: Date;
  type: TransactionType;
  merchantDetails: string;
  accountEnding?: string;
  category_id: string | null;
}
