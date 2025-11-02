import styled from 'styled-components';
import Layout from '../components/Layout/Layout';
import DashboardComponent from '../components/Dashboard/Dashboard';
import DashboardCharts from '../components/Dashboard/DashboardCharts';

const DashboardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 0px); // garante altura mínima de tela inteira
  width: 100%;
`;


const fakeSalesData = [
  { day: "01/11", value: 1200 },
  { day: "02/11", value: 2100 },
  { day: "03/11", value: 800 },
  { day: "04/11", value: 1600 },
  { day: "05/11", value: 900 },
  { day: "06/11", value: 1700 },
  { day: "07/11", value: 2500 },
];

const fakeChannelData = [
  { name: "iFood", value: 120 },
  { name: "Rappi", value: 80 },
  { name: "Balcão", value: 50 },
];

function Dashboard() {
  return (
    <Layout>
        <DashboardWrapper>
            <DashboardComponent sidebarOpen={true} />
            <DashboardCharts salesData={fakeSalesData} channelData={fakeChannelData} />
        </DashboardWrapper>
    </Layout>
  );
}

export default Dashboard;
