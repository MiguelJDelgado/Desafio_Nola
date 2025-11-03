// services/analyticsCouponsService.js
import api from "./api";

export const couponSalesDistribution = (params = {}) =>
  api.get("/analytics/coupon-sales-distribution", { params }).then(r => r.data);

export const couponImpactOnAvgTicket = (params = {}) =>
  api.get("/analytics/coupon-impact-on-avg-ticket", { params }).then(r => r.data);

export const topUsedCoupons = (params = {}) =>
  api.get("/analytics/top-used-coupons", { params }).then(r => r.data);

export const totalSalesWithCoupon = (params = {}) =>
  api.get("/analytics/total-sales-with-coupon", { params }).then(r => r.data);

export const totalDiscountGiven = (params = {}) =>
  api.get("/analytics/total-discount-given", { params }).then(r => r.data);
