import { useState } from "react";
import styled from "styled-components";
import CustomersDashboard from "./Dashboards/CustomersDashboard";
import ProductsDashboard from "./Dashboards/ProductsDashboard";
import ChannelsDashboard from "./Dashboards/ChannelsDashboard";
import PaymentsDashboard from "./Dashboards/PaymentDashboard";
import DeliveryDashboard from "./Dashboards/DeliveryDashboard";
import CouponsDashboard from "./Dashboards/CouponsDashboard";

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  margin-top: 35px;
`;

const HeaderContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

const HeaderButton = styled.button`
  padding: 10px 20px;
  background: ${(props) => (props.active ? "#4f46e5" : "#f3f4f6")};
  color: ${(props) => (props.active ? "white" : "#333")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.25s ease;
  font-size: 15px;
  letter-spacing: 0.3px;

  &:hover {
    background: ${(props) => (props.active ? "#4338ca" : "#e5e7eb")};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DashboardContainer = styled.div`
  width: 100%;
`;

function AnalyticsHeader() {
  const [selectedDashboard, setSelectedDashboard] = useState("customers");

  const renderDashboard = () => {
    switch (selectedDashboard) {
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
        return <CustomersDashboard />;
    }
  };

  return (
    <>
      <HeaderWrapper>
        <HeaderContainer>
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
      </HeaderWrapper>

      <DashboardContainer>{renderDashboard()}</DashboardContainer>
    </>
  );
}

export default AnalyticsHeader;
