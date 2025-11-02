import { sequelize, Sale, ProductSale, Product, Channel, Customer } from "../models/index.js";
import { QueryTypes } from "sequelize";

const AnalyticsController = {

  salesSummary: async (req, res) => {
    try {
      const { store_id, channel_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (channel_id) whereClause += ` AND channel_id = ${channel_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          COUNT(*) AS total_sales,
          SUM(ps.quantity) AS total_items,
          SUM(s.total_amount) AS total_revenue,
          SUM(s.total_discount) AS total_discount,
          SUM(s.total_increase) AS total_increase,
          SUM(s.delivery_fee) AS total_delivery_fee,
          AVG(s.total_amount) AS ticket_avg,
          SUM(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
          SUM(CASE WHEN s.sale_status_desc = 'CANCELLED' THEN 1 ELSE 0 END) AS cancelled
        FROM sales s
        LEFT JOIN product_sales ps ON ps.sale_id = s.id
        ${whereClause};
      `;

      const [result] = await sequelize.query(query, { type: QueryTypes.SELECT });

      res.json({
        total_sales: parseInt(result.total_sales) || 0,
        total_items: parseInt(result.total_items) || 0,
        total_revenue: parseFloat(result.total_revenue) || 0,
        total_discount: parseFloat(result.total_discount) || 0,
        total_increase: parseFloat(result.total_increase) || 0,
        total_delivery_fee: parseFloat(result.total_delivery_fee) || 0,
        ticket_avg: parseFloat(result.ticket_avg) || 0,
        by_status: {
          COMPLETED: parseInt(result.completed) || 0,
          CANCELLED: parseInt(result.cancelled) || 0
        }
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar resumo de vendas" });
    }
  },

  topCategories: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT
          p.category_id,
          pc.category_name,
          SUM(ps.quantity) AS total_qty,
          SUM(ps.total_price) AS total_revenue
        FROM product_sales ps
        JOIN sales s ON s.id = ps.sale_id
        JOIN products p ON p.id = ps.product_id
        JOIN product_categories pc ON pc.id = p.category_id
        ${whereClause}
        GROUP BY p.category_id, pc.category_name
        ORDER BY total_revenue DESC
        LIMIT 10;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar top categorias" });
    }
  },

  salesByDayOfWeek: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          EXTRACT(DOW FROM s.created_at) AS day_of_week,
          COUNT(*) AS total_sales,
          SUM(s.total_amount) AS revenue
        FROM sales s
        ${whereClause}
        GROUP BY day_of_week
        ORDER BY day_of_week;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar vendas por dia da semana" });
    }
  },

  revenueByChannel: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          c.id AS channel_id,
          c.channel_name,
          SUM(s.total_amount) AS revenue
        FROM sales s
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY c.id, c.channel_name
        ORDER BY revenue DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar receita por canal" });
    }
  },

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
