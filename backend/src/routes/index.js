import express from "express";
import AnalyticsController from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics/top-products", AnalyticsController.topProducts);
router.get("/analytics/ticket-average", AnalyticsController.ticketAverage);
router.get("/analytics/delivery-times", AnalyticsController.deliveryTimes);
router.get("/analytics/recurring-customers", AnalyticsController.recurringCustomers);
router.post("/analytics/dynamic", AnalyticsController.dynamicAnalytics);
router.get("/analytics/sales-summary", AnalyticsController.salesSummary);
router.get("/analytics/revenue-by-channel", AnalyticsController.revenueByChannel);
router.get("/analytics/top-categories", AnalyticsController.topCategories);
router.get("/analytics/sales-by-day", AnalyticsController.salesByDayOfWeek);

export default router;
