import db from "../config/database.js";
import { QueryTypes } from "sequelize";
import sequelize from '../config/database.js';

const ProductAnalyticsController = {
  topProducts: async (req, res) => {
    try {
      const { store_id, startDate, endDate, limit = 10 } = req.query;

      let whereClause = "WHERE 1=1";
      const replacements = [];

      if (store_id) {
        whereClause += ` AND s.store_id = ?`;
        replacements.push(store_id);
      }

      if (startDate) {
        whereClause += ` AND s.created_at >= ?`;
        replacements.push(startDate);
      }

      if (endDate) {
        whereClause += ` AND s.created_at <= ?`;
        replacements.push(endDate);
      }

      const query = `
        SELECT 
          p.name AS product_name,
          SUM(ps.quantity) AS total_sold,
          SUM(ps.total_price) AS total_revenue
        FROM product_sales ps
        JOIN products p ON p.id = ps.product_id
        JOIN sales s ON s.id = ps.sale_id
        ${whereClause}
        GROUP BY p.name
        ORDER BY total_revenue DESC
        LIMIT ?
      `;

      replacements.push(parseInt(limit, 10));

      const results = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements
      });

      res.json(results);
    } catch (err) {
      console.error("Erro ao buscar top products:", err);
      res.status(500).json({ error: "Erro ao buscar top products" });
    }
  },

  topCategoriesByStore : async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const query = `
        SELECT s.id AS store_id, s.name AS store_name,
                c.name AS category_name, SUM(ps.quantity) AS total_sold,
                SUM(ps.total_price) AS total_revenue,
                ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY SUM(ps.total_price) DESC) AS rank
        FROM product_sales ps
        JOIN products p ON ps.product_id = p.id
        JOIN categories c ON p.category_id = c.id
        JOIN sales sa ON ps.sale_id = sa.id
        JOIN stores s ON sa.store_id = s.id
        GROUP BY s.id, s.name, c.id, c.name
        `;

        const [results] = await sequelize.query(query);

        const grouped = results.reduce((acc, item) => {
        if (!acc[item.store_id]) {
            acc[item.store_id] = {
            store_id: item.store_id,
            store_name: item.store_name,
            top_categories: []
            };
        }

        if (item.rank <= 3) {
            acc[item.store_id].top_categories.push({
            category_name: item.category_name,
            total_sold: Number(item.total_sold),
            total_revenue: Number(item.total_revenue)
            });
        }

        return acc;
        }, {});

        const storesArray = Object.values(grouped);
        const paginated = storesArray.slice(offset, offset + limit);

        res.json(paginated);

    } catch (err) {
        console.error("Erro ao gerar top categorias por loja:", err);
        res.status(500).json({ error: "Erro ao gerar top categorias por loja" });
    }
  },

  revenueByProduct : async (req, res) => {
    try {
      const { startDate, endDate, store_id, limit = 10 } = req.query;

      const query = `
        SELECT 
          p.name AS product_name,
          SUM(ps.quantity * ps.total_price / NULLIF(ps.quantity,0)) AS total_revenue
        FROM product_sales ps
        JOIN products p ON p.id = ps.product_id
        JOIN sales s ON s.id = ps.sale_id
        WHERE s.store_id = :store_id
          AND s.created_at BETWEEN :startDate AND :endDate
        GROUP BY p.name
        ORDER BY total_revenue DESC
      LIMIT :limit;
      `;

      const results = await sequelize.query(query, {
        replacements: { store_id, startDate, endDate, limit },
        type: QueryTypes.SELECT
      });

      res.json(results);
    } catch (error) {
      console.error("Erro ao calcular receita por produto", error);
      res.status(500).json({ error: "Erro ao calcular receita por produto" });
    }
  },

  profitMarginByProduct: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND ps.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND ps.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND ps.created_at <= '${end_date}'`;

      const query = `
        SELECT
          p.name AS product_name,
          SUM(ps.total_price - ps.quantity * ps.base_price) AS total_profit,
          SUM(ps.total_price) AS total_revenue,
          (SUM(ps.total_price - ps.quantity * ps.base_price) / NULLIF(SUM(ps.total_price), 0)) * 100 AS profit_margin
        FROM product_sales ps
        JOIN products p ON p.id = ps.product_id
        JOIN sales s ON s.id = ps.sale_id
        WHERE s.store_id = 1
          AND s.created_at BETWEEN '2025-01-01' AND '2025-12-31'
        GROUP BY p.name
        ORDER BY profit_margin DESC
        LIMIT 10
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular margem de lucro por produto" });
    }
  },

  lowTurnoverProducts: async (req, res) => {
    try {
      const { store_id, start_date, end_date, limit = 10 } = req.query;

      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT 
          i.name AS product_name,
          SUM(ips.quantity) AS total_sold
        FROM item_product_sales ips
        JOIN product_sales ps ON ps.id = ips.product_sale_id
        JOIN sales s ON s.id = ps.sale_id
        JOIN items i ON i.id = ips.item_id
        ${whereClause}
        GROUP BY i.name
        ORDER BY total_sold DESC
        LIMIT ${limit};
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar customizações mais pedidas" });
    }
  }
};

export default ProductAnalyticsController