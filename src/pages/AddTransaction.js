// src/pages/AddTransaction.js
import React from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useFinance } from '../context/FinanceContext';

// Validation Schema
const TransactionSchema = Yup.object().shape({
  type: Yup.string()
    .required('Transaction type is required')
    .oneOf(['Income', 'Expense'], 'Invalid transaction type'),
  
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be a positive number')
    .max(1000000, 'Amount is too large'),
  
  category: Yup.string()
    .required('Category is required')
    .notOneOf(['Select Category'], 'Please select a valid category'),
  
  date: Yup.date()
    .required('Date is required')
    .max(new Date(), 'Date cannot be in the future'),
  
  description: Yup.string()
    .max(500, 'Description cannot exceed 500 characters')
});

function AddTransaction() {
  const { addTransaction } = useFinance();

  // Predefined categories
  const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Other Income'
  ];

  const expenseCategories = [
    'Groceries', 'Rent', 'Utilities', 'Transportation', 
    'Entertainment', 'Dining Out', 'Shopping', 'Healthcare'
  ];

  return (
    <Container>
      <h1>Add New Transaction</h1>
      <Formik
        initialValues={{
          type: 'Expense',
          amount: '',
          category: 'Select Category',
          date: new Date().toISOString().split('T')[0],
          description: ''
        }}
        validationSchema={TransactionSchema}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          try {
            addTransaction({
              ...values,
              amount: parseFloat(values.amount)
            });
            resetForm();
            alert('Transaction added successfully!');
          } catch (error) {
            console.error('Failed to add transaction', error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, touched, values, handleChange, handleBlur, setFieldValue }) => (
          <FormikForm>
            {/* Transaction Type */}
            <Form.Group className="mb-3">
              <Form.Label>Transaction Type</Form.Label>
              <Field 
                as={Form.Select} 
                name="type"
                isInvalid={touched.type && errors.type}
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </Field>
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Amount */}
            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Field 
                as={Form.Control} 
                type="number" 
                name="amount" 
                placeholder="Enter amount"
                isInvalid={touched.amount && errors.amount}
              />
              <Form.Control.Feedback type="invalid">
                {errors.amount}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Category */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Field 
                as={Form.Select} 
                name="category"
                isInvalid={touched.category && errors.category}
              >
                <option value="Select Category">Select Category</option>
                {values.type === 'Income' 
                  ? incomeCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                  : expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))
                }
              </Field>
              <Form.Control.Feedback type="invalid">
                {errors.category}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Date */}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Field 
                as={Form.Control} 
                type="date" 
                name="date"
                isInvalid={touched.date && errors.date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Description */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Field 
                as={Form.Control} 
                rows={3} 
                name="description"
                isInvalid={touched.description && errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit"
            >
              Add Transaction
            </Button>
          </FormikForm>
        )}
      </Formik>
    </Container>
  );
}

export default AddTransaction;