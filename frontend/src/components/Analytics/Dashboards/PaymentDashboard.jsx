import { useState } from "react";
import styled from "styled-components";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

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

const OrdersTable = styled.table`
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

function PaymentsDashboard() {
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
  const mockStores = ["Todas", "Loja 1", "Loja 2", "Loja 3", "Loja 4", "Loja 5"];
  const [selectedStore, setSelectedStore] = useState("Todas");

  // Mock Data
  const revenueByPaymentType = [
    { name: "Cartão Crédito", value: 1200000 },
    { name: "Cartão Débito", value: 800000 },
    { name: "Pix", value: 500000 },
    { name: "Dinheiro", value: 300000 },
    { name: "Vale Refeição", value: 100000 },
  ];

  const onlinePaymentPercentage = 75; // %
  const topPaymentMethods = [
    { name: "Cartão Crédito", count: 520 },
    { name: "Cartão Débito", count: 430 },
    { name: "Pix", count: 310 },
    { name: "Dinheiro", count: 120 },
    { name: "Vale Refeição", count: 60 },
  ];

  const canceledOrders = [
    { order: 201, customer: "Ana", payment: "Pix", status: "Cancelado", amount: 120, store: "Loja 1" },
    { order: 202, customer: "Bruno", payment: "Cartão Crédito", status: "Estornado", amount: 200, store: "Loja 2" },
    { order: 203, customer: "Carlos", payment: "Dinheiro", status: "Cancelado", amount: 80, store: "Loja 3" },
    { order: 204, customer: "Daniela", payment: "Pix", status: "Estornado", amount: 150, store: "Loja 1" },
    { order: 205, customer: "Eduardo", payment: "Cartão Débito", status: "Cancelado", amount: 95, store: "Loja 2" },
    { order: 206, customer: "Fernanda", payment: "Pix", status: "Cancelado", amount: 130, store: "Loja 3" },
  ];


  const avgTicketByPayment = [
    { name: "Cartão Crédito", value: 90 },
    { name: "Cartão Débito", value: 75 },
    { name: "Pix", value: 60 },
    { name: "Dinheiro", value: 50 },
    { name: "Vale Refeição", value: 45 },
  ];

  return (
    <DashboardContainer>
      {/* Linha de gráficos/KPIs */}
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Receita por Tipo de Pagamento</SectionTitle>
          <FilterSelect
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            {mockStores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueByPaymentType} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>% de Pagamentos Online</SectionTitle>
          <KpiBox>{onlinePaymentPercentage}%</KpiBox>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Top 5 Formas de Pagamento</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topPaymentMethods}
                dataKey="count"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {topPaymentMethods.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio por Tipo de Pagamento</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgTicketByPayment} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      {/* Tabela de Pedidos Cancelados/Estornados */}
      <ChartBox style={{ flex: "1 1 100%" }}>
      <SectionTitle>Últimos 5 Pedidos Cancelados ou Estornados</SectionTitle>
       <FilterSelect
        value={selectedStore}
        onChange={(e) => setSelectedStore(e.target.value)}
       >
        {mockStores.map((store) => (
        <option key={store} value={store}>{store}</option>
        ))}
            </FilterSelect>
            <OrdersTable>
                <thead>
                <tr>
                    <TableHeader>Pedido</TableHeader>
                    <TableHeader>Cliente</TableHeader>
                    <TableHeader>Pagamento</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Valor</TableHeader>
                </tr>
                </thead>
                <tbody>
                {canceledOrders
                    .filter(order => selectedStore === "Todas" || order.store === selectedStore)
                    .slice(0, 5) // últimos 5 pedidos
                    .map((order) => (
                    <tr key={order.order}>
                        <TableCell>{order.order}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell>{order.payment}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>{order.amount}</TableCell>
                    </tr>
                ))}
                </tbody>
            </OrdersTable>
        </ChartBox>

    </DashboardContainer>
  );
}

export default PaymentsDashboard;
