import React, { useMemo } from 'react';
import { Card, ProgressBar, Alert, Button } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Budgets() {
  const { state, setBudget } = useFinance();
  const { transactions, budgets } = state;

  // Improved category spending calculation
  const categorySpending = useMemo(() => {
    const spending = {};
    
    // Group transactions by category and calculate total spent
    transactions
      .filter(t => t.type === 'Expense')
      .forEach(transaction => {
        const category = transaction.category.toLowerCase();
        spending[category] = 
          (spending[category] || 0) + transaction.amount;
      });

    return spending;
  }, [transactions]);

  // Improved budget status calculation
  const budgetStatus = Object.entries(budgets).map(([category, limit]) => {
    // Normalize category for case-insensitive matching
    const normalizedCategory = category.toLowerCase();
    const spent = categorySpending[normalizedCategory] || 0;
    const percentSpent = (spent / limit) * 100;
    
    return {
      category,
      limit,
      spent,
      percentSpent: Math.min(percentSpent, 100).toFixed(2),
      status: percentSpent > 100 ? 'danger' : 
              percentSpent > 80 ? 'warning' : 'success'
    };
  });

  return (
    <div>
      <h1>Monthly Budgets</h1>
      
      {budgetStatus.map(budget => (
        <Card key={budget.category} className="mb-3">
          <Card.Body>
            <Card.Title>{budget.category} Budget</Card.Title>
            <ProgressBar 
              now={parseFloat(budget.percentSpent)} 
              label={`₹₹{budget.spent.toFixed(2)} / ₹₹{budget.limit}`}
              variant={
                budget.status === 'danger' ? 'danger' : 
                budget.status === 'warning' ? 'warning' : 'success'
              }
            />
            {budget.status === 'danger' && (
              <Alert variant="danger" className="mt-2">
                🚨 You've exceeded your {budget.category} budget!
              </Alert>
            )}
            {budget.status === 'warning' && (
              <Alert variant="warning" className="mt-2">
                ⚠️ You're close to exceeding your {budget.category} budget.
              </Alert>
            )}
          </Card.Body>
        </Card>
      ))}

      <Card>
        <Card.Body>
          <Card.Title>Budget Management</Card.Title>
          {Object.entries(budgets).map(([category, limit]) => (
            <div key={category} className="mb-2 d-flex align-items-center">
              <span className="me-2">{category}:</span>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => {
                  const newLimit = prompt(`Enter new budget for ₹{category}:`, limit);
                  if (newLimit && !isNaN(newLimit)) {
                    setBudget(category, parseFloat(newLimit));
                  }
                }}
              >
                ₹{limit} (Edit)
              </Button>
            </div>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
}export default Budgets;