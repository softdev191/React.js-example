import React, { HTMLAttributes, PropsWithChildren, useEffect } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { NumberParam, StringParam, useQueryParams } from 'use-query-params';
import { useDebounce } from 'use-debounce';

import { Icon, IconProps } from '@rmwc/icon';
import { CircularProgress } from '@rmwc/circular-progress';
import {
  DataTableBody,
  DataTableHead,
  DataTableHeadCell,
  DataTableRow,
  DataTableRowProps,
  DataTable,
  DataTableProps,
  DataTableContent,
  DataTableHeadCellProps
} from '@rmwc/data-table';

import styled from '../../../styled-components';
import Defaults from '../../../constants/Defaults';
import { useGetUsersByPage, useGetUsersCount } from '../../../lib/api/User.hooks';
import parseSort from '../../../lib/parseSort';
import { Box, Layout, Text } from '../../../components';
import theme from '../../../constants/Theme';
import { Card } from '@rmwc/card';
import { TextProps } from '../../../components/Text';
import ListPagination, { LIST_PAGE_SIZES } from '../../../components/ListPagination';
import UserListColumns from './UserListColumns';

type UserListProps = RouteComponentProps;

const SectionContainer = styled(Box)`
  width: 85%;
`;

const FullWidthBar = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 45px;
  justify-content: space-between;
  align-items: center;
`;

const StyledCard = styled(Card)`
  height: 631px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
`;

const StyledDataTable = styled(DataTable)<PropsWithChildren<DataTableProps>>`
  flex: 1;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
`;

const StyledDataTableRow = styled(DataTableRow)<PropsWithChildren<DataTableRowProps>>`
  border-bottom: 1px solid ${theme.gainsboro};
`;

const SortableColumnHeader = styled(DataTableHeadCell)<DataTableHeadCellProps & HTMLAttributes<DataTableHeadCellProps>>`
  svg {
    margin: 0;
  }
`;

const ColumnTitle = styled(Text)<TextProps>`
  float: left;
  user-select: none;
`;

const DataTableFooter = styled(Box)`
  min-height: 52px;
  background: ${theme.alabaster};
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const CenteredContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const StyledIcon = styled(Icon)<IconProps>`
  &&& {
    position: absolute;
    right: 15px;
    top: 8px;
    font-size: 30px;
  }
`;

const StyledSearchField = styled.input`
  background-color: #f8f8f8;
  height: 44px;
  width: 286px;
  border: 0;
  border-radius: 22px;
  padding: 0 30px;
  padding-right: 50px;
  font-size: 16px;
  font-family: 'Nunito Sans';

  :focus {
    outline: none;
  }
`;

const EmptyMessageTitle = styled(Text)<TextProps>`
  color: ${theme.black};
  font-weight: 900;
`;

const ProgressSpinner = () => {
  return (
    <CenteredContainer>
      <CircularProgress size='large' />
    </CenteredContainer>
  );
};

const EmptyList = () => {
  return (
    <CenteredContainer>
      <EmptyMessageTitle variant='subtitle' mb={4}>
        No users found
      </EmptyMessageTitle>
    </CenteredContainer>
  );
};

// TODO handle error
function UserList(props: UserListProps) {
  const [query, setQuery] = useQueryParams({
    page: NumberParam,
    limit: NumberParam,
    search: StringParam,
    sort: StringParam
  });
  const { page, limit = LIST_PAGE_SIZES[0], search, sort } = query;
  const [searchStringDebounce] = useDebounce(search, Defaults.SEARCH_DEBOUNCE_MS);

  const { data, isLoading, error, get } = useGetUsersByPage();
  const { data: countData, get: getCount, error: countError, isLoading: isLoadingCount } = useGetUsersCount();

  useEffect(() => {
    let filter: any = {
      page: Number(page) || 0,
      sort: String(sort || ''),
      limit: Number(limit) || Defaults.LIST_PAGE_SIZE
    };
    if (searchStringDebounce) {
      filter.search = searchStringDebounce;
    }
    get(filter);
    getCount(searchStringDebounce ? { search: searchStringDebounce } : {});
  }, [get, page, sort, limit, searchStringDebounce, getCount]);

  const setNewSort = (column: string, direction: number | null) => {
    const newSort = direction ? `${column} ${direction > 0 ? 'DESC' : 'ASC'}` : undefined;
    setQuery({ sort: newSort });
  };

  const setNewPage = (page: number) => {
    page = page - 1;
    setQuery({ page });
  };

  const setNewLimit = (limit: number) => {
    setQuery({ page: 0, limit });
  };

  let sortObj: any;
  if (sort) {
    sortObj = parseSort(sort as string);
  }
  sortObj = sortObj || { column: '', direction: null };

  return (
    <Layout py={6} hidePatternFooter>
      <SectionContainer>
        <FullWidthBar>
          <Text variant='title' textTransform='uppercase' color={theme.black}>
            Users
          </Text>
          <SearchWrapper>
            <StyledIcon icon='search' />
            <StyledSearchField
              type='text'
              placeholder='Search Users'
              onChange={(event: React.ChangeEvent<any>) => {
                setQuery({ page: 0, search: event.target.value });
              }}
              value={search || ''}
            />
          </SearchWrapper>
        </FullWidthBar>
        <StyledCard>
          {data && data[0] && !error ? (
            <>
              <StyledDataTable stickyRows={1}>
                <DataTableContent>
                  <DataTableHead>
                    <DataTableRow>
                      {UserListColumns.map(({ key, title, sortable, headerStyle }) => {
                        return sortable ? (
                          <SortableColumnHeader
                            key={key}
                            style={headerStyle}
                            sort={sortObj.column === key ? sortObj.direction : null}
                            onSortChange={(dir: any) => {
                              setNewSort(key, dir);
                            }}
                          >
                            <ColumnTitle variant='label'>{title}</ColumnTitle>
                          </SortableColumnHeader>
                        ) : (
                          <DataTableHeadCell key={key}>
                            <ColumnTitle variant='label'>{title}</ColumnTitle>
                          </DataTableHeadCell>
                        );
                      })}
                    </DataTableRow>
                  </DataTableHead>
                  <DataTableBody>
                    {!isLoading &&
                      data.map(row => (
                        <StyledDataTableRow key={row.id}>
                          {UserListColumns.map(({ key, style, renderCell }) => renderCell(row, key, style))}
                        </StyledDataTableRow>
                      ))}
                  </DataTableBody>
                </DataTableContent>
                {isLoading && <ProgressSpinner />}
              </StyledDataTable>
              <DataTableFooter>
                {countData && !countError && (
                  <ListPagination
                    current={Number(page) + 1 || 1}
                    total={Math.ceil(countData / limit)}
                    limit={limit}
                    onPageChange={setNewPage}
                    onLimitChange={setNewLimit}
                    isLoading={isLoadingCount}
                  />
                )}
              </DataTableFooter>
            </>
          ) : !isLoading ? (
            <EmptyList />
          ) : (
            <ProgressSpinner />
          )}
        </StyledCard>
      </SectionContainer>
    </Layout>
  );
}

export default withRouter(UserList);
