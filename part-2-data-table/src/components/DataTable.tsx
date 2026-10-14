import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import type {
  ColumnDef,
  DataTableProps,
  PaginationState,
  SortDirection,
  SortState,
} from "../types";

function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function getCellValue<T>(row: T, column: ColumnDef<T>): unknown {
  if (column.accessor) return column.accessor(row);
  if (column.accessorKey) return row[column.accessorKey];
  return (row as unknown as Record<string, unknown>)[column.id];
}

function SkeletonRows({ count, columns }: { count: number; columns: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, row) => (
        <tr key={row} aria-hidden="true">
          {Array.from({ length: columns }, (_, col) => (
            <td key={col}>
              <div className={`skeleton ${col === 0 ? "skeleton-wide" : ""}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export default function DataTable<T extends { id: string }, C>({
  data,
  columns,
  getRowId = (row) => row.id,
  loading = false,
  error = null,
  emptyMessage = "No records found.",
  pageSizeOptions = [5, 10, 20],
  initialPageSize = 5,
  sortState,
  onSortChange,
  pagination,
  onPaginationChange,
  totalCount,
  manualSorting = false,
  manualPagination = false,
  getInlineChildren,
  renderChild,
  childMode = "inline",
  fetchChildren,
  renderOnDemandChild,
  getChildrenErrorMessage = () =>
    "We could not load this row. Please try again.",
  onRetryInitialLoad,
}: DataTableProps<T, C>) {
  const [internalSort, setInternalSort] = useState<SortState>(null);
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    { pageIndex: 0, pageSize: initialPageSize }
  );
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const [childrenById, setChildrenById] = useState<Record<string, C[]>>({});
  const [childLoading, setChildLoading] = useState<Set<string>>(
    () => new Set()
  );
  const [childErrors, setChildErrors] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolledHorizontally, setScrolledHorizontally] = useState(false);

  const activeSort = sortState !== undefined ? sortState : internalSort;
  const activePagination =
    pagination !== undefined ? pagination : internalPagination;
  const rowCount = totalCount ?? data.length;
  const pageCount = Math.max(
    1,
    Math.ceil(rowCount / activePagination.pageSize)
  );
  const safePageIndex = Math.min(
    Math.max(0, activePagination.pageIndex),
    pageCount - 1
  );

  useEffect(() => {
    if (safePageIndex !== activePagination.pageIndex)
      updatePagination({ ...activePagination, pageIndex: safePageIndex });
    // Clamp invalid page indexes if the dataset changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safePageIndex, activePagination.pageIndex]);

  const sortedData = useMemo(() => {
    if (manualSorting || !activeSort) return data;
    const column = columns.find((item) => item.id === activeSort.key);
    if (!column) return data;
    return [...data].sort(
      (a, b) =>
        compareValues(getCellValue(a, column), getCellValue(b, column)) *
        (activeSort.direction === "asc" ? 1 : -1)
    );
  }, [data, columns, activeSort, manualSorting]);

  const visibleRows = useMemo(() => {
    if (manualPagination) return sortedData;
    const start = safePageIndex * activePagination.pageSize;
    return sortedData.slice(start, start + activePagination.pageSize);
  }, [sortedData, manualPagination, safePageIndex, activePagination.pageSize]);

  function updateSort(next: SortState) {
    if (sortState === undefined) setInternalSort(next);
    onSortChange?.(next);
  }
  function updatePagination(next: PaginationState) {
    if (pagination === undefined) setInternalPagination(next);
    onPaginationChange?.(next);
  }
  function toggleSort(column: ColumnDef<T>) {
    if (!column.sortable) return;
    const direction: SortDirection =
      activeSort?.key !== column.id
        ? "asc"
        : activeSort.direction === "asc"
        ? "desc"
        : activeSort.direction === "desc"
        ? null
        : "asc";
    updateSort(direction ? { key: column.id, direction } : null);
    if (!manualPagination)
      updatePagination({ ...activePagination, pageIndex: 0 });
  }
  async function toggleExpanded(row: T) {
    const id = getRowId(row);
    if (expanded.has(id)) {
      setExpanded((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
      return;
    }
    setExpanded((previous) => new Set(previous).add(id));
    if (childMode === "on-demand" && !childrenById[id] && fetchChildren) {
      setChildLoading((previous) => new Set(previous).add(id));
      setChildErrors((previous) => {
        const next = { ...previous };
        delete next[id];
        return next;
      });
      try {
        const children = await fetchChildren(row);
        setChildrenById((previous) => ({ ...previous, [id]: children }));
      } catch (cause) {
        setChildErrors((previous) => ({
          ...previous,
          [id]: getChildrenErrorMessage(cause),
        }));
      } finally {
        setChildLoading((previous) => {
          const next = new Set(previous);
          next.delete(id);
          return next;
        });
      }
    }
  }
  async function retryChildren(row: T) {
    const id = getRowId(row);
    if (!fetchChildren) return;
    setChildLoading((previous) => new Set(previous).add(id));
    setChildErrors((previous) => {
      const next = { ...previous };
      delete next[id];
      return next;
    });
    try {
      const children = await fetchChildren(row);
      setChildrenById((previous) => ({ ...previous, [id]: children }));
    } catch (cause) {
      setChildErrors((previous) => ({
        ...previous,
        [id]: getChildrenErrorMessage(cause),
      }));
    } finally {
      setChildLoading((previous) => {
        const next = new Set(previous);
        next.delete(id);
        return next;
      });
    }
  }
  const hasChildrenFeature =
    childMode === "inline"
      ? Boolean(getInlineChildren && renderChild)
      : Boolean(fetchChildren && renderOnDemandChild);

  return (
    <div className="table-shell">
      <div
        ref={scrollRef}
        className="table-scroll"
        onScroll={(event) =>
          setScrolledHorizontally(event.currentTarget.scrollLeft > 2)
        }
      >
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column, index) => {
                const pinned = column.pinned || index === 0;
                const isSorted = activeSort?.key === column.id;
                return (
                  <th
                    key={column.id}
                    style={{ width: column.width, minWidth: column.width }}
                    className={`${pinned ? "pinned-cell" : ""} ${
                      pinned && scrolledHorizontally ? "pinned-shadow" : ""
                    } ${column.align ? `text-${column.align}` : ""}`}
                    aria-sort={
                      isSorted
                        ? activeSort?.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="sort-button"
                        onClick={() => toggleSort(column)}
                      >
                        {column.header}
                        {isSorted ? (
                          activeSort?.direction === "asc" ? (
                            <ArrowUp size={14} />
                          ) : (
                            <ArrowDown size={14} />
                          )
                        ) : (
                          <ArrowUpDown size={14} className="sort-muted" />
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonRows
                count={Math.max(3, activePagination.pageSize)}
                columns={columns.length}
              />
            ) : error ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="state-panel">
                    <AlertCircle size={23} />
                    <strong>Couldn’t load data</strong>
                    <p>{error}</p>
                    {onRetryInitialLoad && (
                      <button
                        className="button button-secondary"
                        onClick={onRetryInitialLoad}
                      >
                        <RefreshCw size={14} /> Try again
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : visibleRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>
                  <div className="state-panel">
                    <div className="empty-icon">⌁</div>
                    <strong>Nothing here yet</strong>
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              visibleRows.map((row) => {
                const id = getRowId(row);
                const isExpanded = expanded.has(id);
                const children =
                  childMode === "inline"
                    ? getInlineChildren?.(row) ?? []
                    : childrenById[id] ?? [];
                const isChildLoading = childLoading.has(id);
                const childError = childErrors[id];
                return (
                  <Fragment key={id}>
                    <tr
                      className={`data-row ${isExpanded ? "row-expanded" : ""}`}
                    >
                      {columns.map((column, index) => {
                        const pinned = column.pinned || index === 0;
                        return (
                          <td
                            key={column.id}
                            style={{
                              width: column.width,
                              minWidth: column.width,
                            }}
                            className={`${pinned ? "pinned-cell" : ""} ${
                              pinned && scrolledHorizontally
                                ? "pinned-shadow"
                                : ""
                            } ${column.align ? `text-${column.align}` : ""}`}
                          >
                            <div className="cell-content">
                              {index === 0 && hasChildrenFeature && (
                                <button
                                  className="expand-button"
                                  aria-label={`${
                                    isExpanded ? "Collapse" : "Expand"
                                  } row ${id}`}
                                  aria-expanded={isExpanded}
                                  onClick={() => void toggleExpanded(row)}
                                >
                                  {isExpanded ? (
                                    <ChevronDown size={15} />
                                  ) : (
                                    <ChevronRight size={15} />
                                  )}
                                </button>
                              )}
                              {column.render
                                ? column.render(row)
                                : String(getCellValue(row, column) ?? "—")}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                    {isExpanded && (
                      <tr className="child-row">
                        <td colSpan={columns.length}>
                          <div className="child-panel" key={`${id}-children`}>
                            {isChildLoading ? (
                              <div className="child-loading">
                                <LoaderCircle className="spin" size={17} />{" "}
                                Loading related records…
                              </div>
                            ) : childError ? (
                              <div className="child-error">
                                <AlertCircle size={17} />
                                <span>{childError}</span>
                                <button
                                  className="button button-secondary button-small"
                                  onClick={() => void retryChildren(row)}
                                >
                                  <RefreshCw size={13} /> Retry
                                </button>
                              </div>
                            ) : children.length === 0 ? (
                              <p className="child-empty">
                                No related records for this row.
                              </p>
                            ) : (
                              <div className="child-list">
                                {children.map((child, index) => (
                                  <div
                                    className="child-item"
                                    key={
                                      (child as { id?: string })?.id ?? index
                                    }
                                  >
                                    {childMode === "inline"
                                      ? renderChild?.(child, index)
                                      : renderOnDemandChild?.(child, index)}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!loading && !error && (
        <div className="table-footer">
          <span className="range-label">
            {rowCount === 0
              ? "0 records"
              : `${safePageIndex * activePagination.pageSize + 1}–${Math.min(
                  (safePageIndex + 1) * activePagination.pageSize,
                  rowCount
                )} of ${rowCount} records`}
          </span>
          <div className="pagination-controls">
            <label htmlFor="page-size">Page</label>
            <select
              id="page-size"
              value={activePagination.pageSize}
              onChange={(event) =>
                updatePagination({
                  pageIndex: 0,
                  pageSize: Number(event.target.value),
                })
              }
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <button
              aria-label="First page"
              className="page-button"
              disabled={safePageIndex === 0}
              onClick={() =>
                updatePagination({ ...activePagination, pageIndex: 0 })
              }
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              aria-label="Previous page"
              className="page-button"
              disabled={safePageIndex === 0}
              onClick={() =>
                updatePagination({
                  ...activePagination,
                  pageIndex: Math.max(0, safePageIndex - 1),
                })
              }
            >
              <ChevronRight className="flip-icon" size={16} />
            </button>
            <span className="page-count">
              {safePageIndex + 1} / {pageCount}
            </span>
            <button
              aria-label="Next page"
              className="page-button"
              disabled={safePageIndex >= pageCount - 1}
              onClick={() =>
                updatePagination({
                  ...activePagination,
                  pageIndex: Math.min(pageCount - 1, safePageIndex + 1),
                })
              }
            >
              <ChevronRight size={16} />
            </button>
            <button
              aria-label="Last page"
              className="page-button"
              disabled={safePageIndex >= pageCount - 1}
              onClick={() =>
                updatePagination({
                  ...activePagination,
                  pageIndex: pageCount - 1,
                })
              }
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
