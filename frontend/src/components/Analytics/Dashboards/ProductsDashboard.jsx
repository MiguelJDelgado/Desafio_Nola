import { useState } from "react";
import styled from "styled-components";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#e11d48", "#8b5cf6"];

// ----- MOCK DATA -----
const stores = ["Loja 1", "Loja 2", "Loja 3", "Loja 4", "Loja 5"];

// Função para gerar valores mockados diferentes por loja
const generateMockData = (baseData) => {
  return stores.reduce((acc, store) => {
    acc[store] = baseData.map((item) => ({
      ...item,
      value: Math.floor(item.value * (0.5 + Math.random())), // randomizar
      revenue: Math.floor((item.revenue || item.value) * (0.5 + Math.random())),
    }));
    return acc;
  }, {});
};

const topProductsBase = [
  { name: "Produto A", value: 1200 },
  { name: "Produto B", value: 900 },
  { name: "Produto C", value: 700 },
  { name: "Produto D", value: 500 },
  { name: "Produto E", value: 300 },
];

const revenuePerProductBase = [
  { name: "Produto A", revenue: 12000 },
  { name: "Produto B", revenue: 9000 },
  { name: "Produto C", revenue: 7000 },
  { name: "Produto D", revenue: 5000 },
  { name: "Produto E", revenue: 3000 },
];

const revenuePerCategoryBase = [
  { name: "Categoria 1", revenue: 20000 },
  { name: "Categoria 2", revenue: 15000 },
  { name: "Categoria 3", revenue: 10000 },
];

const topCustomizationsBase = [
  { name: "Extra Queijo", value: 500 },
  { name: "Molho Especial", value: 400 },
  { name: "Tamanho Grande", value: 300 },
];

// ----- GERAR MOCK DATA POR LOJA -----
const topProductsData = generateMockData(topProductsBase);
const revenuePerProductData = generateMockData(revenuePerProductBase);
const revenuePerCategoryData = generateMockData(revenuePerCategoryBase);
const topCustomizationsData = generateMockData(topCustomizationsBase);

// ----- COMPONENT -----
function ProductsDashboard() {
  const [selectedStoreTopProducts, setSelectedStoreTopProducts] = useState(stores[0]);
  const [selectedStoreRevenueProduct, setSelectedStoreRevenueProduct] = useState(stores[0]);
  const [selectedStoreRevenueCategory, setSelectedStoreRevenueCategory] = useState(stores[0]);
  const [selectedStoreCustomizations, setSelectedStoreCustomizations] = useState(stores[0]);

  return (
    <div>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Top Produtos Vendidos</SectionTitle>
          <FilterSelect
            value={selectedStoreTopProducts}
            onChange={(e) => setSelectedStoreTopProducts(e.target.value)}
          >
            {stores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProductsData[selectedStoreTopProducts]} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita por Produto</SectionTitle>
          <FilterSelect
            value={selectedStoreRevenueProduct}
            onChange={(e) => setSelectedStoreRevenueProduct(e.target.value)}
          >
            {stores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenuePerProductData[selectedStoreRevenueProduct]} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita por Categoria</SectionTitle>
          <FilterSelect
            value={selectedStoreRevenueCategory}
            onChange={(e) => setSelectedStoreRevenueCategory(e.target.value)}
          >
            {stores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenuePerCategoryData[selectedStoreRevenueCategory]}
                dataKey="revenue"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label
              >
                {revenuePerCategoryData[selectedStoreRevenueCategory].map((entry, index) => (
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
          <SectionTitle>Customizações Mais Usadas</SectionTitle>
          <FilterSelect
            value={selectedStoreCustomizations}
            onChange={(e) => setSelectedStoreCustomizations(e.target.value)}
          >
            {stores.map((store) => (
              <option key={store} value={store}>{store}</option>
            ))}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topCustomizationsData[selectedStoreCustomizations]} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>
    </div>
  );
}

export default ProductsDashboard;
