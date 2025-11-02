import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const DynamicAnalyticsController = {
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
      if (groupBy && groupBy.length > 0) groupClause = "GROUP BY " + groupBy.join(", ");

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

export default DynamicAnalyticsController;
