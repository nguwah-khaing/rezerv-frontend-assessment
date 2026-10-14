import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownToLine,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Layers3,
  Package,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import DataTable from "./components/DataTable";
import {
  fitnessClasses,
  inventoryItems,
  orders,
  paymentBadge,
  statusBadge,
} from "./data/mockData";
import type {
  Attendee,
  FitnessClass,
  InventoryItem,
  OrderItem,
} from "./data/mockData";
import type { ColumnDef, PaginationState, SortState } from "./types";

const classColumns: ColumnDef<FitnessClass>[] = [
  {
    id: "name",
    header: "Class",
    accessorKey: "name",
    sortable: true,
    pinned: true,
    width: 230,
    render: (row) => (
      <div className="class-cell">
        <span className="class-avatar">
          {row.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </span>
        <span>
          <strong>{row.name}</strong>
          <small>{row.id}</small>
        </span>
      </div>
    ),
  },
  {
    id: "instructor",
    header: "Instructor",
    accessorKey: "instructor",
    sortable: true,
    width: 170,
  },
  { id: "start", header: "Time", accessorKey: "start", width: 190 },
  {
    id: "attendance",
    header: "Attendance",
    accessor: (row) => row.attendance,
    sortable: true,
    width: 145,
    render: (row) => (
      <div className="attendance-cell">
        <span>
          {row.attendance} <span className="muted">/ {row.capacity}</span>
        </span>
        <div className="attendance-track">
          <span
            style={{
              width: `${
                row.capacity ? (row.attendance / row.capacity) * 100 : 0
              }%`,
            }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "status",
    sortable: true,
    width: 145,
    render: (row) => statusBadge(row.status),
  },
];
const inventoryColumns: ColumnDef<InventoryItem>[] = [
  {
    id: "product",
    header: "Product",
    accessorKey: "product",
    sortable: true,
    pinned: true,
    width: 240,
    render: (row) => (
      <div className="class-cell">
        <span className="product-avatar">
          <Package size={17} />
        </span>
        <span>
          <strong>{row.product}</strong>
          <small>{row.sku}</small>
        </span>
      </div>
    ),
  },
  {
    id: "category",
    header: "Category",
    accessorKey: "category",
    sortable: true,
    width: 140,
  },
  {
    id: "stock",
    header: "Stock on hand",
    accessorKey: "stock",
    sortable: true,
    width: 140,
    render: (row) => (
      <strong className={row.stock < 10 ? "stock-low" : ""}>
        {row.stock} units
      </strong>
    ),
  },
  {
    id: "price",
    header: "Unit price",
    accessorKey: "price",
    sortable: true,
    width: 120,
    render: (row) => `$${row.price.toFixed(2)}`,
  },
  {
    id: "status",
    header: "Inventory status",
    accessorKey: "status",
    sortable: true,
    width: 160,
    render: (row) => statusBadge(row.status),
  },
];
const orderColumns: ColumnDef<OrderItem>[] = [
  {
    id: "id",
    header: "Order ID",
    accessorKey: "id",
    sortable: true,
    pinned: true,
    width: 150,
    render: (row) => <strong className="order-id">{row.id}</strong>,
  },
  {
    id: "customer",
    header: "Customer",
    accessorKey: "customer",
    sortable: true,
    width: 180,
    render: (row) => (
      <div>
        <strong>{row.customer}</strong>
        <small className="block muted">{row.email}</small>
      </div>
    ),
  },
  {
    id: "amount",
    header: "Amount",
    accessorKey: "amount",
    sortable: true,
    width: 120,
    render: (row) => <strong>${row.amount.toFixed(2)}</strong>,
  },
  {
    id: "placed",
    header: "Date placed",
    accessorKey: "placed",
    sortable: true,
    width: 150,
  },
  {
    id: "status",
    header: "Payment status",
    accessorKey: "status",
    sortable: true,
    width: 150,
    render: (row) => statusBadge(row.status),
  },
];

function csvValue(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function downloadCsv(
  filename: string,
  headers: string[],
  rows: unknown[][]
): void {
  const csv = [headers, ...rows]
    .map((row) => row.map(csvValue).join(","))
    .join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function AttendeeRow({ attendee }: { attendee: Attendee }) {
  return (
    <div className="attendee-row">
      <div className="attendee-person">
        <span className="attendee-avatar">
          {attendee.name
            .split(" ")
            .map((part) => part[0])
            .join("")}
        </span>
        <span>
          <strong>{attendee.name}</strong>
          <small>{attendee.email}</small>
        </span>
      </div>
      <div>{paymentBadge(attendee.payment)}</div>
      <div>{statusBadge(attendee.status)}</div>
    </div>
  );
}
function InventoryChild({ row }: { row: InventoryItem }) {
  return (
    <div className="inventory-detail">
      <span>
        <strong>Reorder point</strong>
        <small>10 units</small>
      </span>
      <span>
        <strong>Suggested action</strong>
        <small>
          {row.stock < 10 ? "Review replenishment" : "Stock level healthy"}
        </small>
      </span>
      <span>
        <strong>SKU</strong>
        <small>{row.sku}</small>
      </span>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<"classes" | "inventory" | "orders">(
    "classes"
  );
  const [childMode, setChildMode] = useState<"inline" | "on-demand">("inline");
  const [simulateServer, setSimulateServer] = useState(false);
  const [search, setSearch] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [serverSort, setServerSort] = useState<SortState>(null);
  const [serverPagination, setServerPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [serverBusy, setServerBusy] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("Just now");

  useEffect(() => {
    const initialFailureKey = "lumina-initial-load-failed";
    const shouldSimulateFailure =
      window.sessionStorage.getItem(initialFailureKey) !== "true";
    const timer = window.setTimeout(() => {
      setInitialLoading(false);
      if (shouldSimulateFailure) {
        window.sessionStorage.setItem(initialFailureKey, "true");
        setLoadError(
          "The initial data request failed. Please try again to reload the dashboard."
        );
      }
    }, 850);
    return () => window.clearTimeout(timer);
  }, []);
  const currentRows = useMemo(() => {
    if (view === "classes")
      return fitnessClasses.filter((row) =>
        `${row.name} ${row.instructor} ${row.status}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    if (view === "inventory")
      return inventoryItems.filter((row) =>
        `${row.product} ${row.sku} ${row.category} ${row.status}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    return orders.filter((row) =>
      `${row.id} ${row.customer} ${row.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [view, search]);
  const serverOrderRows = useMemo(() => {
    const copy = [...currentRows] as unknown as OrderItem[];
    if (serverSort) {
      const col = serverSort.key as keyof OrderItem;
      copy.sort((a, b) => {
        const av = a[col],
          bv = b[col];
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), undefined, {
                numeric: true,
                sensitivity: "base",
              });
        return serverSort.direction === "asc" ? cmp : -cmp;
      });
    }
    const start = serverPagination.pageIndex * serverPagination.pageSize;
    return copy.slice(start, start + serverPagination.pageSize);
  }, [currentRows, serverSort, serverPagination]);
  function retryInitialLoad() {
    setLoadError(null);
    setInitialLoading(true);
    window.setTimeout(() => {
      setInitialLoading(false);
      setLastUpdated("Just now");
    }, 650);
  }

  function exportCurrentRows() {
    if (view === "classes") {
      downloadCsv(
        "lumina-class-schedule.csv",
        ["Class ID", "Class", "Instructor", "Time", "Attendance", "Capacity", "Status"],
        (currentRows as FitnessClass[]).map((row) => [
          row.id,
          row.name,
          row.instructor,
          row.start,
          row.attendance,
          row.capacity,
          row.status,
        ])
      );
      return;
    }
    if (view === "inventory") {
      downloadCsv(
        "lumina-inventory.csv",
        ["ID", "SKU", "Product", "Category", "Stock", "Price", "Status"],
        (currentRows as InventoryItem[]).map((row) => [
          row.id,
          row.sku,
          row.product,
          row.category,
          row.stock,
          row.price,
          row.status,
        ])
      );
      return;
    }
    downloadCsv(
      "lumina-orders.csv",
      ["Order ID", "Customer", "Email", "Amount", "Date placed", "Status"],
      (currentRows as OrderItem[]).map((row) => [
        row.id,
        row.customer,
        row.email,
        row.amount,
        row.placed,
        row.status,
      ])
    );
  }

  function simulateServerRequest(action: () => void) {
    setServerBusy(true);
    window.setTimeout(() => {
      action();
      setServerBusy(false);
      setLastUpdated("Just now");
    }, 350);
  }
  function switchView(next: "classes" | "inventory" | "orders") {
    setView(next);
    setSearch("");
    setServerPagination({ pageIndex: 0, pageSize: 5 });
    setServerSort(null);
    setLoadError(null);
  }
  const summary =
    view === "classes"
      ? [
          {
            label: "Classes today",
            value: "12",
            icon: <CalendarDays size={17} />,
            tone: "blue",
          },
          {
            label: "Bookings",
            value: "109",
            icon: <Users size={17} />,
            tone: "violet",
          },
          {
            label: "Average fill rate",
            value: "72%",
            icon: <Activity size={17} />,
            tone: "green",
          },
          {
            label: "Next class",
            value: "10:00 AM",
            icon: <Clock3 size={17} />,
            tone: "orange",
          },
        ]
      : view === "inventory"
      ? [
          {
            label: "Unique products",
            value: "11",
            icon: <Package size={17} />,
            tone: "blue",
          },
          {
            label: "Low stock",
            value: "4",
            icon: <Layers3 size={17} />,
            tone: "orange",
          },
          {
            label: "Out of stock",
            value: "2",
            icon: <Activity size={17} />,
            tone: "violet",
          },
          {
            label: "Stock value",
            value: "$2,419",
            icon: <CheckCircle2 size={17} />,
            tone: "green",
          },
        ]
      : [
          {
            label: "Total orders",
            value: "37",
            icon: <Package size={17} />,
            tone: "blue",
          },
          {
            label: "Paid",
            value: "13",
            icon: <CheckCircle2 size={17} />,
            tone: "green",
          },
          {
            label: "Pending",
            value: "12",
            icon: <Clock3 size={17} />,
            tone: "orange",
          },
          {
            label: "Refunded",
            value: "12",
            icon: <Activity size={17} />,
            tone: "violet",
          },
        ];

  return (
    <div className="app-layout min-h-screen bg-slate-50 text-slate-800">
      <aside className="sidebar">
        <a className="sidebar-brand" href="#top">
          <span className="brand-symbol">L</span>
          <span>
            Lumina<span className="brand-period">.</span>
            <small>STUDIO MANAGER</small>
          </span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="side-nav">
          <button
            className={`side-link ${view === "classes" ? "active" : ""}`}
            onClick={() => switchView("classes")}
          >
            <CalendarDays size={18} /> Class schedule
          </button>
          <button
            className={`side-link ${view === "inventory" ? "active" : ""}`}
            onClick={() => switchView("inventory")}
          >
            <Package size={18} /> Inventory{" "}
            <span className="side-new">NEW</span>
          </button>
          <button
            className={`side-link ${view === "orders" ? "active" : ""}`}
            onClick={() => switchView("orders")}
          >
            <Layers3 size={18} /> Orders
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="profile">
            <div className="profile-avatar">MW</div>
            <span>
              <strong>Morgan Wells</strong>
              <small>Studio administrator</small>
            </span>
            <ChevronDown size={15} />
          </div>
        </div>
      </aside>
      <main className="main-area" id="top">
        <header className="topbar">
          <div className="breadcrumb">
            Workspace <span>/</span>{" "}
            <strong>
              {view === "classes"
                ? "Class schedule"
                : view === "inventory"
                ? "Inventory"
                : "Orders"}
            </strong>
          </div>
          <div className="topbar-actions">
            <span className="live-status">
              <i /> All systems operational
            </span>
            <button className="icon-button" aria-label="Help">
              <CircleHelp size={18} />
            </button>
            <div className="top-avatar">MW</div>
          </div>
        </header>
        <div className="page-content">
          <div className="page-title-row">
            <div>
              <div className="page-kicker">
                STUDIO OVERVIEW
              </div>
              <h1 id="table-title">
                {view === "classes"
                  ? "Class schedule"
                  : view === "inventory"
                  ? "Inventory overview"
                  : "Orders overview"}
              </h1>
              <p className="page-subtitle">
                {view === "classes"
                  ? "Keep your classes running smoothly and your community moving."
                  : view === "inventory"
                  ? "A second dataset showing the table is reusable."
                  : "Controlled server-side mode simulation for sorting and pagination."}
              </p>
            </div>
            <div className="title-actions">
              <button
                className="button button-secondary"
                onClick={exportCurrentRows}
              >
                <ArrowDownToLine size={15} /> Export
              </button>
              <button
                className="button button-primary"
                onClick={() => {
                  setLoadError(
                    "This workspace uses mock data; no record was created."
                  );
                }}
              >
                +{" "}
                {view === "classes"
                  ? "Add class"
                  : view === "inventory"
                  ? "Add product"
                  : "Create order"}
              </button>
            </div>
          </div>
          <div className="summary-grid">
            {summary.map((item) => (
              <article className="summary-card" key={item.label}>
                <div className="summary-top">
                  <span>{item.label}</span>
                  <span className={`summary-icon ${item.tone}`}>
                    {item.icon}
                  </span>
                </div>
                <strong className="summary-value">{item.value}</strong>
                <div className="summary-foot">
                  <span className="trend-up">↗</span>{" "}
                  <span>
                    {view === "classes"
                      ? "Updated for today"
                      : view === "inventory"
                      ? "Inventory snapshot"
                      : "Data snapshot"}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <section className="table-section">
            <div className="table-section-heading">
              <div>
                <h2>
                  {view === "classes"
                    ? "Today’s classes"
                    : view === "inventory"
                    ? "Product inventory"
                    : "Recent orders"}
                </h2>
                <p>
                  {view === "classes"
                    ? "Manage attendance, instructors, and class capacity."
                    : view === "inventory"
                    ? "Different row shape, same generic DataTable component."
                    : "Try sorting and changing pages to see controlled state in action."}
                </p>
              </div>
              <div className="updated-label">
                <span className="updated-dot" /> Updated {lastUpdated}
              </div>
            </div>
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setServerPagination((p) => ({ ...p, pageIndex: 0 }));
                  }}
                  placeholder={
                    view === "classes"
                      ? "Search classes or instructors…"
                      : view === "inventory"
                      ? "Search products or SKU…"
                      : "Search orders or customers…"
                  }
                  aria-label="Search table"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              <div className="toolbar-right">
                {view !== "orders" && (
                  <label className="mode-select">
                    <select
                      value={childMode}
                      onChange={(e) =>
                        setChildMode(e.target.value as "inline" | "on-demand")
                      }
                    >
                      <option value="inline">Inline rows</option>
                      <option value="on-demand">On-demand fetch</option>
                    </select>
                  </label>
                )}
                {view === "orders" && (
                  <label className="server-toggle">
                    <input
                      type="checkbox"
                      checked={simulateServer}
                      onChange={(e) => {
                        setSimulateServer(e.target.checked);
                        setServerPagination({ pageIndex: 0, pageSize: 5 });
                        setServerSort(null);
                      }}
                    />
                    <span>Server mode</span>
                  </label>
                )}
                <button
                  className="button button-secondary filter-button"
                  onClick={() => setSearch("")}
                >
                  <SlidersHorizontal size={15} /> Reset filters
                </button>
              </div>
            </div>
            {view === "orders" && (
              <div className="mode-note">
                <span className="mode-note-icon">
                  <Activity size={15} />
                </span>
                <span>
                  <strong>
                    {simulateServer
                      ? "Controlled server-side mode"
                      : "Client-side mode"}
                  </strong>{" "}
                  —{" "}
                  {simulateServer
                    ? "Parent owns sort and pagination state; mock requests are delayed to simulate a server."
                    : "Turn on Server mode to try controlled sorting and pagination."}
                </span>
              </div>
            )}
            {loadError && (
              <div className="demo-notice">
                <span>{loadError}</span>
                <button
                  onClick={() => setLoadError(null)}
                  aria-label="Dismiss notice"
                >
                  <X size={15} />
                </button>
              </div>
            )}
            {view === "classes" && (
              <DataTable<FitnessClass, Attendee>
                data={currentRows as FitnessClass[]}
                columns={classColumns}
                loading={initialLoading}
                error={loadError}
                onRetryInitialLoad={retryInitialLoad}
                initialPageSize={5}
                pageSizeOptions={[5, 10, 20]}
                childMode={childMode}
                getInlineChildren={(row) => row.attendees}
                renderChild={(attendee) => <AttendeeRow attendee={attendee} />}
                fetchChildren={async (row) => {
                  await new Promise((resolve, reject) =>
                    window.setTimeout(
                      () =>
                        row.id === "CLS-107"
                          ? reject(new Error("Sample child request failed"))
                          : resolve(null),
                      650
                    )
                  );
                  return row.attendees;
                }}
                renderOnDemandChild={(attendee) => (
                  <AttendeeRow attendee={attendee} />
                )}
                getChildrenErrorMessage={() =>
                  "Attendees could not be fetched for this class."
                }
              />
            )}
            {view === "inventory" && (
              <DataTable<InventoryItem, InventoryItem>
                data={currentRows as InventoryItem[]}
                columns={inventoryColumns}
                loading={initialLoading}
                error={loadError}
                onRetryInitialLoad={retryInitialLoad}
                initialPageSize={5}
                pageSizeOptions={[5, 10, 20]}
                childMode={childMode}
                getInlineChildren={(row) => [row]}
                renderChild={(row) => <InventoryChild row={row} />}
                fetchChildren={async (row) => {
                  await new Promise((resolve) =>
                    window.setTimeout(resolve, 500)
                  );
                  return [row];
                }}
                renderOnDemandChild={(row) => <InventoryChild row={row} />}
              />
            )}
            {view === "orders" && (
              <DataTable<OrderItem, never>
                data={
                  (simulateServer
                    ? serverOrderRows
                    : currentRows) as unknown as OrderItem[]
                }
                columns={orderColumns}
                loading={serverBusy || initialLoading}
                error={loadError}
                onRetryInitialLoad={retryInitialLoad}
                initialPageSize={5}
                pageSizeOptions={[5, 10, 20]}
                childMode="inline"
                getInlineChildren={() => []}
                renderChild={() => null}
                manualSorting={simulateServer}
                manualPagination={simulateServer}
                totalCount={simulateServer ? currentRows.length : undefined}
                sortState={simulateServer ? serverSort : undefined}
                onSortChange={
                  simulateServer
                    ? (next) => simulateServerRequest(() => setServerSort(next))
                    : undefined
                }
                pagination={simulateServer ? serverPagination : undefined}
                onPaginationChange={
                  simulateServer
                    ? (next) =>
                        simulateServerRequest(() => setServerPagination(next))
                    : undefined
                }
              />
            )}
            <div className="table-footnote">
              <span>
                <span className="footnote-check">✓</span> All changes are local
                to this workspace
              </span>
            </div>
          </section>
          <footer className="page-footer">
            <span>© 2026 Lumina Studio Manager</span>
          </footer>
        </div>
      </main>
    </div>
  );
}
