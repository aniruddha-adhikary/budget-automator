export type TransactionType = 'Inwards' | 'Outwards';

export interface Transaction {
  amount: number | null;
  currency: string | null;
  date: Date | null;
  type: TransactionType | null;
  merchantDetails: string | null;
}
