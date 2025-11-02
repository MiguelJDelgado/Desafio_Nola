import db from "../config/database.js";
import sequelize from '../config/database.js';

const ProductAnalyticsController = {
  topProducts: async (req, res) => {
    try {
      const { store_id, limit = 10 } = req.query;

      const result = await db.query(
        `
        SELECT 
          p.name AS product_name,
          SUM(ps.quantity) AS total_sold,
          SUM(ps.total_price) AS total_revenue
        FROM product_sales ps
        JOIN products p ON p.id = ps.product_id
        JOIN sales s ON s.id = ps.sale_id
        WHERE s.store_id = $1
        GROUP BY p.name
        ORDER BY total_revenue DESC
        LIMIT $2
        `,
        [store_id, limit]
      );

      res.json(result.rows);
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

        // Agrupar por loja
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

        // Converter para array e aplicar paginação
        const storesArray = Object.values(grouped);
        const paginated = storesArray.slice(offset, offset + limit);

        res.json(paginated);

    } catch (err) {
        console.error("Erro ao gerar top categorias por loja:", err);
        res.status(500).json({ error: "Erro ao gerar top categorias por loja" });
    }
  },
};

export default ProductAnalyticsController