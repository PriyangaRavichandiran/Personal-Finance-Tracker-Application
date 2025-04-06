// src/context/FinanceContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Action types
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const REMOVE_TRANSACTION = 'REMOVE_TRANSACTION';
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION';
const SET_BUDGET = 'SET_BUDGET';

// Initial state
const initialState = {
  transactions: [],
  budgets: {
    groceries: 0,
    entertainment: 0,
    rent: 0,
    utilities: 0
  },
  totalIncome: 0,
  totalExpenses: 0
};

// Reducer function
function financeReducer(state, action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      const newTransactions = [...state.transactions, action.payload];
      
      // Calculate total income and expenses
      const totalIncome = newTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = newTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...state,
        transactions: newTransactions,
        totalIncome,
        totalExpenses
      };
    
    case REMOVE_TRANSACTION:
      const filteredTransactions = state.transactions
        .filter(t => t.id !== action.payload);
      
      const remainingIncome = filteredTransactions
        .filter(t => t.type === 'Income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const remainingExpenses = filteredTransactions
        .filter(t => t.type === 'Expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        ...state,
        transactions: filteredTransactions,
        totalIncome: remainingIncome,
        totalExpenses: remainingExpenses
      };
    
    case SET_BUDGET:
      return {
        ...state,
        budgets: {
          ...state.budgets,
          [action.payload.category]: action.payload.amount
        }
      };
    
    default:
      return state;
  }
}

// Create context
const FinanceContext = createContext();

// Provider component
export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, initialState, (initial) => {
    // Load from localStorage on initial render
    const savedState = localStorage.getItem('financeTrackerState');
    return savedState ? JSON.parse(savedState) : initial;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('financeTrackerState', JSON.stringify(state));
  }, [state]);

  // Action creators
  const addTransaction = (transaction) => {
    dispatch({
      type: ADD_TRANSACTION, 
      payload: {
        ...transaction,
        id: Date.now(), // Simple unique ID
        date: new Date().toISOString()
      }
    });
  };

  const removeTransaction = (id) => {
    dispatch({ type: REMOVE_TRANSACTION, payload: id });
  };

  const setBudget = (category, amount) => {
    dispatch({ 
      type: SET_BUDGET, 
      payload: { category, amount } 
    });
  };

  return (
    <FinanceContext.Provider 
      value={{ 
        state, 
        addTransaction, 
        removeTransaction, 
        setBudget 
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// Custom hook for using the context
export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}