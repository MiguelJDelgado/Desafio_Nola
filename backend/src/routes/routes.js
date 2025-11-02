import express from "express";
import SalesAnalyticsController from "../controllers/SalesAnalyticsController.js";
import ProductAnalyticsController from "../controllers/ProductAnalyticsController.js";
import CustomerAnalyticsController from "../controllers/CustomerAnalyticsController.js";
import ChannelAnalyticsController from "../controllers/ChannelAnalyticsController.js";
import DynamicAnalyticsController from "../controllers/DynamicAnalyticsController.js";

const router = express.Router();

router.get("/analytics/sales-summary", SalesAnalyticsController.salesSummary);
router.get("/analytics/ticket-average", SalesAnalyticsController.ticketAverage);
router.get("/analytics/delivery-times", SalesAnalyticsController.deliveryTimes);
router.get("/analytics/sales-by-day-of-week", SalesAnalyticsController.salesByDayOfWeek);

router.get("/analytics/top-products", ProductAnalyticsController.topProducts);
router.get("/analytics/top-categories-by-store", ProductAnalyticsController.topCategoriesByStore);

router.get("/analytics/recurring-customers", CustomerAnalyticsController.recurringCustomers);

router.get("/analytics/revenue-by-channel", ChannelAnalyticsController.revenueByChannel);

router.post("/analytics/dynamic", DynamicAnalyticsController.dynamicAnalytics);

export default router;
