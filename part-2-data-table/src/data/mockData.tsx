import type { ReactNode } from "react";
export type BookingStatus = "Booked" | "Checked-in" | "Cancelled" | "No-show";
export type PaymentType = "One-time" | "Package" | "Membership";
export type Attendee = {
  id: string;
  name: string;
  email: string;
  payment: PaymentType;
  status: BookingStatus;
};
export type FitnessClass = {
  id: string;
  name: string;
  instructor: string;
  start: string;
  attendance: number;
  capacity: number;
  status: "Scheduled" | "Full" | "Cancelled";
  attendees: Attendee[];
};
export type InventoryItem = {
  id: string;
  sku: string;
  product: string;
  category: string;
  stock: number;
  price: number;
  status: "In stock" | "Low stock" | "Out of stock";
};
export type OrderItem = {
  id: string;
  customer: string;
  email: string;
  amount: number;
  placed: string;
  status: "Paid" | "Pending" | "Refunded";
};

export const fitnessClasses: FitnessClass[] = [
  {
    id: "CLS-104",
    name: "Yoga Flow",
    instructor: "Maya Chen",
    start: "10:00 AM – 11:00 AM",
    attendance: 12,
    capacity: 15,
    status: "Scheduled",
    attendees: [
      {
        id: "A-1",
        name: "Emily Chen",
        email: "emily@example.com",
        payment: "Membership",
        status: "Checked-in",
      },
      {
        id: "A-2",
        name: "David Tan",
        email: "david@example.com",
        payment: "One-time",
        status: "Booked",
      },
    ],
  },
  {
    id: "CLS-105",
    name: "Pilates Reformer",
    instructor: "Jordan Blake",
    start: "11:30 AM – 12:30 PM",
    attendance: 15,
    capacity: 15,
    status: "Full",
    attendees: [
      {
        id: "A-4",
        name: "Olivia Martin",
        email: "olivia@example.com",
        payment: "Package",
        status: "Checked-in",
      },
      {
        id: "A-5",
        name: "Noah Wilson",
        email: "noah@example.com",
        payment: "Membership",
        status: "Booked",
      },
    ],
  },
  {
    id: "CLS-106",
    name: "Strength Basics",
    instructor: "Alex Rivera",
    start: "01:00 PM – 02:00 PM",
    attendance: 8,
    capacity: 12,
    status: "Scheduled",
    attendees: [
      {
        id: "A-6",
        name: "Ava Thompson",
        email: "ava@example.com",
        payment: "One-time",
        status: "No-show",
      },
      {
        id: "A-7",
        name: "Liam Garcia",
        email: "liam@example.com",
        payment: "Membership",
        status: "Booked",
      },
    ],
  },
  {
    id: "CLS-107",
    name: "Spin Express",
    instructor: "Taylor Kim",
    start: "02:30 PM – 03:15 PM",
    attendance: 0,
    capacity: 20,
    status: "Cancelled",
    attendees: [],
  },
  {
    id: "CLS-108",
    name: "Barre Burn",
    instructor: "Maya Chen",
    start: "04:00 PM – 05:00 PM",
    attendance: 9,
    capacity: 12,
    status: "Scheduled",
    attendees: [
      {
        id: "A-8",
        name: "Isabella Brown",
        email: "isabella@example.com",
        payment: "Package",
        status: "Booked",
      },
    ],
  },
  {
    id: "CLS-109",
    name: "Recovery Stretch",
    instructor: "Jordan Blake",
    start: "05:30 PM – 06:15 PM",
    attendance: 6,
    capacity: 10,
    status: "Scheduled",
    attendees: [],
  },
  {
    id: "CLS-110",
    name: "Power Yoga",
    instructor: "Alex Rivera",
    start: "06:30 PM – 07:30 PM",
    attendance: 10,
    capacity: 10,
    status: "Full",
    attendees: [
      {
        id: "A-9",
        name: "Ethan Davis",
        email: "ethan@example.com",
        payment: "Membership",
        status: "Checked-in",
      },
    ],
  },
  {
    id: "CLS-111",
    name: "Mobility Lab",
    instructor: "Taylor Kim",
    start: "07:45 PM – 08:30 PM",
    attendance: 4,
    capacity: 12,
    status: "Scheduled",
    attendees: [],
  },
  {
    id: "CLS-112",
    name: "Morning Flow",
    instructor: "Maya Chen",
    start: "08:00 AM – 09:00 AM",
    attendance: 11,
    capacity: 15,
    status: "Scheduled",
    attendees: [],
  },
];

export const inventoryItems: InventoryItem[] = [
  {
    id: "INV-301",
    sku: "MAT-001",
    product: "Studio Yoga Mat",
    category: "Equipment",
    stock: 48,
    price: 32,
    status: "In stock",
  },
  {
    id: "INV-302",
    sku: "BOT-014",
    product: "Insulated Water Bottle",
    category: "Accessories",
    stock: 8,
    price: 24,
    status: "Low stock",
  },
  {
    id: "INV-303",
    sku: "BLK-009",
    product: "Cork Yoga Block",
    category: "Equipment",
    stock: 0,
    price: 14,
    status: "Out of stock",
  },
  {
    id: "INV-304",
    sku: "TWL-021",
    product: "Quick-dry Towel",
    category: "Accessories",
    stock: 31,
    price: 18,
    status: "In stock",
  },
  {
    id: "INV-305",
    sku: "BND-004",
    product: "Resistance Band Set",
    category: "Training",
    stock: 6,
    price: 19,
    status: "Low stock",
  },
  {
    id: "INV-306",
    sku: "STR-017",
    product: "Stretch Strap",
    category: "Training",
    stock: 22,
    price: 12,
    status: "In stock",
  },
  {
    id: "INV-307",
    sku: "ROL-003",
    product: "Foam Roller",
    category: "Recovery",
    stock: 0,
    price: 29,
    status: "Out of stock",
  },
  {
    id: "INV-308",
    sku: "BAG-010",
    product: "Everyday Gym Tote",
    category: "Accessories",
    stock: 17,
    price: 38,
    status: "In stock",
  },
  {
    id: "INV-309",
    sku: "MAT-002",
    product: "Travel Mat",
    category: "Equipment",
    stock: 5,
    price: 42,
    status: "Low stock",
  },
  {
    id: "INV-310",
    sku: "STR-018",
    product: "Ankle Weights",
    category: "Training",
    stock: 14,
    price: 27,
    status: "In stock",
  },
  {
    id: "INV-311",
    sku: "BOT-015",
    product: "Shaker Bottle",
    category: "Accessories",
    stock: 27,
    price: 16,
    status: "In stock",
  },
];

export const orders: OrderItem[] = Array.from({ length: 37 }, (_, i) => ({
  id: `ORD-${2401 + i}`,
  customer: [
    "Avery Johnson",
    "Morgan Lee",
    "Riley Patel",
    "Casey Nguyen",
    "Jamie Smith",
  ][i % 5],
  email: [
    "avery@example.com",
    "morgan@example.com",
    "riley@example.com",
    "casey@example.com",
    "jamie@example.com",
  ][i % 5],
  amount: [89, 124, 45, 210, 68][i % 5],
  placed: `${["Oct 12", "Oct 11", "Oct 10", "Oct 09", "Oct 08"][i % 5]}, 2026`,
  status: ["Paid", "Pending", "Refunded"][i % 3] as OrderItem["status"],
}));

export function statusBadge(status: string): ReactNode {
  const cls =
    status === "Scheduled" ||
    status === "In stock" ||
    status === "Paid" ||
    status === "Checked-in" ||
    status === "Booked"
      ? "badge badge-green"
      : status === "Full" || status === "Low stock" || status === "Pending"
      ? "badge badge-amber"
      : "badge badge-gray";
  return (
    <span className={cls}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}
export function paymentBadge(payment: PaymentType): ReactNode {
  return <span className="payment-label">{payment}</span>;
}
