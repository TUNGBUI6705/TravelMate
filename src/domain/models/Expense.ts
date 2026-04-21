import type { DateValue } from "./User";

export interface Expense {
  id: string;
  tripId: string;
  ownerUid: string;
  title: string;
  amount: number;
  category: string;
  date: DateValue;
  dayNumber: number;
  note: string;
  receiptUrl: string | null;
  paidBy: string;
  createdAt: DateValue;
}

