import React, { useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { useFinance } from '../context/FinanceContext';

function Dashboard() {
  const { state } = useFinance();
  const { transactions, totalIncome, totalExpenses, budgets } = state;

  // Prepare data for monthly spending trend
  const monthlySpendingData = useMemo(() => {
    const monthlyData = {};
    
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(transaction => {
        const month = new Date(transaction.date).toLocaleString('default', { month: 'short' });
        monthlyData[month] = (monthlyData[month] || 0) + transaction.amount;
      });

    return Object.entries(monthlyData).map(([month, amount]) => ({
      month,
      amount
    })).sort((a, b) => {
      const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  }, [transactions]);

  // Prepare data for expense category breakdown
  const categoryExpenseData = useMemo(() => {
    const categoryTotals = {};
    
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(transaction => {
        categoryTotals[transaction.category] = 
          (categoryTotals[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount
    })).sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Color palette for charts
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', 
    '#8884D8', '#82CA9D', '#FF6384'
  ];

  // Calculate savings and budget utilization
  const savings = totalIncome - totalExpenses;
  const savingsRate = ((savings / totalIncome) * 100).toFixed(2);

  // Top expense categories
  const topExpenseCategories = categoryExpenseData.slice(0, 3);

  return (
    <div>
      <h1>Financial Dashboard</h1>
      
      {/* Financial Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Income</Card.Title>
              <Card.Text>₹{totalIncome.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Total Expenses</Card.Title>
              <Card.Text>₹{totalExpenses.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Savings</Card.Title>
              <Card.Text>₹{savings.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>Savings Rate</Card.Title>
              <Card.Text>{savingsRate}%</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row>
        {/* Monthly Spending Trend */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Monthly Spending Trend</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySpendingData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Expense Category Breakdown */}
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Expense Category Breakdown</Card.Title>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryExpenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      value,
                      index
                    }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = 25 + innerRadius + (outerRadius - innerRadius);
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);

                      return (
                        <text
                          x={x}
                          y={y}
                          fill={COLORS[index % COLORS.length]}
                          textAnchor={x > cx ? 'start' : 'end'}
                          dominantBaseline="central"
                        >
                          {categoryExpenseData[index].category} (₹{value.toFixed(2)})
                        </text>
                      );
                    }}
                  >
                    {categoryExpenseData.map((entry, index) => (
                      <Cell 
                        key={`cell-₹{index}`} 
                        fill={COLORS[index % COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Expense Categories */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Top Expense Categories</Card.Title>
              {topExpenseCategories.map((category, index) => (
                <div key={category.category} className="mb-2">
                  <strong>{index + 1}. {category.category}:</strong> 
                  ${category.amount.toFixed(2)}
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;