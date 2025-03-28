# Finance Tracker Application Architecture

## Core Components
1. **Dashboard** (`Dashboard.js`)
   - Displays financial summary cards
   - Visualizes monthly spending trends
   - Shows expense category breakdown
   - Calculates savings and savings rate

2. **Add Transaction** (`AddTransaction.js`)
   - Form for adding new income or expense transactions
   - Uses Formik for form management
   - Implements validation with Yup
   - Supports different categories for income and expenses

3. **Transaction History** (`TransactionHistory.js`)
   - Advanced filtering of transactions
   - Export functionality (CSV and PDF)
   - Editable and deletable transactions
   - Responsive table view

4. **Reports** (`Reports.js`)
   - Yearly financial analysis
   - Top expense categories visualization
   - Export reports to PDF

5. **Budgets** (`Budgets.js`)
   - Track spending against predefined budgets
   - Visualize budget utilization with progress bars
   - Budget limit editing

6. **Settings** (`Settings.js`)
   - Basic settings configuration
   - Currency selection
   - User profile details

## Key Technical Features
- React Router for navigation
- React Bootstrap for UI components
- Recharts for data visualization
- Context API for state management
- LocalStorage for persistent data
- Formik and Yup for form handling
- jsPDF for PDF exports
- CSV export functionality

## State Management
- Centralized state in `FinanceContext.js`
- Reducer-based state updates
- Persistent state via LocalStorage

## Notable Technologies
- React
- React Router
- React Bootstrap
- Recharts
- Formik
- Yup
- jsPDF
- react-csv