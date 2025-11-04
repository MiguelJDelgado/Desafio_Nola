import { useEffect, useState } from "react";
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

import {
  salesCountByChannel,
  avgTicketByChannel,
  deliveryVsPresencial as getDeliveryVsPresencial,
  deliveryRate as getDeliveryRate,
  lastOrders as getLastOrders,
} from "../../../services/analyticsChannelsServices";

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
  const COLORS = ["#0073f7ff", "#10b981", "#f59e0b", "#ef4444", "#8f16f1ff", "#f1166aff",];
  const stores = ["Loja 1", "Loja 2", "Loja 3", "Loja 4", "Loja 5"];

  const [storeFilterRevenue, setStoreFilterRevenue] = useState(stores[0]);
  const [storeFilterAvgTicket, setStoreFilterAvgTicket] = useState(stores[0]);
  const [storeFilterDelivery, setStoreFilterDelivery] = useState(stores[0]);
  const [storeFilterLastOrders, setStoreFilterLastOrders] = useState(stores[0]);
  const [channelFilterLastOrders, setChannelFilterLastOrders] = useState("");

  const [revenueByChannel, setRevenueByChannel] = useState([]);
  const [avgTicketData, setAvgTicketData] = useState([]);
  const [deliveryVsPresencial, setDeliveryVsPresencial] = useState([]);
  const [deliveryRate, setDeliveryRate] = useState(0);
  const [lastOrdersByChannel, setLastOrdersByChannel] = useState({});

  const loadRevenueByChannel = async () => {
    try {
      const store_id = stores.indexOf(storeFilterRevenue) + 1;
      const data = await salesCountByChannel({ store_id });
      setRevenueByChannel(
        data.map(d => ({ name: d.channel_name, value: parseInt(d.total_sales) }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadAvgTicketByChannel = async () => {
    try {
      const store_id = stores.indexOf(storeFilterAvgTicket) + 1;
      const data = await avgTicketByChannel({ store_id });
      setAvgTicketData(
        data.map(d => ({
          name: d.channel_name,
          value: parseFloat(d.avg_ticket).toFixed(2),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const loadDeliveryVsPresencial = async () => {
    try {
      const store_id = stores.indexOf(storeFilterDelivery) + 1;
      const data = await getDeliveryVsPresencial({ store_id });
      const deliveryTotal = data.find(d => d.type === "Delivery")?.total_orders || 0;
      const presencialTotal = data.find(d => d.type === "Presencial")?.total_orders || 0;
      setDeliveryVsPresencial([{ day: "Total", Presencial: parseInt(presencialTotal), Delivery: parseInt(deliveryTotal) }]);
    } catch (err) {
      console.error(err);
    }
  };

  const loadDeliveryRate = async () => {
    try {
      const data = await getDeliveryRate();
      setDeliveryRate(parseFloat(data.delivery_rate).toFixed(2));
    } catch (err) {
      console.error(err);
    }
  };

  const loadLastOrders = async () => {
    try {
      const store_id = stores.indexOf(storeFilterLastOrders) + 1;
      const data = await getLastOrders({ store_id });
      const grouped = {};
      data.forEach(d => {
        if (!grouped[d.channel_name]) grouped[d.channel_name] = [];
        grouped[d.channel_name].push({
          order: d.order_id,
          customer: d.customer_name,
          store: `Loja ${d.store_id}`,
          status: "Entregue",
          time: "-",
        });
      });
      setLastOrdersByChannel(grouped);

      if (!channelFilterLastOrders) setChannelFilterLastOrders(Object.keys(grouped)[0] || "");
    } catch (err) {
      console.error(err);
    }
  };

  // --- useEffect para carregar dados ---
  useEffect(() => { loadRevenueByChannel(); }, [storeFilterRevenue]);
  useEffect(() => { loadAvgTicketByChannel(); }, [storeFilterAvgTicket]);
  useEffect(() => { loadDeliveryVsPresencial(); }, [storeFilterDelivery]);
  useEffect(() => { loadDeliveryRate(); }, []);
  useEffect(() => { loadLastOrders(); }, [storeFilterLastOrders]);

  const displayedOrders = lastOrdersByChannel[channelFilterLastOrders]?.filter(
    order => order.store === storeFilterLastOrders
  ) || [];

  return (
    <DashboardContainer>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Vendas por Canal</SectionTitle>
          <FilterSelect value={storeFilterRevenue} onChange={e => setStoreFilterRevenue(e.target.value)}>
            {stores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenueByChannel}
                dataKey="value"
                nameKey="name"
                innerRadius={40}
                outerRadius={70}
                label
              >
                {revenueByChannel.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Ticket Médio por Canal</SectionTitle>
          <FilterSelect value={storeFilterAvgTicket} onChange={e => setStoreFilterAvgTicket(e.target.value)}>
            {stores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={avgTicketData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={val => `R$ ${Number(val).toLocaleString("pt-BR", {minimumFractionDigits:2})}`} />
              <Tooltip formatter={val => `R$ ${Number(val).toLocaleString("pt-BR", {minimumFractionDigits:2})}`} />
              <Bar dataKey="value" fill="#4f46e5" name="Valor"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Delivery vs Presencial</SectionTitle>
          <FilterSelect value={storeFilterDelivery} onChange={e => setStoreFilterDelivery(e.target.value)}>
            {stores.map(store => <option key={store}>{store}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryVsPresencial}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Presencial" stackId="a" fill="#4f46e5" name="Presencial (pedidos)"/>
              <Bar dataKey="Delivery" stackId="a" fill="#10b981" name="Delivery (pedidos)"/>
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

      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>
          Últimos 5 Pedidos
          <FilterSelect
            value={channelFilterLastOrders}
            onChange={e => setChannelFilterLastOrders(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {Object.keys(lastOrdersByChannel).map(channel => (
              <option key={channel}>{channel}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={storeFilterLastOrders}
            onChange={e => setStoreFilterLastOrders(e.target.value)}
            style={{ marginLeft: "10px" }}
          >
            {stores.map(store => <option key={store}>{store}</option>)}
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
            {displayedOrders.slice(0, 5).map(order => (
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
