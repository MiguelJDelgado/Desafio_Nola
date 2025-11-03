// services/analyticsSalesService.js
import api from "./api";

export const salesSummary = (params = {}) =>
  api.get("/analytics/sales-summary", { params }).then(r => r.data);

export const ticketAverage = (params = {}) =>
  api.get("/analytics/ticket-average", { params }).then(r => r.data);

export const deliveryTimes = (params = {}) =>
  api.get("/analytics/delivery-times", { params }).then(r => r.data);

export const salesByDayOfWeek = (params = {}) =>
  api.get("/analytics/sales-by-day-of-week", { params }).then(r => r.data);

export const salesByStatus = (params = {}) =>
  api.get("/analytics/sales-by-status", { params }).then(r => r.data);

export const salesByHour = (params = {}) =>
  api.get("/analytics/sales-by-hour", { params }).then(r => r.data);

export const topStores = (params = {}) =>
  api.get("/analytics/top-stores", { params }).then(r => r.data);

export const salesBySubBrand = (params = {}) =>
  api.get("/analytics/sales-by-sub-brand", { params }).then(r => r.data);
