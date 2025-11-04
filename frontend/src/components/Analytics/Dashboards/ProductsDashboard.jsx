import { useState, useEffect } from "react";
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

// ----- IMPORT CORRETO DOS ENDPOINTS -----
import {
  topProducts,
  topCategoriesByStore,
  revenueByProduct,
  lowTurnoverProducts
} from "../../../services/analyticsProductsServices";

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

const FilterSelect = styled.select`
  margin-bottom: 10px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#e11d48", "#8b5cf6"];

function ProductsDashboard() {
  const [stores, setStores] = useState([]);
  const [selectedStoreTopProducts, setSelectedStoreTopProducts] = useState("");
  const [selectedStoreRevenueProduct, setSelectedStoreRevenueProduct] = useState("");
  const [/*selectedStoreRevenueCategory*/, setSelectedStoreRevenueCategory] = useState("");
  const [selectedStoreCustomizations, setSelectedStoreCustomizations] = useState("");

  const [topProductsData, setTopProductsData] = useState([]);
  const [revenuePerProductData, setRevenuePerProductData] = useState([]);
  const [revenuePerCategoryData, setRevenuePerCategoryData] = useState([]);
  const [topCustomizationsData, setTopCustomizationsData] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await topCategoriesByStore({ startDate: "2025-01-01", endDate: "2025-12-31", limit: 5 });
        const storeList = res.map(store => ({ id: store.store_id, name: store.store_name }));
        setStores(storeList);
        if (storeList.length > 0) {
          setSelectedStoreTopProducts(storeList[0].id);
          setSelectedStoreRevenueProduct(storeList[0].id);
          setSelectedStoreRevenueCategory(storeList[0].id);
          setSelectedStoreCustomizations(storeList[0].id);
        }
      } catch (err) {
        console.error("Erro ao carregar lojas:", err);
      }
    };
    fetchStores();
  }, []);

  useEffect(() => {
    if (!selectedStoreTopProducts) return;
    const fetchTopProducts = async () => {
      try {
        const res = await topProducts({
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          store_id: selectedStoreTopProducts,
          limit: 10
        });
        const formatted = res.map(item => ({ name: item.product_name, value: item.total_sold }));
        setTopProductsData(formatted);
      } catch (err) {
        console.error("Erro ao carregar top products:", err);
      }
    };
    fetchTopProducts();
  }, [selectedStoreTopProducts]);

  useEffect(() => {
    if (!selectedStoreRevenueProduct) return;

    const fetchRevenueProducts = async () => {
      try {
        const res = await revenueByProduct({
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          store_id: selectedStoreRevenueProduct,
          limit: 10
        });

        const formatted = res.map(item => ({
          name: item.product_name,
          revenue: item.total_revenue,
          formattedRevenue: new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(item.total_revenue)
        }));

        setRevenuePerProductData(formatted);
      } catch (err) {
        console.error("Erro ao carregar revenue products:", err);
        setRevenuePerProductData([]);
      }
    };

    fetchRevenueProducts();
  }, [selectedStoreRevenueProduct]);


  useEffect(() => {
    const fetchRevenueCategories = async () => {
      try {
        const res = await topCategoriesByStore({
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          limit: 5
        });

        const storeData = res[0]; 
        if (storeData && storeData.top_categories) {
          const formatted = storeData.top_categories.map(item => ({
            name: item.category_name,
            revenue: item.total_revenue,
            formattedRevenue: new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(item.total_revenue)
          }));
          setRevenuePerCategoryData(formatted);
        } else {
          setRevenuePerCategoryData([]);
        }
      } catch (err) {
        console.error("Erro ao carregar revenue categories:", err);
        setRevenuePerCategoryData([]);
      }
    };

    fetchRevenueCategories();
  }, []);



  useEffect(() => {
    if (!selectedStoreCustomizations) return;
    const fetchCustomizations = async () => {
      try {
        const res = await lowTurnoverProducts({
          startDate: "2025-01-01",
          endDate: "2025-12-31",
          store_id: selectedStoreCustomizations,
          limit: 10
        });
        const formatted = res.map(item => ({ name: item.product_name, value: item.total_sold }));
        setTopCustomizationsData(formatted);
      } catch (err) {
        console.error("Erro ao carregar top customizations:", err);
      }
    };
    fetchCustomizations();
  }, [selectedStoreCustomizations]);

  return (
    <div>
      <ChartsRow>
        <ChartBox>
          <SectionTitle>Top Produtos Vendidos</SectionTitle>
          <FilterSelect value={selectedStoreTopProducts} onChange={(e) => setSelectedStoreTopProducts(e.target.value)}>
            {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topProductsData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-13}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 9 }}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" name="Unidades"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita por Produto</SectionTitle>
          <FilterSelect value={selectedStoreRevenueProduct} onChange={(e) => setSelectedStoreRevenueProduct(e.target.value)}>
            {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenuePerProductData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-13}
                textAnchor="end"
                interval={0}
                tick={{ fontSize: 9 }}
              />
              <YAxis />
              <Tooltip formatter={(value, name, props) => {
                const item = props.payload;
                return item?.formattedRevenue || value;
              }} />
              <Bar dataKey="revenue" fill="#10b981" name="Receita"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>

        <ChartBox>
          <SectionTitle>Receita por Categoria</SectionTitle>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={revenuePerCategoryData}
                dataKey="revenue"
                nameKey="name"
                innerRadius={40}
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {revenuePerCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value, name, props) => {
                const item = props.payload;
                return item?.formattedRevenue || value;
              }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>

      <ChartsRow>
        <ChartBox style={{ flex: 1 }}>
          <SectionTitle>Customizações Mais Usadas</SectionTitle>
          <FilterSelect value={selectedStoreCustomizations} onChange={(e) => setSelectedStoreCustomizations(e.target.value)}>
            {stores.map(store => <option key={store.id} value={store.id}>{store.name}</option>)}
          </FilterSelect>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomizationsData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f59e0b" name="Pedidos"/>
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </ChartsRow>
    </div>
  );
}

export default ProductsDashboard;
