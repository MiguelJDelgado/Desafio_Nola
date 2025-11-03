import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const DeliveryAnalyticsController = {
  averageProductionTime: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT 
          TO_CHAR(s.created_at, 'Day') AS weekday,
          ROUND(AVG(s.production_seconds) / 60, 2) AS avg_production_time
        FROM sales s
        ${whereClause}
        GROUP BY weekday
        ORDER BY MIN(s.created_at);
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular tempo médio de produção" });
    }
  },

  averageDeliveryTime: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT
          TO_CHAR(s.created_at, 'Day') AS weekday,
          ROUND(AVG(s.delivery_seconds) / 60, 2) AS avg_delivery_time
        FROM sales s
        ${whereClause}
        GROUP BY weekday
        ORDER BY MIN(s.created_at);
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular tempo médio de entrega" });
    }
  },

  deliveryRevenueByChannel: async (req, res) => {
  try {
    const { store_ids } = req.query;

    let whereClause = "WHERE s.channel_id NOT IN (SELECT id FROM channels WHERE name = 'Presencial')";

    if (store_ids) {
      const idsArray = store_ids.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
      if (idsArray.length > 0) {
        whereClause += ` AND s.store_id IN (${idsArray.join(',')})`;
      }
    }
    const query = `
      SELECT c.name AS channel_name,
             ROUND(SUM(s.total_amount), 2) AS total_revenue
      FROM sales s
      JOIN channels c ON s.channel_id = c.id
      ${whereClause}
      GROUP BY c.name
      ORDER BY total_revenue DESC;
    `;

    const results = await sequelize.query(query, { type: QueryTypes.SELECT });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao calcular receita por canal de delivery" });
  }
},



  performanceByCarrier: async (req, res) => {
    try {
        const { store_id, start_date, end_date } = req.query;
        let whereClause = "WHERE 1=1";
        if (store_id) whereClause += ` AND store_id = ${store_id}`;
        if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
        if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

        const query = `
        SELECT 
            channel_id AS carrier_id,
            COUNT(*) AS total_deliveries,
            ROUND(AVG(delivery_seconds)/60, 2) AS avg_time_min,
            ROUND(SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS success_rate
        FROM sales
        ${whereClause}
        GROUP BY channel_id
        ORDER BY success_rate DESC;
        `;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar desempenho por transportadora" });
    }
  },

  topCities: async (req, res) => {
    try {
        const { start_date, end_date, limit = 5 } = req.query;

        let dateFilter = '';
        if (start_date) dateFilter += ` AND s.created_at >= '${start_date}'`;
        if (end_date) dateFilter += ` AND s.created_at <= '${end_date}'`;

        const query = `
        SELECT 
            st.city,
            st.state,
            COUNT(s.id) AS total_orders,
            COALESCE(ROUND(SUM(s.total_amount), 2), 0) AS total_revenue
        FROM sales s
        JOIN stores st ON s.store_id = st.id
        WHERE 1=1
        ${dateFilter}
        GROUP BY st.city, st.state
        ORDER BY total_orders DESC
        LIMIT ${limit};
        `;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar cidades com mais pedidos" });
    }
  }

};

export default DeliveryAnalyticsController;
