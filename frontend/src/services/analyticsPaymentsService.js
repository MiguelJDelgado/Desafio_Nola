// services/analyticsPaymentsService.js
import api from "./api";

export const revenueByPaymentMethod = (params = {}) =>
  api.get("/analytics/revenue-by-payment-method", { params }).then(r => r.data);

export const voucherPayment = (params = {}) =>
  api.get("/analytics/voucher-payment", { params }).then(r => r.data);

export const avgTicketByPayment = (params = {}) =>
  api.get("/analytics/avg-ticket-by-payment", { params }).then(r => r.data);

export const lastCancelledOrRefunded = (params = {}) =>
  api.get("/analytics/last-cancelled-or-refunded", { params }).then(r => r.data);

export const topPayments = (params = {}) =>
  api.get("/analytics/top-payments", { params }).then(r => r.data);
