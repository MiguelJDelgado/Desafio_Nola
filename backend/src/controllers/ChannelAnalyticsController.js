import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const ChannelAnalyticsController = {

  salesCountByChannel: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT
          c.name AS channel_name,
          COUNT(s.id) AS total_sales
        FROM sales s
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY c.name
        ORDER BY total_sales DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao contar vendas por canal" });
    }
  },

  avgTicketByChannel: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT
          c.name AS channel_name,
          AVG(s.total_amount) AS avg_ticket
        FROM sales s
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY c.name
        ORDER BY avg_ticket DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular ticket médio por canal" });
    }
  },

  deliveryVsPresencial: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT
          CASE WHEN c.name = 'Presencial' THEN 'Presencial' ELSE 'Delivery' END AS type,
          COUNT(*) AS total_orders
        FROM sales s
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY CASE WHEN c.name = 'Presencial' THEN 'Presencial' ELSE 'Delivery' END;
      `;
      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular Delivery vs Presencial" });
    }
  },

  deliveryRate: async (req, res) => {
    try {
      const { store_id } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT
          100.0 * SUM(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN 1 ELSE 0 END) / COUNT(*) AS delivery_rate
        FROM sales s
        ${whereClause};
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results[0]);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular taxa de entrega" });
    }
  },

  lastOrders: async (req, res) => {
    try {
      const { store_id } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          s.id AS order_id,
          cu.customer_name,
          s.store_id,
          c.name AS channel_name,
          s.total_amount,
          s.created_at AS order_date
        FROM sales s
        JOIN customers cu ON cu.id = s.customer_id
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        ORDER BY s.created_at DESC
        LIMIT 5;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar últimos pedidos" });
    }
  }

};

export default ChannelAnalyticsController;
