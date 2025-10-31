import { sequelize, Sale, ProductSale, Product, Channel, Customer } from "../models/index.js";
import { QueryTypes } from "sequelize";

const AnalyticsController = {

  topProducts: async (req, res) => {
    try {
      const { store_id, channel_id, day_of_week } = req.query;

      let query = `
        SELECT ps.product_id, p.name, SUM(ps.quantity) AS total_qty, SUM(ps.total_price) AS total_revenue
        FROM product_sales ps
        JOIN sales s ON s.id = ps.sale_id
        JOIN products p ON p.id = ps.product_id
        WHERE 1=1
      `;

      if (store_id) query += ` AND s.store_id = ${store_id}`;
      if (channel_id) query += ` AND s.channel_id = ${channel_id}`;
      if (day_of_week) query += ` AND EXTRACT(DOW FROM s.created_at) = ${day_of_week}`;

      query += ` GROUP BY ps.product_id, p.name ORDER BY total_qty DESC LIMIT 10`;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar top products" });
    }
  },

  ticketAverage: async (req, res) => {
    try {
      const { store_id, channel_id } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (channel_id) whereClause += ` AND channel_id = ${channel_id}`;

      const query = `
        SELECT
          AVG(total_amount) AS avg_ticket,
          store_id,
          channel_id
        FROM sales
        ${whereClause}
        GROUP BY store_id, channel_id
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular ticket médio" });
    }
  },

  deliveryTimes: async (req, res) => {
    try {
      const { store_id } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;

      const query = `
        SELECT
          EXTRACT(DOW FROM created_at) AS day_of_week,
          EXTRACT(HOUR FROM created_at) AS hour_of_day,
          AVG(delivery_seconds) AS avg_delivery
        FROM sales
        ${whereClause}
        GROUP BY day_of_week, hour_of_day
        ORDER BY day_of_week, hour_of_day
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular tempos de entrega" });
    }
  },

  recurringCustomers: async (req, res) => {
    try {
      const days = req.query.days || 30;

      const query = `
        SELECT c.id, c.customer_name, MAX(s.created_at) AS last_purchase, COUNT(s.id) AS total_purchases
        FROM customers c
        JOIN sales s ON s.customer_id = c.id
        GROUP BY c.id, c.customer_name
        HAVING COUNT(s.id) >= 3 AND MAX(s.created_at) < NOW() - INTERVAL '${days} days'
        ORDER BY last_purchase DESC
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar clientes recorrentes" });
    }
  },

  dynamicAnalytics: async (req, res) => {
    try {
        const { groupBy, metric, filters } = req.body;

        let whereClause = "WHERE 1=1";
        if (filters) {
        if (filters.store_id) whereClause += ` AND store_id = ${filters.store_id}`;
        if (filters.channel_id) whereClause += ` AND channel_id = ${filters.channel_id}`;
        if (filters.start_date) whereClause += ` AND created_at >= '${filters.start_date}'`;
        if (filters.end_date) whereClause += ` AND created_at <= '${filters.end_date}'`;
        }

        let groupClause = "";
        if (groupBy && groupBy.length > 0) {
        groupClause = "GROUP BY " + groupBy.join(", ");
        }

        const query = `
        SELECT ${groupBy ? groupBy.join(", ") + "," : ""} ${metric.agg}(${metric.field}) AS value
        FROM sales
        ${whereClause}
        ${groupClause}
        ORDER BY value DESC
        LIMIT 50
        `;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao gerar análise dinâmica" });
    }
 }


};

export default AnalyticsController;
