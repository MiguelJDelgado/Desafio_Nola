import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const CustomerAnalyticsController = {
  newCustomers: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let whereClause = "WHERE 1=1";
      if (startDate) whereClause += ` AND created_at >= '${startDate}'`;
      if (endDate) whereClause += ` AND created_at <= '${endDate}'`;

      const query = `
        SELECT 
          id AS customer_id,
          customer_name,
          registration_origin,
          created_at AS registration_date
        FROM customers
        ${whereClause}
        ORDER BY registration_date DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar novos clientes" });
    }
  },

  genderDistribution: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      let whereClause = "WHERE gender IS NOT NULL";
      if (startDate) whereClause += ` AND created_at >= '${startDate}'`;
      if (endDate) whereClause += ` AND created_at <= '${endDate}'`;

      const query = `
        SELECT 
          gender, 
          COUNT(*) AS total
        FROM customers
        ${whereClause}
        GROUP BY gender;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular distribuição por gênero" });
    }
  },

  ageDistribution: async (req, res) => {
    try {
      const today = new Date();
      const query = `
        SELECT
          CASE 
            WHEN age(birth_date) BETWEEN interval '18 years' AND interval '25 years' THEN '18-25'
            WHEN age(birth_date) BETWEEN interval '26 years' AND interval '35 years' THEN '26-35'
            WHEN age(birth_date) BETWEEN interval '36 years' AND interval '45 years' THEN '36-45'
            WHEN age(birth_date) BETWEEN interval '46 years' AND interval '60 years' THEN '46-60'
            ELSE '60+'
          END AS age_range,
          COUNT(*) AS total
        FROM customers
        WHERE birth_date IS NOT NULL
        GROUP BY age_range
        ORDER BY age_range;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular distribuição etária" });
    }
  },

  activeInactiveCustomers: async (req, res) => {
    try {
      const { store_id, startDate, endDate } = req.query;
      let whereClauseSales = "WHERE 1=1";
      if (store_id) whereClauseSales += ` AND store_id = ${store_id}`;
      if (startDate) whereClauseSales += ` AND created_at >= '${startDate}'`;
      if (endDate) whereClauseSales += ` AND created_at <= '${endDate}'`;

      const activeQuery = `
        SELECT COUNT(DISTINCT customer_id) AS active_customers
        FROM sales
        ${whereClauseSales};
      `;
      const activeResult = await sequelize.query(activeQuery, { type: QueryTypes.SELECT });

      let inactiveClause = "";
      if (store_id) inactiveClause += ` AND store_id = ${store_id}`;
      const inactiveQuery = `
        SELECT COUNT(*) AS inactive_customers
        FROM customers c
        WHERE NOT EXISTS (
          SELECT 1 FROM sales s
          WHERE s.customer_id = c.id
          ${whereClauseSales.replace("WHERE 1=1", "")}
        );
      `;
      const inactiveResult = await sequelize.query(inactiveQuery, { type: QueryTypes.SELECT });

      res.json({
        active: activeResult[0].active_customers || 0,
        inactive: inactiveResult[0].inactive_customers || 0
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular clientes ativos e inativos" });
    }
  },

  customerRetention: async (req, res) => {
    try {
      const { store_id } = req.query;

      const query = `
        SELECT 
          to_char(sale_month, 'YYYY-MM') AS month,
          COUNT(DISTINCT customer_id) AS retained_customers
        FROM (
          SELECT customer_id, date_trunc('month', created_at) AS sale_month
          FROM sales
          ${store_id ? `WHERE store_id = ${store_id}` : ""}
        ) AS monthly_sales
        GROUP BY sale_month
        ORDER BY sale_month DESC
        LIMIT 8;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results.reverse()); // Ordena cronologicamente

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular retenção de clientes" });
    }
  }
};

export default CustomerAnalyticsController;
