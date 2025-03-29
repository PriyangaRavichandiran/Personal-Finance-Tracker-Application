# Finance Tracker Application

A comprehensive personal finance tracking application built with React.js that helps users manage their finances by tracking income, expenses, budgets, and generating insightful reports.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Libraries and Dependencies](#libraries-and-dependencies)
- [Installation and Setup](#installation-and-setup)
- [Usage Guide](#usage-guide)
- [Component Details](#component-details)
- [Context API Implementation](#context-api-implementation)
- [Data Structure](#data-structure)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## Overview

Finance Tracker is a robust web application designed to help users take control of their finances. It provides an intuitive interface for tracking transactions, analyzing spending patterns, setting budgets, and generating financial reports. The application is built with React.js and leverages various modern libraries to create a seamless user experience.

## Features

- **Dashboard**: Visual summary of financial status with key metrics and charts
- **Transaction Management**: Add, edit, and delete income and expense transactions
- **Transaction History**: View, search, filter, and export transaction history
- **Budget Management**: Set monthly budgets for different expense categories
- **Reports**: Generate and export financial reports with charts and tables
- **Data Visualization**: Interactive charts for better understanding of financial patterns
- **Data Export**: Export data in CSV and PDF formats for external analysis
- **Responsive Design**: Optimized for both desktop and mobile devices

## Project Structure

```
finance-tracker/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/
│   │   └── EditTransactionModal.js
│   ├── context/
│   │   └── FinanceContext.js
│   ├── pages/
│   │   ├── AddTransaction.js
│   │   ├── Budgets.js
│   │   ├── Dashboard.js
│   │   ├── Reports.js
│   │   ├── Settings.js
│   │   └── TransactionHistory.js
│   ├── App.js
│   ├── index.js
│   └── ...
├── package.json
└── README.md
```

## Technologies Used

- **React.js**: Frontend library for building user interfaces
- **React Router**: Navigation management for single-page applications
- **React Bootstrap**: UI component library based on Bootstrap
- **Context API**: State management solution for React applications
- **Recharts**: Composable charting library built on React components
- **Formik**: Form handling library with validation support
- **Yup**: Schema builder for runtime value parsing and validation
- **jsPDF**: PDF generation library for exporting reports
- **react-csv**: CSV export functionality

## Libraries and Dependencies

### Core
- react
- react-dom
- react-router-dom
- react-bootstrap
- bootstrap

### Form Handling
- formik
- yup

### Data Visualization
- recharts

### Data Export
- jspdf
- jspdf-autotable
- react-csv

### Utilities
- lodash (if used for data manipulation)
- date-fns (if used for date formatting)

## Installation and Setup

1. **Clone the repository**
   ```bash
   [git clone https://github.com/yourusername/finance-tracker.git](https://github.com/PriyangaRavichandiran/Personal-Finance-Tracker-Application/)
   cd finance-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## Usage Guide

### Dashboard
The Dashboard provides an overview of your financial status with key metrics like total income, expenses, savings, and savings rate. It also displays visual representations of monthly spending trends and expense category breakdowns.

### Adding Transactions
To add a new transaction:
1. Navigate to "Add Transaction" from the navigation bar
2. Select transaction type (Income or Expense)
3. Enter the amount
4. Select a category
5. Choose the date
6. Add an optional description
7. Click "Add Transaction"

### Managing Transactions
The Transaction History page allows you to:
- View all transactions in a sortable table
- Filter transactions by type, category, date range, and amount
- Edit existing transactions
- Delete transactions
- Export your transaction history to CSV or PDF format

### Setting Budgets
The Budgets page enables you to:
- Set monthly spending limits for different expense categories
- Track your spending against those limits with visual progress bars
- Receive alerts when you're approaching or have exceeded your budget

### Generating Reports
The Reports page offers:
- Yearly financial analysis with income and expense comparisons
- Category spending analysis showing your top expense categories
- Options to export reports in PDF format

## Component Details

### App Component
Main component that sets up routing and wraps the application with the FinanceProvider.

### Dashboard Component
Displays financial summary cards and charts for visualizing spending patterns and category breakdown.

### AddTransaction Component
Form for adding new transactions with validation using Formik and Yup.

### TransactionHistory Component
Interactive table with filtering capabilities and export functions for transaction data.

### Budgets Component
Displays progress bars for each budget category and allows budget limit modifications.

### Reports Component
Generates financial reports with charts and provides export functionality.

### EditTransactionModal Component
Modal for editing existing transactions.

### Settings Component
Allows users to modify application settings.

## Context API Implementation

The application uses React's Context API for state management through the FinanceContext. This context provides:

- Transaction data storage and manipulation
- Budget management
- Financial calculations (totals, summaries)
- CRUD operations for transactions

## Data Structure

### Transaction Object
```javascript
{
  id: String,              // Unique identifier
  type: String,            // 'Income' or 'Expense'
  amount: Number,          // Transaction amount
  category: String,        // Transaction category
  date: String,            // ISO date string
  description: String      // Optional description
}
```

### Budget Object
```javascript
{
  [category]: Number       // Budget limit for category
}
```

## Future Enhancements

- **Multi-currency Support**: Handle transactions in different currencies
- **Financial Goals**: Set and track progress towards savings goals
- **Recurring Transactions**: Support for automatic recurring transactions
- **Data Sync**: Cloud synchronization for accessing data across devices
- **Mobile App**: Native mobile applications for iOS and Android
- **Dark Mode**: Alternative UI theme for low-light environments
- **Investment Tracking**: Track investment portfolio and performance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
