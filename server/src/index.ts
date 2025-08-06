
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import { 
  createCustomerInputSchema,
  updateCustomerInputSchema,
  createServicePackageInputSchema,
  createCustomerSubscriptionInputSchema,
  createInvoiceInputSchema,
  createPaymentInputSchema,
  createHotspotVoucherInputSchema,
  radiusAuthInputSchema
} from './schema';

// Import handlers
import { createCustomer } from './handlers/create_customer';
import { getCustomers } from './handlers/get_customers';
import { updateCustomer } from './handlers/update_customer';
import { deleteCustomer } from './handlers/delete_customer';
import { createServicePackage } from './handlers/create_service_package';
import { getServicePackages } from './handlers/get_service_packages';
import { createCustomerSubscription } from './handlers/create_customer_subscription';
import { createInvoice } from './handlers/create_invoice';
import { getInvoices } from './handlers/get_invoices';
import { createPayment } from './handlers/create_payment';
import { getPayments } from './handlers/get_payments';
import { createHotspotVouchers } from './handlers/create_hotspot_vouchers';
import { getHotspotVouchers } from './handlers/get_hotspot_vouchers';
import { radiusAuthenticate } from './handlers/radius_authenticate';
import { recordRadiusAccounting } from './handlers/radius_accounting';
import { getDashboardStats } from './handlers/get_dashboard_stats';
import { getActiveSessions } from './handlers/get_active_sessions';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Customer Management
  createCustomer: publicProcedure
    .input(createCustomerInputSchema)
    .mutation(({ input }) => createCustomer(input)),
  
  getCustomers: publicProcedure
    .query(() => getCustomers()),
  
  updateCustomer: publicProcedure
    .input(updateCustomerInputSchema)
    .mutation(({ input }) => updateCustomer(input)),
  
  deleteCustomer: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => deleteCustomer(input.id)),

  // Service Package Management
  createServicePackage: publicProcedure
    .input(createServicePackageInputSchema)
    .mutation(({ input }) => createServicePackage(input)),
  
  getServicePackages: publicProcedure
    .query(() => getServicePackages()),

  // Customer Subscriptions
  createCustomerSubscription: publicProcedure
    .input(createCustomerSubscriptionInputSchema)
    .mutation(({ input }) => createCustomerSubscription(input)),

  // Billing Management
  createInvoice: publicProcedure
    .input(createInvoiceInputSchema)
    .mutation(({ input }) => createInvoice(input)),
  
  getInvoices: publicProcedure
    .query(() => getInvoices()),
  
  createPayment: publicProcedure
    .input(createPaymentInputSchema)
    .mutation(({ input }) => createPayment(input)),
  
  getPayments: publicProcedure
    .query(() => getPayments()),

  // Hotspot Voucher Management
  createHotspotVouchers: publicProcedure
    .input(createHotspotVoucherInputSchema)
    .mutation(({ input }) => createHotspotVouchers(input)),
  
  getHotspotVouchers: publicProcedure
    .query(() => getHotspotVouchers()),

  // RADIUS Server Functions
  radiusAuthenticate: publicProcedure
    .input(radiusAuthInputSchema)
    .mutation(({ input }) => radiusAuthenticate(input)),
  
  getActiveSessions: publicProcedure
    .query(() => getActiveSessions()),

  // Dashboard and Reporting
  getDashboardStats: publicProcedure
    .query(() => getDashboardStats()),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`RTRWNet Billing & RADIUS Server listening at port: ${port}`);
}

start();
