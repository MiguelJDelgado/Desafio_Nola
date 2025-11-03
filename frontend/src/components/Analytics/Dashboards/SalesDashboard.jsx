import { useState } from "react";
import styled from "styled-components";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

// ===== Styled Components =====
const ChartsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 35px;
`;

const ChartBox = styled.div`
  flex: 1;
  min-width: 350px;
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

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f87171", "#3b82f6", "#a855f7"];

// ===== Mock Data =====
const salesByDay = [
  { day: "01/11", total: 1200 },
  { day: "02/11", total: 1500 },
  { day: "03/11", total: 900 },
  { day: "04/11", total: 1700 },
  { day: "05/11", total: 1300 },
];

const ticketAverage = [
  { day: "01/11", value: 75 },
  { day: "02/11", value: 82 },
  { day: "03/11", value: 68 },
  { day: "04/11", value: 90 },
  { day: "05/11", value: 78 },
];

const salesByStatus = [
  { name: "Pago", value: 3400 },
  { name: "Cancelado", value: 500 },
  { name: "Pendente", value: 800 },
];

const salesByHour = [
  { hour: "08h", total: 100 },
  { hour: "09h", total: 200 },
  { hour: "10h", total: 350 },
  { hour: "11h", total: 500 },
  { hour: "12h", total: 450 },
  { hour: "13h", total: 300 },
];

const topStores = [
  { name: "Loja A", revenue: 7000 },
  { name: "Loja B", revenue: 6200 },
  { name: "Loja C", revenue: 5800 },
  { name: "Loja D", revenue: 5300 },
  { name: "Loja E", revenue: 4800 },
];

const subBrandComparison = [
  { subBrand: "SubBrand X", revenue: 10000 },
  { subBrand: "SubBrand Y", revenue: 7500 },
  { subBrand: "SubBrand Z", revenue: 6200 },
];

// ===== Componente Principal =====
function SalesDashboard() {
  return (
    <div>
      {/* Linha 1: Vendas por Dia + Ticket Médio + Vendas por Status */}
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Total de Vendas por Dia</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesByDay} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ticketAverage} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Vendas por Status</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={salesByStatus} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {salesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      {/* Linha 2: Volume de vendas por hora + Top 10 lojas + Comparativo Sub-Brands */}
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Volume de Vendas por Hora</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesByHour} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Top 10 Lojas por Faturamento</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topStores} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Comparativo de Sub-Brands</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={subBrandComparison} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subBrand" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#a855f7" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>
    </div>
  );
}

export default SalesDashboard;
