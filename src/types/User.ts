import { SubscriptionStatus, SubscriptionType } from '../constants/User';

export type User = {
  id: number;
  username: string;
  email: string;
  created: string | Date;
  modified: string | Date;
  roles: any[];
};

export type UserDto = {
  id: number;
  name: string;
  email: string;
  bidCount: string;
  subscriptionType: SubscriptionType;
  subscriptionTrial: boolean;
  subscriptionStatus: SubscriptionStatus;
  renewalDate: Date;
};
