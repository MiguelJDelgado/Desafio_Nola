import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const CustomerAnalyticsController = {
  recurringCustomers: async (req, res) => {
    try {
      const days = req.query.days || 30;

      const query = `
        SELECT c.id, c.customer_name, MAX(s.created_at) AS last_purchase, COUNT(s.id) AS total_purchases
        FROM customers c
        JOIN sales s ON s.customer_id = c.id
        GROUP BY c.id, c.customer_name
        HAVING COUNT(s.id) >= 3 AND MAX(s.created_at) < NOW() - INTERVAL '${days} days'
        ORDER BY last_purchase DESC
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar clientes recorrentes" });
    }
  }
};

export default CustomerAnalyticsController;
