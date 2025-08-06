
import { z } from 'zod';

// Enums
export const serviceTypeEnum = z.enum(['rtrwnet', 'hotspot']);
export const packageTypeEnum = z.enum(['unlimited', 'quota', 'time']);
export const customerStatusEnum = z.enum(['active', 'suspended', 'terminated']);
export const invoiceStatusEnum = z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']);
export const paymentStatusEnum = z.enum(['pending', 'completed', 'failed', 'refunded']);
export const voucherStatusEnum = z.enum(['active', 'used', 'expired', 'disabled']);

// Customer schema
export const customerSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  full_name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  service_type: serviceTypeEnum,
  status: customerStatusEnum,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Customer = z.infer<typeof customerSchema>;

export const createCustomerInputSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  full_name: z.string().min(1),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  service_type: serviceTypeEnum,
  status: customerStatusEnum.default('active')
});

export type CreateCustomerInput = z.infer<typeof createCustomerInputSchema>;

export const updateCustomerInputSchema = z.object({
  id: z.number(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).optional(),
  full_name: z.string().min(1).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  service_type: serviceTypeEnum.optional(),
  status: customerStatusEnum.optional()
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>;

// Service Package schema
export const servicePackageSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  package_type: packageTypeEnum,
  speed_limit: z.number().nullable(), // in Mbps
  data_quota: z.number().nullable(), // in MB
  time_limit: z.number().nullable(), // in minutes
  price: z.number(),
  service_type: serviceTypeEnum,
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ServicePackage = z.infer<typeof servicePackageSchema>;

export const createServicePackageInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  package_type: packageTypeEnum,
  speed_limit: z.number().positive().nullable(),
  data_quota: z.number().positive().nullable(),
  time_limit: z.number().positive().nullable(),
  price: z.number().positive(),
  service_type: serviceTypeEnum,
  is_active: z.boolean().default(true)
});

export type CreateServicePackageInput = z.infer<typeof createServicePackageInputSchema>;

// Invoice schema
export const invoiceSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  invoice_number: z.string(),
  amount: z.number(),
  due_date: z.coerce.date(),
  status: invoiceStatusEnum,
  description: z.string().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Invoice = z.infer<typeof invoiceSchema>;

export const createInvoiceInputSchema = z.object({
  customer_id: z.number(),
  amount: z.number().positive(),
  due_date: z.coerce.date(),
  description: z.string().nullable()
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceInputSchema>;

// Payment schema
export const paymentSchema = z.object({
  id: z.number(),
  invoice_id: z.number(),
  amount: z.number(),
  payment_method: z.string(),
  status: paymentStatusEnum,
  transaction_id: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.coerce.date()
});

export type Payment = z.infer<typeof paymentSchema>;

export const createPaymentInputSchema = z.object({
  invoice_id: z.number(),
  amount: z.number().positive(),
  payment_method: z.string(),
  transaction_id: z.string().nullable(),
  notes: z.string().nullable()
});

export type CreatePaymentInput = z.infer<typeof createPaymentInputSchema>;

// Customer Subscription schema
export const customerSubscriptionSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  package_id: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type CustomerSubscription = z.infer<typeof customerSubscriptionSchema>;

export const createCustomerSubscriptionInputSchema = z.object({
  customer_id: z.number(),
  package_id: z.number(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().nullable()
});

export type CreateCustomerSubscriptionInput = z.infer<typeof createCustomerSubscriptionInputSchema>;

// Hotspot Voucher schema
export const hotspotVoucherSchema = z.object({
  id: z.number(),
  code: z.string(),
  package_id: z.number(),
  status: voucherStatusEnum,
  created_by: z.number().nullable(),
  used_by: z.string().nullable(),
  used_at: z.coerce.date().nullable(),
  expires_at: z.coerce.date().nullable(),
  created_at: z.coerce.date()
});

export type HotspotVoucher = z.infer<typeof hotspotVoucherSchema>;

export const createHotspotVoucherInputSchema = z.object({
  package_id: z.number(),
  expires_at: z.coerce.date().nullable(),
  quantity: z.number().int().positive().default(1)
});

export type CreateHotspotVoucherInput = z.infer<typeof createHotspotVoucherInputSchema>;

// Radius Accounting schema
export const radiusAccountingSchema = z.object({
  id: z.number(),
  username: z.string(),
  session_id: z.string(),
  start_time: z.coerce.date().nullable(),
  stop_time: z.coerce.date().nullable(),
  session_time: z.number().nullable(), // in seconds
  input_octets: z.number().nullable(),
  output_octets: z.number().nullable(),
  nas_ip_address: z.string().nullable(),
  created_at: z.coerce.date()
});

export type RadiusAccounting = z.infer<typeof radiusAccountingSchema>;

// Dashboard stats schema
export const dashboardStatsSchema = z.object({
  total_customers: z.number(),
  active_customers: z.number(),
  total_revenue: z.number(),
  pending_invoices: z.number(),
  active_sessions: z.number(),
  total_vouchers: z.number(),
  used_vouchers: z.number()
});

export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

// Auth schema
export const radiusAuthInputSchema = z.object({
  username: z.string(),
  password: z.string(),
  nas_ip_address: z.string().nullable()
});

export type RadiusAuthInput = z.infer<typeof radiusAuthInputSchema>;

export const radiusAuthResponseSchema = z.object({
  access_accept: z.boolean(),
  reply_attributes: z.record(z.string(), z.any()).optional()
});

export type RadiusAuthResponse = z.infer<typeof radiusAuthResponseSchema>;
