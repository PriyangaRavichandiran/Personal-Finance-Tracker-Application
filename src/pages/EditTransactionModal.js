import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import { useFinance } from '../context/FinanceContext';

// Reuse the validation schema from AddTransaction
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

function EditTransactionModal({ 
  show, 
  handleClose, 
  transaction 
}) {
  const { state, addTransaction, removeTransaction } = useFinance();

  // Predefined categories (same as in AddTransaction)
  const incomeCategories = [
    'Salary', 'Freelance', 'Investment', 'Other Income'
  ];

  const expenseCategories = [
    'Groceries', 'Rent', 'Utilities', 'Transportation', 
    'Entertainment', 'Dining Out', 'Shopping', 'Healthcare'
  ];

  if (!transaction) return null;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{
            type: transaction.type,
            amount: transaction.amount.toString(),
            category: transaction.category,
            date: new Date(transaction.date).toISOString().split('T')[0],
            description: transaction.description || ''
          }}
          validationSchema={TransactionSchema}
          onSubmit={(values, { setSubmitting }) => {
            try {
              // Remove the old transaction
              removeTransaction(transaction.id);
              
              // Add the updated transaction as a new one
              addTransaction({
                ...values,
                amount: parseFloat(values.amount)
              });
              
              handleClose();
            } catch (error) {
              console.error('Failed to update transaction', error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, values, handleChange, handleBlur }) => (
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
                Update Transaction
              </Button>
            </FormikForm>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default EditTransactionModal;