import { useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

function DeliveryDashboard() {
  const mockStores = ["Todas", "Loja 1", "Loja 2", "Loja 3", "Loja 4"];

  // Mock Data por loja para cada gráfico
  const mockProductionTime = {
    Todas: [
      { day: "Seg", value: 20 },
      { day: "Ter", value: 22 },
      { day: "Qua", value: 19 },
      { day: "Qui", value: 25 },
      { day: "Sex", value: 23 },
    ],
    "Loja 1": [{ day: "Seg", value: 18 }, { day: "Ter", value: 21 }, { day: "Qua", value: 20 }, { day: "Qui", value: 24 }, { day: "Sex", value: 22 }],
    "Loja 2": [{ day: "Seg", value: 25 }, { day: "Ter", value: 24 }, { day: "Qua", value: 22 }, { day: "Qui", value: 28 }, { day: "Sex", value: 26 }],
    "Loja 3": [{ day: "Seg", value: 21 }, { day: "Ter", value: 23 }, { day: "Qua", value: 19 }, { day: "Qui", value: 26 }, { day: "Sex", value: 24 }],
    "Loja 4": [{ day: "Seg", value: 20 }, { day: "Ter", value: 22 }, { day: "Qua", value: 18 }, { day: "Qui", value: 25 }, { day: "Sex", value: 21 }],
  };

  const mockDeliveryTime = {
    Todas: [
      { day: "Seg", value: 35 },
      { day: "Ter", value: 38 },
      { day: "Qua", value: 33 },
      { day: "Qui", value: 40 },
      { day: "Sex", value: 36 },
    ],
    "Loja 1": [{ day: "Seg", value: 32 }, { day: "Ter", value: 36 }, { day: "Qua", value: 34 }, { day: "Qui", value: 39 }, { day: "Sex", value: 35 }],
    "Loja 2": [{ day: "Seg", value: 38 }, { day: "Ter", value: 41 }, { day: "Qua", value: 36 }, { day: "Qui", value: 44 }, { day: "Sex", value: 39 }],
    "Loja 3": [{ day: "Seg", value: 34 }, { day: "Ter", value: 37 }, { day: "Qua", value: 33 }, { day: "Qui", value: 41 }, { day: "Sex", value: 36 }],
    "Loja 4": [{ day: "Seg", value: 33 }, { day: "Ter", value: 36 }, { day: "Qua", value: 31 }, { day: "Qui", value: 38 }, { day: "Sex", value: 34 }],
  };

  const mockDeliveryRevenue = {
    Todas: [
      { channel: "iFood", value: 1164520 },
      { channel: "Rappi", value: 604615 },
      { channel: "Uber Eats", value: 276894 },
    ],
    "Loja 1": [{ channel: "iFood", value: 400000 }, { channel: "Rappi", value: 300000 }, { channel: "Uber Eats", value: 150000 }],
    "Loja 2": [{ channel: "iFood", value: 350000 }, { channel: "Rappi", value: 200000 }, { channel: "Uber Eats", value: 100000 }],
    "Loja 3": [{ channel: "iFood", value: 300000 }, { channel: "Rappi", value: 150000 }, { channel: "Uber Eats", value: 90000 }],
    "Loja 4": [{ channel: "iFood", value: 200000 }, { channel: "Rappi", value: 100000 }, { channel: "Uber Eats", value: 70000 }],
  };

  const mockCourierPerformance = {
    Todas: [
      { courier: "Carlos", deliveries: 40, revenue: 50000 },
      { courier: "Ana", deliveries: 35, revenue: 45000 },
      { courier: "Bruno", deliveries: 30, revenue: 38000 },
    ],
    "Loja 1": [{ courier: "Carlos", deliveries: 12, revenue: 15000 }, { courier: "Ana", deliveries: 10, revenue: 12000 }, { courier: "Bruno", deliveries: 8, revenue: 9000 }],
    "Loja 2": [{ courier: "Carlos", deliveries: 15, revenue: 18000 }, { courier: "Ana", deliveries: 12, revenue: 14000 }, { courier: "Bruno", deliveries: 10, revenue: 12000 }],
    "Loja 3": [{ courier: "Carlos", deliveries: 8, revenue: 12000 }, { courier: "Ana", deliveries: 6, revenue: 10000 }, { courier: "Bruno", deliveries: 5, revenue: 8000 }],
    "Loja 4": [{ courier: "Carlos", deliveries: 5, revenue: 7000 }, { courier: "Ana", deliveries: 4, revenue: 6000 }, { courier: "Bruno", deliveries: 3, revenue: 5000 }],
  };

  const mockTopCities = {
    Todas: [
      { city: "São Paulo", state: "SP", orders: 120, revenue: 580000 },
      { city: "Sorocaba", state: "SP", orders: 85, revenue: 400000 },
      { city: "Campinas", state: "SP", orders: 70, revenue: 350000 },
      { city: "Barueri", state: "SP", orders: 50, revenue: 200000 },
      { city: "Osasco", state: "SP", orders: 45, revenue: 180000 },
    ],
    "Loja 1": [
      { city: "São Paulo", state: "SP", orders: 50, revenue: 240000 },
      { city: "Sorocaba", state: "SP", orders: 20, revenue: 90000 },
      { city: "Campinas", state: "SP", orders: 10, revenue: 50000 },
    ],
  };

  const [storeProduction, setStoreProduction] = useState("Todas");
  const [storeDeliveryTime, setStoreDeliveryTime] = useState("Todas");
  const [storeRevenue, setStoreRevenue] = useState("Todas");
  const [storeCourier, setStoreCourier] = useState("Todas");
  const [storeCities, setStoreCities] = useState("Todas");

  return (
    <DashboardContainer>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Tempo Médio de Produção (min)</SectionTitle>
          <FilterSelect value={storeProduction} onChange={(e) => setStoreProduction(e.target.value)}>
            {mockStores.map((s) => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockProductionTime[storeProduction]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Tempo Médio de Entrega (min)</SectionTitle>
          <FilterSelect value={storeDeliveryTime} onChange={(e) => setStoreDeliveryTime(e.target.value)}>
            {mockStores.map((s) => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockDeliveryTime[storeDeliveryTime]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita de Delivery</SectionTitle>
          <FilterSelect value={storeRevenue} onChange={(e) => setStoreRevenue(e.target.value)}>
            {mockStores.map((s) => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockDeliveryRevenue[storeRevenue]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Performance dos Couriers</SectionTitle>
          <FilterSelect value={storeCourier} onChange={(e) => setStoreCourier(e.target.value)}>
            {mockStores.map((s) => <option key={s} value={s}>{s}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={mockCourierPerformance[storeCourier]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="courier" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#4f46e5" name="Entregas" />
              <Bar dataKey="revenue" fill="#10b981" name="Receita" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>Cidades com Mais Pedidos</SectionTitle>
        <FilterSelect value={storeCities} onChange={(e) => setStoreCities(e.target.value)}>
          {mockStores.map((s) => <option key={s} value={s}>{s}</option>)}
        </FilterSelect>
        <OrdersTable>
          <thead>
            <tr>
              <TableHeader>Cidade</TableHeader>
              <TableHeader>Estado</TableHeader>
              <TableHeader>Quantidade de Pedidos</TableHeader>
              <TableHeader>Receita Total</TableHeader>
            </tr>
          </thead>
          <tbody>
            {mockTopCities[storeCities].map((c) => (
              <tr key={c.city}>
                <TableCell>{c.city}</TableCell>
                <TableCell>{c.state}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>{c.revenue}</TableCell>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
      </ChartBox>
    </DashboardContainer>
  );
}

export default DeliveryDashboard;
