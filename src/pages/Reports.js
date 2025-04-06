import React, { useMemo } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';

function Reports() {
  const { state } = useFinance();
  const { transactions } = state;

  // Yearly Analysis
  const yearlyAnalysis = useMemo(() => {
    const years = [...new Set(transactions.map((t) => new Date(t.date).getFullYear()))];

    return years.map((year) => {
      const yearTransactions = transactions.filter((t) => new Date(t.date).getFullYear() === year);

      const income = yearTransactions.filter((t) => t.type === 'Income').reduce((sum, t) => sum + t.amount, 0);

      const expenses = yearTransactions.filter((t) => t.type === 'Expense').reduce((sum, t) => sum + t.amount, 0);

      const savings = income - expenses;
      
      // Calculate savings rate - if income is 0, savings rate should be 0
      const savingsRate = income === 0 ? 0 : (savings / income) * 100;

      return {
        year,
        income,
        expenses,
        // Keep original savings value for calculations
        savings,
        // Display absolute value for UI
        displaySavings: Math.abs(savings),
        // Add indicator if savings is positive or negative
        savingsStatus: savings >= 0 ? 'Saving' : 'Deficit',
        savingsRate: savingsRate.toFixed(2),
      };
    });
  }, [transactions]);

  // Category Spending Analysis
  const categorySpending = useMemo(() => {
    const categories = {};

    transactions.filter((t) => t.type === 'Expense').forEach((transaction) => {
      categories[transaction.category] = (categories[transaction.category] || 0) + transaction.amount;
    });

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  return (
    <div>
      <h1>Financial Reports</h1>

      {/* Yearly Analysis */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Yearly Financial Analysis</Card.Title>
          <Row>
            <Col>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={yearlyAnalysis}>
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="income" fill="#82ca9d" name="Income" />
                  <Bar dataKey="expenses" fill="#ff6384" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
          
          {/* Display savings information in a table */}
          <div className="mt-4">
            <h5>Savings Summary</h5>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Savings Rate</th>
                </tr>
              </thead>
              <tbody>
                {yearlyAnalysis.map((item) => (
                  <tr key={item.year}>
                    <td>{item.year}</td>
                    <td>{item.savingsStatus}</td>
                    <td>${item.displaySavings.toFixed(2)}</td>
                    <td>{item.savingsRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Category Spending Analysis */}
      <Card>
        <Card.Body>
          <Card.Title>Top 5 Expense Categories</Card.Title>
          <Row>
            <Col>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categorySpending}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Reports;