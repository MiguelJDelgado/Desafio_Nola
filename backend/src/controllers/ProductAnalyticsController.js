import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const ProductAnalyticsController = {
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
  }
};

export default ProductAnalyticsController;
