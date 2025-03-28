import React, { useState, useMemo } from 'react';
import { Table, Button, Modal, Form, Dropdown, DropdownButton } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import { CSVLink } from 'react-csv';
import { useFinance } from '../context/FinanceContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import EditTransactionModal from './EditTransactionModal';

function TransactionHistory() {

  const { state, removeTransaction, addTransaction } = useFinance();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  // Advanced Filtering State
  const [filters, setFilters] = useState({
    type: 'All',
    category: 'All',
    dateRange: {
      start: '',
      end: ''
    },
    minAmount: '',
    maxAmount: ''
  });

  // Unique categories from transactions
  const uniqueCategories = useMemo(() => {
    const categories = new Set(
      state.transactions.map(t => t.category)
    );
    return ['All', ...categories];
  }, [state.transactions]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    return state.transactions
      .filter(transaction => {
        const typeMatch = filters.type === 'All' || transaction.type === filters.type;
        const categoryMatch = filters.category === 'All' || transaction.category === filters.category;
        
        const transactionDate = new Date(transaction.date);
        const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
        const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;
        
        const dateMatch = (!startDate || transactionDate >= startDate) && 
                           (!endDate || transactionDate <= endDate);
        
        const minAmountMatch = !filters.minAmount || transaction.amount >= parseFloat(filters.minAmount);
        const maxAmountMatch = !filters.maxAmount || transaction.amount <= parseFloat(filters.maxAmount);

        return typeMatch && categoryMatch && dateMatch && minAmountMatch && maxAmountMatch;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [state.transactions, filters]);

  // Export to CSV
  const csvData = filteredTransactions.map(t => ({
    Date: new Date(t.date).toLocaleDateString(),
    Category: t.category,
    Amount: t.amount,
    Type: t.type,
    Description: t.description || 'No description'
  }));

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Transaction History', 14, 16);
    
    const tableColumn = ['Date', 'Category', 'Amount', 'Type', 'Description'];
    const tableRows = filteredTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.category,
      `₹₹{t.amount.toFixed(2)}`,
      t.type,
      t.description || 'No description'
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save('transaction_history.pdf');
  };

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      type: 'All',
      category: 'All',
      dateRange: { start: '', end: '' },
      minAmount: '',
      maxAmount: ''
    });
  };

  return (
    <div>
      <h1>Transaction History</h1>

      {/* Advanced Filtering Section */}
      <div className="mb-4 p-3 bg-light rounded">
        <h4>Filter Transactions</h4>
        <Form>
          <Form.Group className="mb-2">
            <Form.Label>Transaction Type</Form.Label>
            <Form.Select 
              value={filters.type}
              onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
            >
              <option value="All">All Transactions</option>
              <option value="Income">Income Only</option>
              <option value="Expense">Expenses Only</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Category</Form.Label>
            <Form.Select 
              value={filters.category}
              onChange={(e) => setFilters(prev => ({...prev, category: e.target.value}))}
            >
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Date Range</Form.Label>
            <div className="d-flex">
              <Form.Control 
                type="date" 
                value={filters.dateRange.start}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  dateRange: {...prev.dateRange, start: e.target.value}
                }))}
                className="me-2"
              />
              <Form.Control 
                type="date" 
                value={filters.dateRange.end}
                onChange={(e) => setFilters(prev => ({
                  ...prev, 
                  dateRange: {...prev.dateRange, end: e.target.value}
                }))}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Amount Range</Form.Label>
            <div className="d-flex">
              <Form.Control 
                type="number" 
                placeholder="Min Amount"
                value={filters.minAmount}
                onChange={(e) => setFilters(prev => ({...prev, minAmount: e.target.value}))}
                className="me-2"
              />
              <Form.Control 
                type="number" 
                placeholder="Max Amount"
                value={filters.maxAmount}
                onChange={(e) => setFilters(prev => ({...prev, maxAmount: e.target.value}))}
              />
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between">
            <Button variant="secondary" onClick={resetFilters}>
              Reset Filters
            </Button>
            <DropdownButton title="Export">
              <Dropdown.Item>
                <CSVLink 
                  data={csvData} 
                  filename={'transactions.csv'}
                  className="text-decoration-none text-dark"
                >
                  Export to CSV
                </CSVLink>
              </Dropdown.Item>
              <Dropdown.Item onClick={exportPDF}>
                Export to PDF
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </Form>
      </div>

      {/* Transaction Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr 
              key={transaction.id}
              className={transaction.type === 'Income' ? 'table-success' : 'table-danger'}
            >
              <td>{new Date(transaction.date).toLocaleDateString()}</td>
              <td>{transaction.category}</td>
              <td>₹{transaction.amount.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>{transaction.description || 'No description'}</td>
              <td>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => {
                    setEditingTransaction(transaction);
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => removeTransaction(transaction.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <EditTransactionModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        transaction={editingTransaction}
      />
    </div>
  );
}

export default TransactionHistory;