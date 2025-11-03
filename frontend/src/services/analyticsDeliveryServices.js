// services/analyticsDeliveryService.js
import api from "./api";

export const averageDeliveryTime = (params = {}) =>
  api.get("/analytics/average-delivery-time", { params }).then(r => r.data);

export const averageProductionTime = (params = {}) =>
  api.get("/analytics/average-production-time", { params }).then(r => r.data);

export const performanceByCarrier = (params = {}) =>
  api.get("/analytics/performance-by-carrier", { params }).then(r => r.data);

export const deliveryRevenueByChannel = (params = {}) =>
  api.get("/analytics/delivery-revenue", { params }).then(r => r.data);

export const topCities = (params = {}) =>
  api.get("/analytics/top-cities", { params }).then(r => r.data);
