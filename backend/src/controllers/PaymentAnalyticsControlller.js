import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const PaymentAnalyticsController = {

  revenueByPaymentMethod: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          pt.description AS payment_method,
          COUNT(*) AS total_sales,
          ROUND(SUM(p.value), 2) AS total_revenue
        FROM payments p
        JOIN payment_types pt ON pt.id = p.payment_type_id
        JOIN sales s ON s.id = p.sale_id
        ${whereClause}
        GROUP BY pt.description
        ORDER BY total_revenue DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular receita por método de pagamento" });
    }
  },

  voucherPayment: async (req, res) => {
    try {
        const { store_id } = req.query;
        let whereClause = "WHERE 1=1";
        if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

        const query = `
        SELECT 
            ROUND(
            (SUM(CASE WHEN pt.description IN ('Vale Alimentação','Vale Refeição') THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 2
            ) AS online_rate
        FROM payments p
        JOIN sales s ON s.id = p.sale_id
        JOIN payment_types pt ON pt.id = p.payment_type_id
        ${whereClause};
        `;

        const [result] = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json({ online_rate: parseFloat(result.online_rate) || 0 });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao calcular percentual de pagamentos com Vale" });
    }
  },

  topPayments: async (req, res) => {
    try {
      const { store_id, limit = 5 } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          pt.description AS payment_method,
          COUNT(*) AS total_usage
        FROM payments p
        JOIN payment_types pt ON pt.id = p.payment_type_id
        JOIN sales s ON s.id = p.sale_id
        ${whereClause}
        GROUP BY pt.description
        ORDER BY total_usage DESC
        LIMIT ${limit};
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular top 5 formas de pagamento" });
    }
  },

  avgTicketByPayment: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          pt.description AS payment_method,
          ROUND(AVG(p.value), 2) AS avg_ticket
        FROM payments p
        JOIN payment_types pt ON pt.id = p.payment_type_id
        JOIN sales s ON s.id = p.sale_id
        ${whereClause}
        GROUP BY pt.description
        ORDER BY avg_ticket DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular ticket médio por forma de pagamento" });
    }
  },

  lastCancelledOrRefunded: async (req, res) => {
    try {
        const { store_id } = req.query;

        let whereClause = "WHERE s.sale_status_desc = 'CANCELLED'";
        if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

        const query = `
          SELECT 
            s.id AS order_id,
            s.customer_name AS customer,
            pt.description AS payment_method,
            ROUND(p.value, 2) AS total_amount,
              s.created_at AS cancelled_at
          FROM sales s
          LEFT JOIN payments p ON p.sale_id = s.id
          LEFT JOIN payment_types pt ON pt.id = p.payment_type_id
          ${whereClause}
          ORDER BY s.created_at DESC
          LIMIT 5;
        `;

        const results = await sequelize.query(query, { type: QueryTypes.SELECT });
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar últimos pedidos cancelados ou estornados" });
    }
  }


};

export default PaymentAnalyticsController;
