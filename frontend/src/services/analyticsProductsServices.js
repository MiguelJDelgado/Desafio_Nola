// services/analyticsProductsService.js
import api from "./api";

export const topProducts = (params = {}) =>
  api.get("/analytics/top-products", { params }).then(r => r.data);

export const topCategoriesByStore = (params = {}) =>
  api.get("/analytics/top-categories-by-store", { params }).then(r => r.data);

export const revenueByProduct = (params = {}) =>
  api.get("/analytics/revenue-by-product", { params }).then(r => r.data);

export const profitMarginByProduct = (params = {}) =>
  api.get("/analytics/profit-margin-by-product", { params }).then(r => r.data);

export const lowTurnoverProducts = (params = {}) =>
  api.get("/analytics/low-turnover-products", { params }).then(r => r.data);
