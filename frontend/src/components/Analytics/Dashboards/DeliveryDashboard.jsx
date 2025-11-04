import { useEffect, useState } from "react";
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
import {
  averageDeliveryTime,
  averageProductionTime,
  performanceByCarrier,
  deliveryRevenueByChannel,
  topCities,
} from "../../../services/analyticsDeliveryServices";

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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

const formatCurrencyShort = (value) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(0)}k`;
  return `R$ ${value.toFixed(0)}`;
};

const formatCurrencyFull = (value) => {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

function DeliveryDashboard() {
  const [stores, /*setStores*/] = useState(["Todas", "Loja 1", "Loja 2", "Loja 3", "Loja 4"]);

  const [storeProduction, setStoreProduction] = useState("Todas");
  const [storeDeliveryTime, setStoreDeliveryTime] = useState("Todas");
  const [storeCourier, setStoreCourier] = useState("Todas");

  const [productionTimeData, setProductionTimeData] = useState([]);
  const [deliveryTimeData, setDeliveryTimeData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [courierPerformanceData, setCourierPerformanceData] = useState([]);
  const [topCitiesData, setTopCitiesData] = useState([]);

  const storeMap = {
    "Loja 1": 1,
    "Loja 2": 2,
    "Loja 3": 3,
    "Loja 4": 4,
  };

  const loadProductionTime = async (store) => {
    try {
      const store_id = storeMap[store] || null;
      const data = await averageProductionTime({ store_id });
      setProductionTimeData(
        data.map((d) => ({
          day: d.weekday.trim(),
          value: parseFloat(d.avg_production_time),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar tempo médio de produção:", err);
    }
  };

  const loadDeliveryTime = async (store) => {
    try {
      const store_id = storeMap[store] || null;
      const data = await averageDeliveryTime({ store_id });
      setDeliveryTimeData(
        data.map((d) => ({
          day: d.weekday.trim(),
          value: parseFloat(d.avg_delivery_time),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar tempo médio de entrega:", err);
    }
  };

  const loadRevenue = async () => {
    try {
      const data = await deliveryRevenueByChannel({});
      setRevenueData(
        data.map((d) => ({
          channel: d.channel_name,
          value: parseFloat(d.total_revenue),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar receita de delivery:", err);
    }
  };

  const loadCourierPerformance = async (store) => {
    try {
      const store_id = storeMap[store] || null;
      const data = await performanceByCarrier({ store_id });
      setCourierPerformanceData(
        data.map((d) => ({
          courier: `Ent ${d.carrier_id}`,
          deliveries: parseInt(d.total_deliveries),
          success: parseFloat(d.success_rate),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar performance de couriers:", err);
    }
  };

  const loadTopCities = async () => {
    try {
      const data = await topCities({});
      setTopCitiesData(
        data.map((c) => ({
          city: c.city,
          state: c.state,
          orders: parseInt(c.total_orders),
          revenue: parseFloat(c.total_revenue).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
        }))
      );
    } catch (err) {
      console.error("Erro ao buscar cidades com mais pedidos:", err);
    }
  };

  // --- useEffects ---
  useEffect(() => {
    loadProductionTime(storeProduction);
  }, [storeProduction]);

  useEffect(() => {
    loadDeliveryTime(storeDeliveryTime);
  }, [storeDeliveryTime]);

  useEffect(() => {
    loadRevenue();
  }, []);

  useEffect(() => {
    loadCourierPerformance(storeCourier);
  }, [storeCourier]);

  useEffect(() => {
    loadTopCities();
  }, []);

  return (
    <DashboardContainer>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Tempo Médio de Produção (min)</SectionTitle>
          <FilterSelect
            value={storeProduction}
            onChange={(e) => setStoreProduction(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={productionTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                angle={-22}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" name="Tempo"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Tempo Médio de Entrega (min)</SectionTitle>
          <FilterSelect
            value={storeDeliveryTime}
            onChange={(e) => setStoreDeliveryTime(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                angle={-22}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" name="Tempo"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita de Delivery</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="channel"
                angle={-20}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis tickFormatter={formatCurrencyShort} />
              <Tooltip formatter={(value) => formatCurrencyFull(value)} />
              <Bar dataKey="value" fill="#f59e0b" name="Valor" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Performance dos Entregadores</SectionTitle>
          <FilterSelect
            value={storeCourier}
            onChange={(e) => setStoreCourier(e.target.value)}
          >
            {stores.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courierPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="courier"
                angle={-22}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 11 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="deliveries" fill="#4f46e5" name="Entregas" />
              <Bar dataKey="success" fill="#10b981" name="Taxa de Sucesso (%)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartBox style={{ flex: "1 1 100%" }}>
        <SectionTitle>Cidades com Mais Pedidos</SectionTitle>
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
            {topCitiesData.map((c) => (
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
