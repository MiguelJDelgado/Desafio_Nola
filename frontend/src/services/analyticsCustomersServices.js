// services/analyticsCustomersService.js
import api from "./api";

export const newCustomers = (params = {}) =>
  api.get("/analytics/new-customers", { params }).then(r => r.data);

export const activeInactiveCustomers = (params = {}) =>
  api.get("/analytics/active-inactive-customers", { params }).then(r => r.data);

export const genderDistribution = (params = {}) =>
  api.get("/analytics/gender-distribution", { params }).then(r => r.data);

export const ageDistribution = (params = {}) =>
  api.get("/analytics/age-distribution", { params }).then(r => r.data);

export const customerRetention = (params = {}) =>
  api.get("/analytics/customer-retention", { params }).then(r => r.data);
