import React from 'react';
import { format } from 'date-fns';
import { DataTableCell } from '@rmwc/data-table';

import { Text } from '../../../components';
import { UserDto } from '../../../types/User';
import { SubscriptionStatus, SubscriptionStatusLabels, SubscriptionType, SubscriptionTypeLabels } from '../../../constants/User';

type StyleProps = { [key: string]: number | string };

/** Default render as text. */
function renderCell(user: UserDto, key: string, style?: StyleProps) {
  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody'>{`${(user as Record<string, any>)[key]}`}</Text>
    </DataTableCell>
  );
}

function renderSubscriptionCell(user: UserDto, key: string, style?: StyleProps) {
  const { subscriptionType, subscriptionTrial } = user || {};
  const type = (!subscriptionTrial && subscriptionType) || SubscriptionType.TRIAL;
  const label = SubscriptionTypeLabels[type];

  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody'>{label}</Text>
    </DataTableCell>
  );
}

function renderRenewalDateCell(user: UserDto, key: string, style?: StyleProps) {
  const { renewalDate } = user || {};
  const date = renewalDate ? format(new Date(renewalDate), 'MM/dd/yy') : '-';

  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody'>{date}</Text>
    </DataTableCell>
  );
}

function renderSubscriptionStatusCell(user: UserDto, key: string, style?: StyleProps) {
  const { label, color } = SubscriptionStatusLabels[user.subscriptionStatus || SubscriptionStatus.INACTIVE];

  return (
    <DataTableCell key={key} style={style}>
      <Text variant='tableBody' fontWeight={700} color={color}>
        {label}
      </Text>
    </DataTableCell>
  );
}

/**
 *  An array of tuple [key, display text, renderCell()]
 *  Use to customize the render depending on what data is on the cell
 */
const UserListColumns = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    style: { whiteSpace: 'normal', wordBreak: 'break-word' },
    headerStyle: { minWidth: 130 },
    renderCell
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
    style: { whiteSpace: 'normal', wordBreak: 'break-word' },
    headerStyle: { minWidth: 130 },
    renderCell
  },
  {
    key: 'bidCount',
    title: 'Projects',
    sortable: true,
    headerStyle: { minWidth: 130 },
    renderCell
  },
  {
    key: 'subscriptionType',
    title: 'Subscription',
    renderCell: renderSubscriptionCell
  },
  {
    key: 'renewalDate',
    title: 'Renewal Date',
    renderCell: renderRenewalDateCell
  },
  {
    key: 'subscriptionStatus',
    title: 'Status',
    renderCell: renderSubscriptionStatusCell
  }
];

export default UserListColumns;
