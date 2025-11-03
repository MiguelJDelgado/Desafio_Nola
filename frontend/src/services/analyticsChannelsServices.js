// services/analyticsChannelsService.js
import api from "./api";

export const deliveryVsPresencial = (params = {}) =>
  api.get("/analytics/delivery-vs-presencial", { params }).then(r => r.data);

export const salesCountByChannel = (params = {}) =>
  api.get("/analytics/sales-count-by-channel", { params }).then(r => r.data);

export const avgTicketByChannel = (params = {}) =>
  api.get("/analytics/avg-ticket-by-channel", { params }).then(r => r.data);

export const deliveryRate = (params = {}) =>
  api.get("/analytics/delivery-rate", { params }).then(r => r.data);

export const lastOrders = (params = {}) =>
  api.get("/analytics/last-orders", { params }).then(r => r.data);
