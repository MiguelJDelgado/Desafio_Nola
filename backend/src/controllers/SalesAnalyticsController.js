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
  }
};

export default SalesAnalyticsController;
