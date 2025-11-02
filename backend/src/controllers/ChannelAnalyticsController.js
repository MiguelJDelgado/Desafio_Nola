import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";


const ChannelAnalyticsController = {
  revenueByChannel: async (req, res) => {
    try {
      const { store_id, start_date, end_date, page = 1, limit = 5 } = req.query;

      const offset = (page - 1) * limit;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND store_id = ${store_id}`;
      if (start_date) whereClause += ` AND created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND created_at <= '${end_date}'`;

      const query = `
        SELECT
          c.id AS channel_id,
          c.name AS channel_name,
          SUM(s.total_amount) AS revenue
        FROM sales s
        JOIN channels c ON c.id = s.channel_id
        ${whereClause}
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
        LIMIT ${limit} OFFSET ${offset};
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao gerar receita por canal" });
    }
  }
};

export default ChannelAnalyticsController;
