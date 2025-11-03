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
  Legend,
} from "recharts";

// ----- STYLED COMPONENTS -----
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

// ----- MOCK DATA -----
const totalCustomersData = [
  { day: "01/10", value: 120 },
  { day: "02/10", value: 135 },
  { day: "03/10", value: 150 },
  { day: "04/10", value: 160 },
];

const genderDistributionData = [
  { name: "Masculino", value: 55 },
  { name: "Feminino", value: 40 },
  { name: "Outro", value: 5 },
];

const ageDistributionData = [
  { name: "18-25", value: 30 },
  { name: "26-35", value: 50 },
  { name: "36-45", value: 25 },
  { name: "46-60", value: 15 },
];

const activeInactiveData = [
  { name: "Ativos", value: 80 },
  { name: "Inativos", value: 20 },
];

const retentionData = [
  { month: "Jan", retained: 90 },
  { month: "Feb", retained: 75 },
  { month: "Mar", retained: 60 },
  { month: "Apr", retained: 55 },
  { month: "May", retained: 50 },
  { month: "Jun", retained: 48 },
  { month: "Jul", retained: 45 },
  { month: "Aug", retained: 43 },
];

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#e11d48"];

// ----- COMPONENT -----
function CustomersDashboard() {
  const [selectedGenderFilter, setSelectedGenderFilter] = useState("all");

  return (
    <div>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Total de Clientes</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={totalCustomersData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Distribuição por Gênero</SectionTitle>
          <FilterSelect value={selectedGenderFilter} onChange={(e) => setSelectedGenderFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderDistributionData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {genderDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Faixa Etária</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ageDistributionData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {ageDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartsRow>
        <ChartBox>
          <SectionTitle>Clientes Ativos vs Inativos</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={activeInactiveData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {activeInactiveData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Retenção de Clientes (últimos 8 meses)</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={retentionData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis unit="%" />
              <Tooltip />
              <Line type="monotone" dataKey="retained" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>
    </div>
  );
}

export default CustomersDashboard;
