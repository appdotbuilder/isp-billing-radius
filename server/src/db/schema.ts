
import { 
  serial, 
  text, 
  pgTable, 
  timestamp, 
  numeric, 
  integer,
  boolean,
  pgEnum
} from 'drizzle-orm/pg-core';

// Define enums
export const serviceTypeEnum = pgEnum('service_type', ['rtrwnet', 'hotspot']);
export const packageTypeEnum = pgEnum('package_type', ['unlimited', 'quota', 'time']);
export const customerStatusEnum = pgEnum('customer_status', ['active', 'suspended', 'terminated']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const voucherStatusEnum = pgEnum('voucher_status', ['active', 'used', 'expired', 'disabled']);

// Customers table
export const customersTable = pgTable('customers', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  full_name: text('full_name').notNull(),
  email: text('email'),
  phone: text('phone'),
  address: text('address'),
  service_type: serviceTypeEnum('service_type').notNull(),
  status: customerStatusEnum('status').notNull().default('active'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Service packages table
export const servicePackagesTable = pgTable('service_packages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  package_type: packageTypeEnum('package_type').notNull(),
  speed_limit: integer('speed_limit'), // in Mbps
  data_quota: integer('data_quota'), // in MB
  time_limit: integer('time_limit'), // in minutes
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  service_type: serviceTypeEnum('service_type').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Customer subscriptions table
export const customerSubscriptionsTable = pgTable('customer_subscriptions', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull(),
  package_id: integer('package_id').notNull(),
  start_date: timestamp('start_date').notNull(),
  end_date: timestamp('end_date'),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Invoices table
export const invoicesTable = pgTable('invoices', {
  id: serial('id').primaryKey(),
  customer_id: integer('customer_id').notNull(),
  invoice_number: text('invoice_number').notNull().unique(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  due_date: timestamp('due_date').notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Payments table
export const paymentsTable = pgTable('payments', {
  id: serial('id').primaryKey(),
  invoice_id: integer('invoice_id').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  payment_method: text('payment_method').notNull(),
  status: paymentStatusEnum('status').notNull().default('pending'),
  transaction_id: text('transaction_id'),
  notes: text('notes'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Hotspot vouchers table
export const hotspotVouchersTable = pgTable('hotspot_vouchers', {
  id: serial('id').primaryKey(),
  code: text('code').notNull().unique(),
  package_id: integer('package_id').notNull(),
  status: voucherStatusEnum('status').notNull().default('active'),
  created_by: integer('created_by'),
  used_by: text('used_by'),
  used_at: timestamp('used_at'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Radius accounting table
export const radiusAccountingTable = pgTable('radius_accounting', {
  id: serial('id').primaryKey(),
  username: text('username').notNull(),
  session_id: text('session_id').notNull(),
  start_time: timestamp('start_time'),
  stop_time: timestamp('stop_time'),
  session_time: integer('session_time'), // in seconds
  input_octets: integer('input_octets'),
  output_octets: integer('output_octets'),
  nas_ip_address: text('nas_ip_address'),
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Export all tables for relation queries
export const tables = {
  customers: customersTable,
  servicePackages: servicePackagesTable,
  customerSubscriptions: customerSubscriptionsTable,
  invoices: invoicesTable,
  payments: paymentsTable,
  hotspotVouchers: hotspotVouchersTable,
  radiusAccounting: radiusAccountingTable
};
