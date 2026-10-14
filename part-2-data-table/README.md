# Part 2 — Reusable, Type-safe Data Table

A from-scratch generic React + TypeScript data table styled with Tailwind CSS utilities and a small layer of custom CSS. **No table/grid library is used.** Mock data and delayed mock requests keep the project self-contained.

## Run locally

```bash
npm install
npm run dev
```

Build check: `npm run build`

## Pages / demos

- **Class schedule:** fitness class timetable with attendees, inline child rows, lazy on-demand child fetching, sorting, pagination, sticky first column, skeleton loading, empty and error states.
- **Inventory demo:** a differently shaped dataset rendered by the same generic component, including expandable product details.
- **Orders demo:** client-side mode and a switchable controlled server-side simulation. In server mode the parent owns sorting and pagination and mock requests have artificial latency.

## Component API

`src/types.ts` defines `ColumnDef<T>` and `DataTableProps<T, C>`. Column definitions support:

- stable `id`, `header`, `accessorKey` or computed `accessor`
- optional `render`, `sortable`, `width`, `pinned`, and alignment
- controlled sorting through `sortState` + `onSortChange`
- controlled pagination through `pagination` + `onPaginationChange`
- manual sorting/pagination and `totalCount` for server-style modes
- inline child data or `fetchChildren` for on-demand child rows

## State management decisions

- The table owns sort and pagination state by default (uncontrolled mode).
- If controlled state props are supplied, the parent is the source of truth and receives change callbacks.
- Expanded row IDs, fetched child caches, per-row loading, and per-row errors are local to the table because they are presentation/interaction state.
- Derived sorted and visible rows are calculated with `useMemo`; input data is not mutated.
- Invalid page indexes are clamped when data/page count changes.

## Sorting and pagination strategy

- Client-side sorting cycles ascending → descending → none.
- Client-side pagination slices the sorted dataset.
- Manual mode does not locally sort or slice data; the parent provides the current server page and total count.
- The Orders demo simulates server latency in the parent to demonstrate controlled callbacks without requiring a backend.

## Expandable rows

- **Inline:** children are already part of the parent record and render beneath the parent.
- **On-demand:** expanding a row calls `fetchChildren`; each row has independent loading and error states with retry. Results are cached by row ID for subsequent expansions.
- Expanded content spans the table width and uses a short reveal transition.

## Sticky column

The first column is pinned by default; columns can also opt in with `pinned: true`. The table scrolls horizontally in a bounded container. A shadow/divider appears on the pinned column after horizontal scrolling.

## Accessibility and performance

- Semantic `<table>`, `<thead>`, `<tbody>`, `<th>`, and `<td>` elements.
- Sort buttons, descriptive expand labels, `aria-expanded`, and `aria-sort` attributes.
- Skeleton rows match the current column count.
- Sorting copies the data before sorting; derived rows are memoized.
- Reduced-motion preference is respected.

## Assumptions / tradeoffs

- Mock data replaces a backend as allowed by the assessment.
- The server-side mode is simulated in the browser, not connected to a real server.
- The table uses a generic `id: string` row constraint for stable expansion/cache keys; callers can override `getRowId`.
- Large production datasets may require virtualization, but a table virtualization library was not added because the assessment prohibits table/grid libraries and prioritizes a from-scratch implementation.
