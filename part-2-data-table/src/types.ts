import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;
export type SortState = { key: string; direction: Exclude<SortDirection, null> } | null;
export type PaginationState = { pageIndex: number; pageSize: number };
export type ChildMode = 'inline' | 'on-demand';

export type ColumnDef<T> = {
  /** Stable column id. Use accessorKey for a direct property or accessor for computed values. */
  id: string;
  header: string;
  accessorKey?: keyof T;
  accessor?: (row: T) => unknown;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  width?: number | string;
  pinned?: boolean;
  align?: 'left' | 'center' | 'right';
};

export type DataTableProps<T extends { id: string }, C> = {
  data: T[];
  columns: ColumnDef<T>[];
  getRowId?: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  pageSizeOptions?: number[];
  initialPageSize?: number;
  /** Controlled sorting: pass sortState and onSortChange together. */
  sortState?: SortState;
  onSortChange?: (sort: SortState) => void;
  /** Controlled pagination: pass pagination and onPaginationChange together. */
  pagination?: PaginationState;
  onPaginationChange?: (next: PaginationState) => void;
  /** For server paging, supply the current page rows and total row count. */
  totalCount?: number;
  manualSorting?: boolean;
  manualPagination?: boolean;
  getInlineChildren?: (row: T) => C[];
  renderChild?: (child: C, index: number) => ReactNode;
  childMode?: ChildMode;
  fetchChildren?: (row: T) => Promise<C[]>;
  renderOnDemandChild?: (child: C, index: number) => ReactNode;
  getChildrenErrorMessage?: (error: unknown) => string;
  onRetryInitialLoad?: () => void;
};
