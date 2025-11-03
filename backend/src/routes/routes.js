import express from "express";
import SalesAnalyticsController from "../controllers/SalesAnalyticsController.js";
import ProductAnalyticsController from "../controllers/ProductAnalyticsController.js";
import CustomerAnalyticsController from "../controllers/CustomerAnalyticsController.js";
import ChannelAnalyticsController from "../controllers/ChannelAnalyticsController.js";
import DynamicAnalyticsController from "../controllers/DynamicAnalyticsController.js";
import DeliveryAnalyticsController from "../controllers/DeliveryAnalyticsController.js";
import PaymentAnalyticsController from "../controllers/PaymentAnalyticsControlller.js";
import CouponAnalyticsController from "../controllers/CouponAnalyticsController.js";

const router = express.Router();

router.get("/analytics/sales-summary", SalesAnalyticsController.salesSummary);
router.get("/analytics/ticket-average", SalesAnalyticsController.ticketAverage);
router.get("/analytics/delivery-times", SalesAnalyticsController.deliveryTimes);
router.get("/analytics/sales-by-day-of-week", SalesAnalyticsController.salesByDayOfWeek);
router.get("/analytics/sales-by-status", SalesAnalyticsController.salesByStatus);
router.get("/analytics/sales-by-hour", SalesAnalyticsController.salesByHour);
router.get("/analytics/top-stores", SalesAnalyticsController.topStores);
router.get("/analytics/sales-by-sub-brand", SalesAnalyticsController.salesBySubBrand);

router.get("/analytics/top-products", ProductAnalyticsController.topProducts);
router.get("/analytics/top-categories-by-store", ProductAnalyticsController.topCategoriesByStore);
router.get("/analytics/revenue-by-product", ProductAnalyticsController.revenueByProduct);
router.get("/analytics/profit-margin-by-product", ProductAnalyticsController.profitMarginByProduct);
router.get("/analytics/low-turnover-products", ProductAnalyticsController.lowTurnoverProducts);

router.get("/analytics/new-customers", CustomerAnalyticsController.newCustomers);
router.get("/analytics/active-inactive-customers", CustomerAnalyticsController.activeInactiveCustomers);
router.get("/analytics/gender-distribution", CustomerAnalyticsController.genderDistribution);
router.get("/analytics/age-distribution", CustomerAnalyticsController.ageDistribution);
router.get("/analytics/customer-retention", CustomerAnalyticsController.customerRetention);

router.get("/analytics/delivery-vs-presencial", ChannelAnalyticsController.deliveryVsPresencial);
router.get("/analytics/sales-count-by-channel", ChannelAnalyticsController.salesCountByChannel);
router.get("/analytics/avg-ticket-by-channel", ChannelAnalyticsController.avgTicketByChannel);
router.get("/analytics/delivery-rate", ChannelAnalyticsController.deliveryRate);
router.get("/analytics/last-orders", ChannelAnalyticsController.lastOrders);

router.get("/analytics/average-delivery-time", DeliveryAnalyticsController.averageDeliveryTime);
router.get("/analytics/average-production-time", DeliveryAnalyticsController.averageProductionTime);
router.get("/analytics/performance-by-carrier", DeliveryAnalyticsController.performanceByCarrier);
router.get("/analytics/delivery-revenue", DeliveryAnalyticsController.deliveryRevenueByChannel);
router.get("/analytics/top-cities", DeliveryAnalyticsController.topCities);

router.get("/analytics/revenue-by-payment-method", PaymentAnalyticsController.revenueByPaymentMethod);
router.get("/analytics/voucher-payment", PaymentAnalyticsController.voucherPayment);
router.get("/analytics/avg-ticket-by-payment", PaymentAnalyticsController.avgTicketByPayment);
router.get("/analytics/last-cancelled-or-refunded", PaymentAnalyticsController.lastCancelledOrRefunded);
router.get("/analytics/top-payments", PaymentAnalyticsController.topPayments);

router.get("/analytics/coupon-sales-distribution", CouponAnalyticsController.couponSalesDistribution);
router.get("/analytics/coupon-impact-on-avg-ticket", CouponAnalyticsController.couponImpactOnAvgTicket);
router.get("/analytics/top-used-coupons", CouponAnalyticsController.topUsedCoupons);
router.get("/analytics/total-sales-with-coupon", CouponAnalyticsController.totalSalesWithCoupon);
router.get("/analytics/total-discount-given", CouponAnalyticsController.totalDiscountGiven);

router.post("/analytics/dynamic", DynamicAnalyticsController.dynamicAnalytics);

export default router;
