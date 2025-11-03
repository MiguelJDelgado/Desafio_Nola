import { useState, useEffect } from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  totalSalesWithCoupon,
  totalDiscountGiven,
  couponSalesDistribution,
  topUsedCoupons
} from "../../../services/analyticsCouponsServices";

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ChartsRow = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
`;

const ChartBox = styled.div`
  flex: 1;
  min-width: 300px;
  min-height: 300px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
  color: #333;
`;

const KpiBox = styled.div`
  background: #4f46e5;
  color: white;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CouponsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 8px;
  border-bottom: 2px solid #ccc;
`;

const TableCell = styled.td`
  padding: 8px;
  border-bottom: 1px solid #eee;
`;

const FilterSelect = styled.select`
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

function CouponsDashboard() {
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#9115e4ff"];

  // Filtro de desconto - 5 primeiras lojas
  const storeOptions = [
    { id: 1, name: "Loja 1" },
    { id: 2, name: "Loja 2" },
    { id: 3, name: "Loja 3" },
    { id: 4, name: "Loja 4" },
    { id: 5, name: "Loja 5" },
  ];

  const [storeTotalDiscounts, setStoreTotalDiscounts] = useState(storeOptions[0].id);

  // Dados do dashboard
  const [totalSalesValue, setTotalSalesValue] = useState(0);
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [couponDistributionData, setCouponDistributionData] = useState([]);
  const [mostUsedCoupons, setMostUsedCoupons] = useState([]);

  const loadData = async () => {
    try {
      // Total de vendas com cupom
      const salesRes = await totalSalesWithCoupon();
      setTotalSalesValue(Number(salesRes.total_sales_with_coupon));

      // Total de descontos (filtrável por loja)
      const discountRes = await totalDiscountGiven({ store_id: storeTotalDiscounts });
      setTotalDiscountValue(Number(discountRes.total_discount));

      // Distribuição de vendas com cupom
      const distributionRes = await couponSalesDistribution();
      setCouponDistributionData(
        distributionRes.map((item) => ({
          name: item.payment_type,
          value: Number(item.total_sales),
        }))
      );

      // Top cupons mais usados
      const topCouponsRes = await topUsedCoupons();
      setMostUsedCoupons(
        topCouponsRes.map((item) => ({
          code: item.coupon_code,
          uses: Number(item.usage_count),
          discount: `R$ ${Number(item.total_discount).toFixed(2)}`,
        }))
      );
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [storeTotalDiscounts]);

  const handleStoreChange = (e) => {
    setStoreTotalDiscounts(Number(e.target.value));
  };

  return (
    <DashboardContainer>
      <ChartsRow>
        {/* Total de Vendas com Cupom */}
        <ChartBox>
          <SectionTitle>Total de Vendas com Cupom</SectionTitle>
          <KpiBox>{totalSalesValue}</KpiBox>
        </ChartBox>

        {/* Total de Descontos Concedidos (R$) */}
        <ChartBox>
          <SectionTitle>Total de Descontos Concedidos (R$)</SectionTitle>
          <FilterSelect
            value={storeTotalDiscounts}
            onChange={handleStoreChange}
          >
            {storeOptions.map(store => (
              <option key={store.id} value={store.id}>{store.name}</option>
            ))}
          </FilterSelect>
          <KpiBox>R$ {totalDiscountValue}</KpiBox>
        </ChartBox>

        {/* Distribuição de Vendas com Cupom */}
        <ChartBox>
          <SectionTitle>Distribuição de Vendas com Cupom</SectionTitle>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={couponDistributionData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {couponDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => `${value} Vendas`} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      {/* Tabela de Cupons Mais Usados */}
      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>Cupons Mais Usados</SectionTitle>
        <CouponsTable>
          <thead>
            <tr>
              <TableHeader>Código</TableHeader>
              <TableHeader>Usos</TableHeader>
              <TableHeader>Desconto Total</TableHeader>
            </tr>
          </thead>
          <tbody>
            {mostUsedCoupons.map((coupon) => (
              <tr key={coupon.code}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.uses}</TableCell>
                <TableCell>{coupon.discount}</TableCell>
              </tr>
            ))}
          </tbody>
        </CouponsTable>
      </ChartBox>
    </DashboardContainer>
  );
}

export default CouponsDashboard;
