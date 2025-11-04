import { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";

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
import {
  revenueByPaymentMethod,
  voucherPayment,
  avgTicketByPayment,
  lastCancelledOrRefunded,
  topPayments,
} from "../../../services/analyticsPaymentsService";

// --- Estilos ---
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const ChartsRow = styled.div`
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  margin-left: 20px;
  margin-top: 35px;
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

const formatCurrencyShort = (value) => {
  if (!value) return "R$ 0";
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
  return `R$ ${parseFloat(value).toFixed(0)}`;
};

const formatCurrencyFull = (value) => {
  if (!value) return "R$ 0";
  return parseFloat(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function PaymentsDashboard() {
  const COLORS = ["#8017e2ff", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"];
  const mockStores = ["Todas", "Loja 1", "Loja 2", "Loja 3", "Loja 4", "Loja 5"];

  const [filterRevenue, setFilterRevenue] = useState("Todas");
  const [filterTopPayments, setFilterTopPayments] = useState("Todas");
  const [filterAvgTicket, setFilterAvgTicket] = useState("Todas");
  const [filterCancelled, setFilterCancelled] = useState("Todas");

  const [revenueData, setRevenueData] = useState([]);
  const [onlinePaymentRate, setOnlinePaymentRate] = useState(0);
  const [topPaymentMethodsData, setTopPaymentMethodsData] = useState([]);
  const [avgTicketData, setAvgTicketData] = useState([]);
  const [cancelledOrdersData, setCancelledOrdersData] = useState([]);

  const loadRevenue = async (store) => {
    try {
      const store_id = store === "Todas" ? null : mockStores.indexOf(store);
      const data = await revenueByPaymentMethod({ store_id });
      setRevenueData(
        data.map(d => ({ name: d.payment_method, value: parseFloat(d.total_revenue) }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadOnlinePaymentRate = async () => {
    try {
      const data = await voucherPayment();
      setOnlinePaymentRate(parseFloat(data.online_rate).toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  const loadTopPayments = async (store) => {
    try {
      const store_id = store === "Todas" ? null : mockStores.indexOf(store);
      const data = await topPayments({ store_id, limit: 5 });
      setTopPaymentMethodsData(
        data.map(d => ({ name: d.payment_method, count: parseInt(d.total_usage) }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadAvgTicket = async (store) => {
    try {
      const store_id = store === "Todas" ? null : mockStores.indexOf(store);
      const data = await avgTicketByPayment({ store_id });
      setAvgTicketData(
        data.map(d => ({ name: d.payment_method, value: parseFloat(d.avg_ticket) }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadCancelledOrders = async (store) => {
    try {
      const store_id = store === "Todas" ? null : mockStores.indexOf(store);
      const data = await lastCancelledOrRefunded({ store_id });
      setCancelledOrdersData(
        data.map(d => ({
          order: d.order_id ?? "Não Informado",
          customer: d.customer ?? "Não Informado",
          payment: d.payment_method ?? "Não Informado",
          amount: d.total_amount ?? "Não Informado",
          cancelled_at: d.cancelled_at ? new Date(d.cancelled_at) : null,
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadRevenue(filterRevenue); }, [filterRevenue]);
  useEffect(() => { loadTopPayments(filterTopPayments); }, [filterTopPayments]);
  useEffect(() => { loadAvgTicket(filterAvgTicket); }, [filterAvgTicket]);
  useEffect(() => { loadCancelledOrders(filterCancelled); }, [filterCancelled]);
  useEffect(() => { loadOnlinePaymentRate(); }, []);

  return (
    <DashboardContainer>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Receita por Tipo de Pagamento</SectionTitle>
          <FilterSelect value={filterRevenue} onChange={e => setFilterRevenue(e.target.value)}>
            {mockStores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis tickFormatter={formatCurrencyShort} />
              <Tooltip formatter={value => formatCurrencyFull(value)} />
              <Bar dataKey="value" fill="#4f46e5" name="Valor"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>% de Pagamentos Por Vales</SectionTitle>
          <KpiBox>{onlinePaymentRate}%</KpiBox>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Top 5 Formas de Pagamento</SectionTitle>
          <FilterSelect value={filterTopPayments} onChange={e => setFilterTopPayments(e.target.value)}>
            {mockStores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={topPaymentMethodsData} dataKey="count" nameKey="name" innerRadius={40} outerRadius={80} label>
                {topPaymentMethodsData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio por Tipo de Pagamento</SectionTitle>
          <FilterSelect value={filterAvgTicket} onChange={e => setFilterAvgTicket(e.target.value)}>
            {mockStores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgTicketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={value => formatCurrencyFull(value)} />
              <Bar dataKey="value" fill="#10b981" name="Valor"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>Últimos 5 Pedidos Cancelados ou Estornados</SectionTitle>
        <FilterSelect value={filterCancelled} onChange={e => setFilterCancelled(e.target.value)}>
          {mockStores.map(store => <option key={store}>{store}</option>)}
        </FilterSelect>
        <OrdersTable>
          <thead>
            <tr>
              <TableHeader>Pedido</TableHeader>
              <TableHeader>Cliente</TableHeader>
              <TableHeader>Pagamento</TableHeader>
              <TableHeader>Valor</TableHeader>
              <TableHeader>Data do Cancelamento</TableHeader>
            </tr>
          </thead>
          <tbody>
            {cancelledOrdersData.slice(0, 5).map(order => (
              <tr key={order.order}>
                <TableCell>{order.order}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>{order.amount !== "Não Informado" ? formatCurrencyFull(order.amount) : "Não Informado"}</TableCell>
                <TableCell>{order.cancelled_at ? format(order.cancelled_at, "dd/MM/yyyy") : "Não Informado"}</TableCell>
              </tr>
            ))}
          </tbody>
        </OrdersTable>
      </ChartBox>
    </DashboardContainer>
  );
}

export default PaymentsDashboard;
