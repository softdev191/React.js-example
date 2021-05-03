import theme from './Theme';

export enum SubscriptionType {
  TRIAL = 0,
  MONTHLY = 1,
  ANNUAL = 2
}
export const SubscriptionTypeLabels: { [type in SubscriptionType]: string } = Object.freeze({
  [SubscriptionType.TRIAL]: 'Trial',
  [SubscriptionType.MONTHLY]: 'Monthly',
  [SubscriptionType.ANNUAL]: 'Annual'
});

export enum SubscriptionStatus {
  INACTIVE = 0,
  ACTIVE,
  EXPIRED,
  NON_RENEWING
}
export const SubscriptionStatusLabels: { [type in SubscriptionStatus]: { label: string; color: string } } = Object.freeze({
  [SubscriptionStatus.INACTIVE]: { label: 'Inactive', color: theme.dustyGray },
  [SubscriptionStatus.ACTIVE]: { label: 'Active', color: theme.emerald },
  [SubscriptionStatus.EXPIRED]: { label: 'Expired', color: theme.silver },
  [SubscriptionStatus.NON_RENEWING]: { label: 'Non-Renewing', color: theme.red }
});
