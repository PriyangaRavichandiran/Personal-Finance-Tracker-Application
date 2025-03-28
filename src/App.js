import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Navbar, Nav } from 'react-bootstrap';

// Import the FinanceProvider
import { FinanceProvider } from './context/FinanceContext';

// Import page components
import Dashboard from './pages/Dashboard';
import AddTransaction from './pages/AddTransaction';
import TransactionHistory from './pages/TransactionHistory';
import Budgets from './pages/Budgets';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

function App() {
  return (
    <FinanceProvider>
      <Router>
        <div className="App">
          <Navbar bg="primary" variant="dark" expand="lg">
            <Container>
              <Navbar.Brand href="/">Finance Tracker</Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                  <Nav.Link as={Link} to="/add-transaction">Add Transaction</Nav.Link>
                  <Nav.Link as={Link} to="/transactions">Transactions</Nav.Link>
                  <Nav.Link as={Link} to="/budgets">Budgets</Nav.Link>
                  <Nav.Link as={Link} to="/reports">Reports</Nav.Link>
                  <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Container className="mt-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/add-transaction" element={<AddTransaction />} />
              <Route path="/transactions" element={<TransactionHistory />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </FinanceProvider>
  );
}export default App;