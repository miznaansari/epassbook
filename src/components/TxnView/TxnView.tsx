import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Pagination,
  Alert,
  TextField,
  TableSortLabel
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material';

interface Transaction {
  _id: string;
  amount: number | { $numberDecimal: string };
  transaction_type: string;
  transaction_name: string;
  description: string;
  createdAt: string;
}

type Order = 'asc' | 'desc';

const TxnView: React.FC = () => {
  const [filter, setFilter] = useState<string>(() => {
    return localStorage.getItem('txnFilter') || 'today';
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  // Sorting
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Transaction>('createdAt');

  useEffect(() => {
    fetchTransactions(filter);
  }, [filter]);

  const fetchTransactions = async (selectedFilter: string) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'https://epassbook.onrender.com/api/fetchtxn',
        { filter: selectedFilter },
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setTransactions(response.data.transactions);
      } else {
        setError('Failed to fetch transactions.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'An error occurred while fetching transactions.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const selected = event.target.value;
    setFilter(selected);
    localStorage.setItem('txnFilter', selected);
    setPage(1);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSort = (property: keyof Transaction) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => {
      let aValue: any = a[orderBy];
      let bValue: any = b[orderBy];

      if (orderBy === 'amount') {
        aValue = typeof aValue === 'object' ? parseFloat(aValue.$numberDecimal) : aValue;
        bValue = typeof bValue === 'object' ? parseFloat(bValue.$numberDecimal) : bValue;
      }

      if (orderBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return order === 'asc' ? -1 : 1;
      if (aValue > bValue) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [transactions, order, orderBy]);

  const filteredTransactions = useMemo(() => {
    return sortedTransactions.filter((txn) =>
      txn.transaction_type.toLowerCase().includes(search.toLowerCase()) ||
      txn.description?.toLowerCase().includes(search.toLowerCase()) ||
      new Date(txn.createdAt).toLocaleString().toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedTransactions, search]);

  const paginatedTransactions = filteredTransactions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Transaction History
      </Typography>

      {/* Filters & Search */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel id="filter-label">Filter</InputLabel>
          <Select
            labelId="filter-label"
            value={filter}
            onChange={handleFilterChange}
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="yesterday">Yesterday</MenuItem>
            <MenuItem value="monthly">This Month</MenuItem>
            <MenuItem value="yearly">This Year</MenuItem>
            <MenuItem value="all">All</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Search..."
          variant="outlined"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, maxWidth: 300 }}
        />

       
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      {!loading && !error && filteredTransactions.length > 0 && (
        <TableContainer component={Paper} elevation={3}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: '#f1f1f1' }}>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'transaction_type'}
                    direction={orderBy === 'transaction_type' ? order : 'asc'}
                    onClick={() => handleSort('transaction_type')}
                  >
                    Type
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'asc'}
                    onClick={() => handleSort('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'createdAt'}
                    direction={orderBy === 'createdAt' ? order : 'asc'}
                    onClick={() => handleSort('createdAt')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.map((txn) => (
                <TableRow key={txn._id}>
                  <TableCell>{txn.transaction_type?.toUpperCase() || 'UNKNOWN'}</TableCell>
                  <TableCell>
                    ₹
                    {typeof txn.amount === 'object'
                      ? parseFloat(txn.amount.$numberDecimal).toFixed(2)
                      : txn.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{txn.transaction_name || '-'}</TableCell>
                  <TableCell>{txn.description || '-'}</TableCell>
                  <TableCell>{new Date(txn.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* No Results */}
      {!loading && !error && filteredTransactions.length === 0 && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          No transactions found.
        </Typography>
      )}

      {/* Pagination */}
      {!loading && filteredTransactions.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredTransactions.length / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
           <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel id="rows-label">Rows</InputLabel>
          <Select
            labelId="rows-label"
            value={rowsPerPage.toString()}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(1);
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        </Box>
        
      )}
    </Box>
  );
};

export default TxnView;
