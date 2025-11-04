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
  BarChart,
  Bar,
  Legend,
} from "recharts";
import * as api from "../../services/analyticsSalesServices";

const ChartsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
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

const FilterRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 20px;
  margin-top: 35px;
`;

const Select = styled.select`
  margin-left: 10px;
  padding: 5px 10px;
  font-size: 14px;
`;

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#f87171", "#3b82f6", "#a855f7"];

const formatMoney = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const formatAbbrev = (value) => {
  if (value >= 1e6) return (value / 1e6).toFixed(1) + "M";
  if (value >= 1e3) return (value / 1e3).toFixed(1) + "K";
  return value;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function SalesDashboard() {
  const [salesByDay, setSalesByDay] = useState([]);
  const [ticketAverage, setTicketAverage] = useState([]);
  const [salesByStatus, setSalesByStatus] = useState([]);
  const [salesByHour, setSalesByHour] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [storeFilter, setStoreFilter] = useState(1);
  const [stores] = useState([
    { id: 1, name: "Almeida - Câmara" },
    { id: 2, name: "Silveira - Moreira" },
    { id: 3, name: "Gomes Nascimento S/A - Mendes" },
    { id: 4, name: "Cirino - Vasconcelos da Mata" },
    { id: 5, name: "Pacheco Ltda. - Borges de Câmara" },
  ]);

  useEffect(() => {
    const fetchSalesByDay = async () => {
      const data = await api.salesByDayOfWeek({ month: 10, year: 2025, store_id: storeFilter });
      setSalesByDay(
        data.map(d => ({
          day: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][Number(d.day_of_week)],
          total: Number(d.total_sales),
          revenue: Number(d.revenue),
        }))
      );
    };

    const fetchTicketAverage = async () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 6);
      const startDate = lastWeek.toISOString().split("T")[0];
      const endDate = today.toISOString().split("T")[0];

      const data = await api.ticketAverage({ store_id: storeFilter, startDate, endDate });
      setTicketAverage(
        data.map(d => ({
          day: d.sale_date.split("-").slice(1).reverse().join("/"),
          value: Number(d.avg_ticket),
        }))
      );
    };

    const fetchSalesByStatus = async () => {
      const data = await api.salesByStatus({
        startDate: "2025-09-01",
        endDate: "2025-09-30",
        store_id: storeFilter,
      });
      setSalesByStatus(data.map(d => ({ name: d.status, value: Number(d.total_revenue) })));
    };

    const fetchSalesByHour = async () => {
      const data = await api.salesByHour({ day: "2025-10-31", store_id: storeFilter });
      setSalesByHour(
        data
          .filter(d => Number(d.hour_of_day) >= 12 && Number(d.hour_of_day) <= 23)
          .map(d => ({
            hour: `${d.hour_of_day}h`,
            total: Number(d.total_sales),
            revenue: Number(d.total_revenue),
          }))
      );
    };

    const fetchTopStores = async () => {
      const data = await api.topStores({
        limit: 10,
        startDate: "2025-01-01",
        endDate: "2025-12-31",
      });
      setTopStores(data.map(d => ({ name: d.store_name, revenue: Number(d.total_revenue) })));
    };

    fetchSalesByDay();
    fetchTicketAverage();
    fetchSalesByStatus();
    fetchSalesByHour();
    fetchTopStores();
  }, [storeFilter]);

  const revenueValues = topStores.map(s => s.revenue);
  const minRevenue = Math.min(...revenueValues);
  const maxRevenue = Math.max(...revenueValues);
  const margin = (maxRevenue - minRevenue) * 0.15;
  const yDomain = [minRevenue - margin, maxRevenue + margin];

  return (
    <div>
      <FilterRow>
        <label>Selecione a Loja:</label>
        <Select value={storeFilter} onChange={(e) => setStoreFilter(Number(e.target.value))}>
          {stores.map(store => (
            <option key={store.id} value={store.id}>
              {store.name}
            </option>
          ))}
        </Select>
      </FilterRow>

      <ChartsRow>
        <ChartBox>
          <SectionTitle>Total de Vendas por Dia</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={formatAbbrev} />
              <Tooltip formatter={formatMoney} />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} name="Vendas"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={ticketAverage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={formatAbbrev} />
              <Tooltip formatter={formatMoney} />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Valor"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Vendas por Status</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={salesByStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label={({ value }) => formatCurrency(value)}
              >
                {salesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={formatCurrency} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartsRow>
        <ChartBox>
          <SectionTitle>Volume de Vendas por Hora (12h às 23h)</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesByHour}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis tickFormatter={formatAbbrev} />
              <Tooltip formatter={formatMoney} />
              <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Valor"/>
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Top 10 Lojas por Faturamento</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topStores}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-10} textAnchor="end" interval={0} tick={{ fontSize: 9 }} />
              <YAxis
                tickFormatter={formatAbbrev}
                domain={yDomain}
              />
              <Tooltip formatter={formatMoney} />
              <Bar dataKey="revenue" fill="#3b82f6" name="Valor"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>
    </div>
  );
}

export default SalesDashboard;
