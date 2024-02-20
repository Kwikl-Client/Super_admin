import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Grid, Container, TextField, Paper } from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import {
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from '@mui/material';

const SalesDetails = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [customers, setCustomers] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [flag, setFlag] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const handleChangePage = (event, newPage) => {
    // setCurrentPage(newPage);
    setFlag(!flag);
    console.log(newPage)
    handleFetchSalesData(newPage)
  };

  const handleFetchSalesData = async (page) => {
    try {
      if (!startDate || !endDate) {
        window.alert('Start date and end date are required.');
        return;
      }
      const payload = { startDate, endDate };
      setIsNextPageLoading(true)
      const response = await axios.post(`http://localhost:7000/customer/getAllCustomer?page=${page?page:1}`, payload);
      setRevenueData(response.data.data.totalAmount);
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(page?page:1);
      setIsNextPageLoading(false);
    }
    catch (error) {
      setIsNextPageLoading(false)
      console.error('Error fetching data:', error);
    }
  };

  return (
    <Container>
      <Breadcrumb title="Sales Details Page">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Sales Details Page
        </Typography>
      </Breadcrumb>

      <Typography variant="h5" gutterBottom>
        Sales Details
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" onClick={()=>handleFetchSalesData()}>
        Fetch Sales Data
      </Button>

      {revenueData !== null && (
        <Paper elevation={3} style={{ padding: '16px', margin: '16px 0px' }}>
          <Typography variant="h6" gutterBottom>
            The total sales made from {startDate} to {endDate}: ${revenueData}
          </Typography>
        </Paper>
      )}

      {!customers ?
        <h2>Select dates to fetch details</h2> :
        customers.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                {isNextPageLoading ?
                  <h2>Loading...</h2> :
                  <TableBody>
                    {customers.map((customer, index) => (
                      <React.Fragment key={index}>

                        <TableRow>
                          <TableCell>{customer._id.substring(0, 8)}</TableCell>
                          <TableCell>{customer.email}</TableCell>
                          <TableCell>{customer.amtPaid}</TableCell>
                          <TableCell>{customer.createdAt.slice(0, 10)}</TableCell>
                        </TableRow>

                      </React.Fragment>))}
                  </TableBody>}
              </Table>
            </TableContainer>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handleChangePage}
            />
          </>
        ) : (
          <Typography>No customers available.</Typography>
        )}
    </Container>
  );
};

export default SalesDetails;
