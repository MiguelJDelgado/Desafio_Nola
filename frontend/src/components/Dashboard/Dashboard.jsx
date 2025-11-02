import { useEffect, useState } from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  padding: 30px;
  flex: 1; // ocupa todo o espaço vertical do MainContent
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background-color: #f5f5f5;
  color: #333;
`;


const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #222;
`;

const Filters = styled.div`
  display: flex;
  gap: 10px;
`;

const Select = styled.select`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  font-size: 14px;
`;

const CardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
`;

const CardTitle = styled.h3`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const CardValue = styled.p`
  font-size: 22px;
  font-weight: bold;
  color: #222;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 15px;
  color: #333;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const Th = styled.th`
  text-align: left;
  background: #eee;
  padding: 12px;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px;
  border-top: 1px solid #ddd;
`;

function Dashboard({ sidebarOpen }) {
  const [summary, setSummary] = useState({
    revenue: 0,
    avgTicket: 0,
    orders: 0,
    recurringCustomers: 0,
  });
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fakeData = {
      revenue: 25400,
      avgTicket: 62.3,
      orders: 412,
      recurringCustomers: 57,
    };
    const fakeTopProducts = [
      { name: "Pizza Calabresa", total_qty: 120, total_revenue: 4200 },
      { name: "Lasanha Bolonhesa", total_qty: 90, total_revenue: 3600 },
      { name: "Hambúrguer Clássico", total_qty: 75, total_revenue: 3100 },
    ];

    setSummary(fakeData);
    setTopProducts(fakeTopProducts);
  }, []);

  return (
    <DashboardContainer $sidebarOpen={sidebarOpen}>
      <Header>
        <Title>Dashboard</Title>
        <Filters>
          <Select>
            <option>Todos os canais</option>
            <option>iFood</option>
            <option>Rappi</option>
            <option>Balcão</option>
          </Select>
          <Select>
            <option>Últimos 7 dias</option>
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
          </Select>
        </Filters>
      </Header>

      <CardsContainer>
        <Card>
          <CardTitle>Faturamento</CardTitle>
          <CardValue>R${summary.revenue.toLocaleString()}</CardValue>
        </Card>
        <Card>
          <CardTitle>Ticket Médio</CardTitle>
          <CardValue>R${summary.avgTicket.toFixed(2)}</CardValue>
        </Card>
        <Card>
          <CardTitle>Pedidos</CardTitle>
          <CardValue>{summary.orders}</CardValue>
        </Card>
        <Card>
          <CardTitle>Clientes Recorrentes</CardTitle>
          <CardValue>{summary.recurringCustomers}</CardValue>
        </Card>
      </CardsContainer>
      
        <SectionTitle>Top Produtos</SectionTitle>
        <Table>
          <thead>
            <tr>
              <Th>Produto</Th>
              <Th>Qtd Vendida</Th>
              <Th>Receita Total (R$)</Th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, index) => (
              <tr key={index}>
                <Td>{p.name}</Td>
                <Td>{p.total_qty}</Td>
                <Td>{p.total_revenue.toLocaleString()}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
    </DashboardContainer>
  );
}

export default Dashboard;
