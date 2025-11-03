import { useState } from "react";
import styled from "styled-components";
import SalesDashboard from "./Dashboards/SalesDashboard";
import CustomersDashboard from "./Dashboards/CustomersDashboard";
import ProductsDashboard from "./Dashboards/ProductsDashboard";
import ChannelsDashboard from "./Dashboards/ChannelsDashboard";
import PaymentsDashboard from "./Dashboards/PaymentDashboard";
import DeliveryDashboard from "./Dashboards/DeliveryDashboard";
import CouponsDashboard from "./Dashboards/CouponsDashboard";

const HeaderContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const HeaderButton = styled.button`
  padding: 8px 16px;
  background: ${(props) => (props.active ? "#4f46e5" : "#f3f4f6")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: ${(props) => (props.active ? "#4338ca" : "#e5e7eb")};
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
`;

function AnalyticsHeader() {
  const [selectedDashboard, setSelectedDashboard] = useState("sales");

  const renderDashboard = () => {
    switch (selectedDashboard) {
      case "sales":
        return <SalesDashboard />;
      case "customers":
        return <CustomersDashboard />;
      case "products":
        return <ProductsDashboard />;
      case "channels":
        return <ChannelsDashboard />;
      case "payments":
        return <PaymentsDashboard />;
      case "delivery":
        return <DeliveryDashboard />;
      case "coupons":
        return <CouponsDashboard />;
      default:
        return <SalesDashboard />;
    }
  };

  return (
    <>
      <HeaderContainer>
        <HeaderButton
          active={selectedDashboard === "sales"}
          onClick={() => setSelectedDashboard("sales")}
        >
          Vendas
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "customers"}
          onClick={() => setSelectedDashboard("customers")}
        >
          Clientes
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "products"}
          onClick={() => setSelectedDashboard("products")}
        >
          Produtos
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "channels"}
          onClick={() => setSelectedDashboard("channels")}
        >
          Canais
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "payments"}
          onClick={() => setSelectedDashboard("payments")}
        >
          Pagamentos
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "delivery"}
          onClick={() => setSelectedDashboard("delivery")}
        >
          Entregas
        </HeaderButton>
        <HeaderButton
          active={selectedDashboard === "coupons"}
          onClick={() => setSelectedDashboard("coupons")}
        >
          Cupons
        </HeaderButton>
      </HeaderContainer>

      <DashboardContainer>{renderDashboard()}</DashboardContainer>
    </>
  );
}

export default AnalyticsHeader;
