import { useState } from "react";
import styled from "styled-components";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

const FilterSelect = styled.select`
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const KpiLabel = styled.div`
  font-size: 16px;
  margin-bottom: 8px;
`;

const KpiDescription = styled.div`
  font-size: 14px;
  font-weight: normal;
  margin-top: 6px;
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

function ChannelsDashboard() {
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
  const mockStores = ["Todas", "Loja 1", "Loja 2", "Loja 3", "Loja 4", "Loja 5"];
  const [selectedStore, setSelectedStore] = useState("Todas");

  // Mock Data para gráficos
  const revenueByChannel = [
    { name: "Presencial", value: 1480180 },
    { name: "iFood", value: 1164520 },
    { name: "Rappi", value: 604615 },
    { name: "Uber Eats", value: 276894 },
    { name: "WhatsApp", value: 193976 },
    { name: "App Próprio", value: 89479 },
  ];

  const avgTicketByChannel = [
    { name: "Presencial", value: 90 },
    { name: "iFood", value: 80 },
    { name: "Rappi", value: 75 },
    { name: "Uber Eats", value: 70 },
    { name: "WhatsApp", value: 60 },
    { name: "App Próprio", value: 55 },
  ];

  const deliveryVsPresencial = [
    { day: "Seg", Presencial: 200, Delivery: 150 },
    { day: "Ter", Presencial: 180, Delivery: 160 },
    { day: "Qua", Presencial: 220, Delivery: 140 },
    { day: "Qui", Presencial: 210, Delivery: 170 },
    { day: "Sex", Presencial: 250, Delivery: 200 },
  ];

  const deliveryRate = 92; // %

  // Mock Data para tabela: últimos 5 pedidos de cada canal
  const lastOrdersByChannel = {
    "Presencial": [
      { order: 201, customer: "Cliente A", store: "Loja 1", status: "Entregue", time: "20 min" },
      { order: 202, customer: "Cliente B", store: "Loja 2", status: "Pendente", time: "-" },
      { order: 203, customer: "Cliente C", store: "Loja 1", status: "Entregue", time: "25 min" },
      { order: 204, customer: "Cliente D", store: "Loja 3", status: "Entregue", time: "22 min" },
      { order: 205, customer: "Cliente E", store: "Loja 2", status: "Entregue", time: "30 min" },
    ],
    "iFood": [
      { order: 301, customer: "Cliente F", store: "Loja 1", status: "Entregue", time: "18 min" },
      { order: 302, customer: "Cliente G", store: "Loja 3", status: "Entregue", time: "21 min" },
      { order: 303, customer: "Cliente H", store: "Loja 2", status: "Entregue", time: "19 min" },
      { order: 304, customer: "Cliente I", store: "Loja 4", status: "Pendente", time: "-" },
      { order: 305, customer: "Cliente J", store: "Loja 5", status: "Entregue", time: "20 min" },
    ],
  };

  const [selectedChannel, setSelectedChannel] = useState("Presencial");

  // Filtra pedidos pelo canal e pela loja
  const displayedOrders = lastOrdersByChannel[selectedChannel]?.filter(
    (order) => selectedStore === "Todas" || order.store === selectedStore
  ) || [];

  return (
    <DashboardContainer>
      {/* Linha de gráficos KPI */}
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Vendas por Canal</SectionTitle>
          <FilterSelect
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            {mockStores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByChannel}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {revenueByChannel.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio por Canal</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgTicketByChannel} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Delivery vs Presencial</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryVsPresencial} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Presencial" stackId="a" fill="#4f46e5" />
              <Bar dataKey="Delivery" stackId="a" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <KpiBox>
            <KpiLabel>Taxa de Entrega</KpiLabel>
            {deliveryRate}%
            <KpiDescription>Pedidos entregues dentro do prazo</KpiDescription>
          </KpiBox>
        </ChartBox>
      </ChartsRow>

      {/* Tabela de últimos pedidos por canal e loja */}
      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>
          Últimos 5 Pedidos
          <FilterSelect
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {Object.keys(lastOrdersByChannel).map((channel) => (
              <option key={channel} value={channel}>{channel}</option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {mockStores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
        </SectionTitle>

        <OrdersTable>
          <thead>
            <tr>
              <TableHeader>Pedido</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Loja</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Tempo</TableHeader>
            </tr>
          </thead>
          <tbody>
            {displayedOrders.map((order) => (
              <tr key={order.order}>
                <TableCell>{order.order}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.store}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.time}</TableCell>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
      </ChartBox>
    </DashboardContainer>
  );
}

export default ChannelsDashboard;
