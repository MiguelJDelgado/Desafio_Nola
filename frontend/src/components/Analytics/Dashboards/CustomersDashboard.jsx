import { useEffect, useState } from "react";
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

import {
  newCustomers,
  activeInactiveCustomers,
  genderDistribution,
  ageDistribution,
  customerRetention,
} from "../../../services/analyticsCustomersServices";

const ChartsRow = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-bottom: 35px;
  margin-left: 20px;
  margin-top: 35px;
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

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#e11d48", "#3b82f6", "#8b5cf6"];

function CustomersDashboard() {
  const [storeFilter, /*setStoreFilter*/] = useState(1);
  const [totalCustomersData, setTotalCustomersData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [activeInactiveData, setActiveInactiveData] = useState([]);
  const [retentionData, setRetentionData] = useState([]);

  const loadTotalCustomers = async () => {
    try {
      const data = await newCustomers({ startDate: "2025-07-01", endDate: "2025-10-31" });
      const grouped = data.reduce((acc, cur) => {
        const day = new Date(cur.registration_date).toLocaleDateString("pt-BR");
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});
      let arrayData = Object.entries(grouped).map(([day, value]) => ({ day, value }));
      arrayData.sort((a, b) => new Date(a.day.split("/").reverse().join("-")) - new Date(b.day.split("/").reverse().join("-")));
      arrayData = arrayData.slice(-7);
      setTotalCustomersData(arrayData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadGenderDistribution = async () => {
    try {
      const data = await genderDistribution({ startDate: "2025-07-01", endDate: "2025-10-31" });
      const genderMap = { M: "Masculino", F: "Feminino", NB: "Não Binário", O: "Outros" };
      const formatted = data.map(d => ({ name: genderMap[d.gender] || d.gender, value: parseInt(d.total) }));
      setGenderData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAgeDistribution = async () => {
    try {
      const data = await ageDistribution();
      setAgeData(data.map(d => ({ name: d.age_range, value: parseInt(d.total) })));
    } catch (err) {
      console.error(err);
    }
  };

  const loadActiveInactive = async () => {
    try {
      const data = await activeInactiveCustomers({ store_id: storeFilter, startDate: "2025-07-01", endDate: "2025-10-31" });
      setActiveInactiveData([
        { name: "Ativos", value: parseInt(data.active) },
        { name: "Inativos", value: parseInt(data.inactive) },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadRetention = async () => {
    try {
      const data = await customerRetention({ store_id: storeFilter });
      setRetentionData(data.map(d => ({
        month: new Date(d.month + "-01").toLocaleString("pt-BR", { month: "short" }),
        retained: parseInt(d.retained_customers),
      })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTotalCustomers();
    loadGenderDistribution();
    loadAgeDistribution();
    loadActiveInactive();
    loadRetention();
  }, [storeFilter]);

  return (
    <div>
      <ChartsRow>
        <ChartBox style={{ flex: 1 }}>
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
          <SectionTitle>Faixa Etária</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={ageData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {ageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox style={{ flex: 1 }}>
          <SectionTitle>Distribuição por Gênero</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                {genderData.map((entry, index) => (
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
          <SectionTitle>Novos clientes (Últimos 7 dias)</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={totalCustomersData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} name="Clientes"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Clientes Pagantes (Mês)</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={retentionData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 1400]} />
              <Tooltip />
              <Line type="monotone" dataKey="retained" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} name="Clientes"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

      </ChartsRow>
    </div>
  );
}

export default CustomersDashboard;
