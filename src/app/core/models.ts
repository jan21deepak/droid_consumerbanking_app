export type AccountKind = 'checking' | 'savings' | 'credit' | 'investment';

export interface Account {
  id: string;
  name: string;
  number: string;
  routingNumber: string;
  kind: AccountKind;
  balance: number;
  available: number;
}

export interface Transaction {
  id: string;
  accountId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  pending: boolean;
}

export interface Payee {
  id: string;
  name: string;
  category: 'utilities' | 'credit card' | 'insurance' | 'telecom' | 'other';
  accountNumber: string;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  memo?: string;
}

export interface BillPayment {
  payeeId: string;
  fromAccountId: string;
  amount: number;
  deliverBy: string;
}

export interface Confirmation {
  confirmationNumber: string;
  status: 'scheduled' | 'completed';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  lastLogin: string;
}

export interface SsoChallenge {
  challengeId: string;
  mfaRequired: boolean;
  deliveryChannel: 'sms' | 'push' | 'email';
  maskedDestination: string;
}

export interface SessionToken {
  accessToken: string;
  expiresAt: number;
  user: User;
}

export interface CreditScore {
  provider: string;
  score: number;
  band: 'Poor' | 'Fair' | 'Good' | 'Very Good' | 'Exceptional';
  asOf: string;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export interface ExternalAccount {
  institution: string;
  name: string;
  mask: string;
  balance: number;
}
