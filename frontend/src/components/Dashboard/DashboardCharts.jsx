import { useState, useEffect } from "react";
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
  Legend,
} from "recharts";

const ChartsRow = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
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

const FilterSelect = styled.select`
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

function DashboardCharts({ salesData = {}, channelData = {}, topProducts = [] }) {
  const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

  const [selectedSalesProduct, setSelectedSalesProduct] = useState("all");
  const [selectedChannelProduct, setSelectedChannelProduct] = useState("all");

  // Obter os dados filtrados a partir das chaves do objeto
  const filteredSalesData = salesData[selectedSalesProduct] || [];
  const filteredChannelData = channelData[selectedChannelProduct] || [];

  return (
    <ChartsRow>
      <ChartBox>
        <SectionTitle>Vendas por Dia</SectionTitle>
        <FilterSelect
          value={selectedSalesProduct}
          onChange={(e) => setSelectedSalesProduct(e.target.value)}
        >
          <option value="all">Todas as vendas</option>
          {topProducts.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </FilterSelect>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={filteredSalesData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartBox>

      <ChartBox>
        <SectionTitle>Pedidos por Canal</SectionTitle>
        <FilterSelect
          value={selectedChannelProduct}
          onChange={(e) => setSelectedChannelProduct(e.target.value)}
        >
          <option value="all">Todos os canais</option>
          {topProducts.map((p) => (
            <option key={p.name} value={p.name}>{p.name}</option>
          ))}
        </FilterSelect>

        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={filteredChannelData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              label
            >
              {filteredChannelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartBox>
    </ChartsRow>
  );
}

export default DashboardCharts;
