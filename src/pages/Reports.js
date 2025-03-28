import React, { useMemo } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Reports() {
  const { state } = useFinance();
  const { transactions } = state;

  // Yearly Analysis
  const yearlyAnalysis = useMemo(() => {
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    
    return years.map(year => {
      const yearTransactions = transactions.filter(
        t => new Date(t.date).getFullYear() === year
      );

      const income = yearTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = yearTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const savings = income - expenses;
      const savingsRate = (savings / income) * 100;

      return {
        year,
        income,
        expenses,
        savings,
        savingsRate: isNaN(savingsRate) ? 0 : savingsRate.toFixed(2)
      };
    });
  }, [transactions]);

  // Category Spending Analysis
  const categorySpending = useMemo(() => {
    const categories = {};
    
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(transaction => {
        categories[transaction.category] = 
          (categories[transaction.category] || 0) + transaction.amount;
      });

    return Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Export Yearly Report to PDF
  const exportYearlyReportPDF = () => {
    const doc = new jsPDF();
    doc.text('Yearly Financial Analysis', 14, 16);
    
    const tableColumn = ['Year', 'Total Income', 'Total Expenses', 'Savings', 'Savings Rate'];
    const tableRows = yearlyAnalysis.map(year => [
      year.year,
      `₹₹{year.income.toFixed(2)}`,
      `₹₹{year.expenses.toFixed(2)}`,
      `₹₹{year.savings.toFixed(2)}`,
      `₹{year.savingsRate}%`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('yearly_financial_report.pdf');
  };

  // Export Category Spending Report to PDF
  const exportCategorySpendingPDF = () => {
    const doc = new jsPDF();
    doc.text('Category Spending Analysis', 14, 16);
    
    const tableColumn = ['Category', 'Total Spending'];
    const tableRows = categorySpending.map(cat => [
      cat.category,
      `₹₹{cat.amount.toFixed(2)}`
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('category_spending_report.pdf');
  };

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
          <div className="d-flex justify-content-end mt-2">
            <Button variant="primary" onClick={exportYearlyReportPDF}>
              Export Yearly Report
            </Button>
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
          <div className="d-flex justify-content-end mt-2">
            <Button variant="secondary" onClick={exportCategorySpendingPDF}>
              Export Category Spending Report
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Reports;