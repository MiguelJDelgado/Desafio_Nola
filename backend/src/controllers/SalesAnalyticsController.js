import { sequelize, ProductSale } from "../models/index.js";
import { QueryTypes } from "sequelize";

const SalesAnalyticsController = {
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

  ticketAverage: async (req, res) => {
    try {
      const { store_id, channel_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (channel_id) whereClause += ` AND s.channel_id = ${channel_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT 
          s.store_id,
          st.name AS store_name,
          s.channel_id,
          c.name AS channel_name,
          AVG(s.total_amount) AS avg_ticket
        FROM sales s
        JOIN stores st ON st.id = s.store_id
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY s.store_id, st.name, s.channel_id, c.name
        ORDER BY s.store_id, s.channel_id;
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

  salesByStatus: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          sale_status_desc AS status,
          COUNT(*) AS total_sales,
          SUM(total_amount) AS total_revenue
        FROM sales
        ${whereClause}
        GROUP BY sale_status_desc
        ORDER BY total_sales DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar vendas por status" });
    }
  },

  salesByHour: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          EXTRACT(HOUR FROM created_at) AS hour_of_day,
          COUNT(*) AS total_sales,
          SUM(total_amount) AS total_revenue
        FROM sales
        ${whereClause}
        GROUP BY hour_of_day
        ORDER BY hour_of_day;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar vendas por hora" });
    }
  },

  topStores: async (req, res) => {
    try {
      const { start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          s.store_id,
          st.name AS store_name,
          COUNT(*) AS total_sales,
          SUM(total_amount) AS total_revenue
        FROM sales s
        JOIN stores st ON st.id = s.store_id
        ${whereClause}
        GROUP BY s.store_id, st.name
        ORDER BY total_revenue DESC
        LIMIT 10;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar top lojas" });
    }
  },

  salesBySubBrand: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          sub_brand_id,
          COUNT(*) AS total_sales,
          SUM(total_amount) AS total_revenue
        FROM sales
        ${whereClause}
        GROUP BY sub_brand_id
        ORDER BY total_revenue DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar vendas por sub-brand" });
    }
  }
};

export default SalesAnalyticsController;
