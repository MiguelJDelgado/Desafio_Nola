import { sequelize } from "../models/index.js";
import { QueryTypes } from "sequelize";

const CouponAnalyticsController = {
  totalSalesWithCoupon: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          COUNT(DISTINCT s.id) AS total_sales_with_coupon
        FROM sales s
        INNER JOIN coupon_sales cs ON cs.sale_id = s.id
        ${whereClause};
      `;

      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(result[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar total de vendas com cupom" });
    }
  },

  totalDiscountGiven: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          COALESCE(SUM(cs.value), 0) AS total_discount
        FROM coupon_sales cs
        INNER JOIN sales s ON s.id = cs.sale_id
        ${whereClause};
      `;

      const result = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(result[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular total de descontos concedidos" });
    }
  },

  couponSalesDistribution: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          pt.description AS payment_type,
          COUNT(DISTINCT s.id) AS total_sales
        FROM sales s
        INNER JOIN coupon_sales cs ON cs.sale_id = s.id
        INNER JOIN payments p ON p.sale_id = s.id
        INNER JOIN payment_types pt ON pt.id = p.payment_type_id
        ${whereClause}
        GROUP BY pt.description
        ORDER BY total_sales DESC;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular distribuição de vendas com cupom" });
    }
  },

  couponImpactOnAvgTicket: async (req, res) => {
    try {
      const { store_id } = req.query;
      let whereClause = "WHERE s.created_at >= NOW() - INTERVAL '5 days'";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;

      const query = `
        SELECT 
          DATE(s.created_at) AS sale_date,
          ROUND(AVG(CASE WHEN cs.coupon_id IS NOT NULL THEN s.total_amount END), 2) AS ticket_with_coupon,
          ROUND(AVG(CASE WHEN cs.coupon_id IS NULL THEN s.total_amount END), 2) AS ticket_without_coupon
        FROM sales s
        LEFT JOIN coupon_sales cs ON cs.sale_id = s.id
        ${whereClause}
        GROUP BY DATE(s.created_at)
        ORDER BY sale_date;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao calcular impacto de cupons no ticket médio" });
    }
  },

  topUsedCoupons: async (req, res) => {
    try {
      const { store_id, start_date, end_date } = req.query;
      let whereClause = "WHERE 1=1";
      if (store_id) whereClause += ` AND s.store_id = ${store_id}`;
      if (start_date) whereClause += ` AND s.created_at >= '${start_date}'`;
      if (end_date) whereClause += ` AND s.created_at <= '${end_date}'`;

      const query = `
        SELECT 
          c.code AS coupon_code,
          COUNT(cs.id) AS usage_count,
          COALESCE(SUM(cs.value), 0) AS total_discount
        FROM coupon_sales cs
        INNER JOIN coupons c ON c.id = cs.coupon_id
        INNER JOIN sales s ON s.id = cs.sale_id
        ${whereClause}
        GROUP BY c.code
        ORDER BY usage_count DESC
        LIMIT 5;
      `;

      const results = await sequelize.query(query, { type: QueryTypes.SELECT });
      res.json(results);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar cupons mais usados" });
    }
  }
};

export default CouponAnalyticsController;
