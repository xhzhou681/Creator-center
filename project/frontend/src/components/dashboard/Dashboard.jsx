import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styled from 'styled-components';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  if (!currentUser) return null;
  
  return (
    <DashboardContainer>
      <Sidebar>
        <SidebarHeader>
          <h3>Creator Center</h3>
        </SidebarHeader>
        
        <NavMenu>
          <NavItem>
            <Link to="/">Dashboard</Link>
          </NavItem>
          <NavItem>
            <Link to="/videos">My Videos</Link>
          </NavItem>
          <NavItem>
            <Link to="/analytics">Analytics</Link>
          </NavItem>
          <NavItem>
            <Link to="/trending">Trending</Link>
          </NavItem>
          <NavItem>
            <Link to="/ai-assistant">AI Assistant</Link>
          </NavItem>
        </NavMenu>
        
        <LogoutButton onClick={handleLogout}>
          Logout
        </LogoutButton>
      </Sidebar>
      
      <MainContent>
        <Header>
          <h2>Welcome, {currentUser.username}!</h2>
          <UserInfo>
            <span>{currentUser.email}</span>
          </UserInfo>
        </Header>
        
        <ContentSection>
          <SectionTitle>Quick Stats</SectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>Videos</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>Views</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>Subscribers</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>0</StatValue>
              <StatLabel>Comments</StatLabel>
            </StatCard>
          </StatsGrid>
        </ContentSection>
        
        <ContentSection>
          <SectionTitle>Recent Videos</SectionTitle>
          <EmptyState>
            <p>You haven't uploaded any videos yet.</p>
            <Link to="/videos">Upload your first video</Link>
          </EmptyState>
        </ContentSection>
      </MainContent>
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

const NavItem = styled.li`
  a {
    display: block;
    padding: 1rem 1.5rem;
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: all 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const LogoutButton = styled.button`
  margin: 1rem;
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;
  background-color: #f5f7fa;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h2 {
    margin: 0;
    color: #2c3e50;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  
  span {
    color: #7f8c8d;
  }
`;

const ContentSection = styled.section`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #2c3e50;
  font-size: 1.25rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #4a90e2;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.875rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  
  a {
    display: inline-block;
    margin-top: 1rem;
    color: #4a90e2;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Dashboard;