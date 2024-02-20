import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
  TextField,
  Grid,
} from '@mui/material';
import Breadcrumb from 'component/Breadcrumb';
import { Link } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function SamplePage() {
  const [customers, setCustomers] = useState();
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [stripeDetailsData, setStripeDetailsData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchStr, setSearchStr] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [flag, setFlag] = useState(true);
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)


  const fetchData = async () => {
    try {
      setIsNextPageLoading(true)
      const payload = {startDate, endDate, searchStr}
      const response = await axios.post(`http://localhost:7000/customer/getAllCustomer?page=${currentPage}`, payload);
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages)
    }
    catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    finally{
      setIsNextPageLoading(false)
    }
  };





  useEffect(() => {
    fetchData();
  }, [flag]);



  const showDetails = async (customerId) => {
    if (selectedCustomerId === customerId) {
      setStripeDetailsData(null);
      setSelectedCustomerId(null);
      return
    }
    setSelectedCustomerId(customerId);
  };

  const showPaymentDetails = async(sessionId) => {
    try {
      const response = await axios.get(`http://localhost:7000/payment/retrievePaymentDetails/${sessionId}`);
      setStripeDetailsData(response.data.data)
    }
    catch (error) {
      console.log(error)
      window.alert("Problem loading payment details")
    }
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
    setFlag(!flag);
  };

  const resetFilters = () => {
    setCurrentPage(1)
    setSearchStr('');
    setStartDate("");
    setEndDate("");
    setFlag(!flag);
  }

  const getCustomersBetweenDates = async() => {
    if(!startDate || !endDate){
      window.alert("Please fill start date and end Date")
      return
    }
    try {
      setCustomers();
      setCurrentPage(1)
      const payload = {startDate, endDate, searchStr};
      const response = await axios.post(`http://localhost:7000/customer/getAllCustomer?page=1`, payload);
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages)
    }
    catch (error) {
      console.error(error)
      window.alert("Problem doing filteration")
    }
  }

  const handleCustomerSearch = async(str) => {
    try {
      setCustomers();
      setCurrentPage(1);
      setSearchStr(str);
      const payload = {startDate, endDate, searchStr: str};
      const response = await axios.post(`http://localhost:7000/customer/getAllCustomer?page=1`, payload);
      setCustomers(response.data.data.customers);
      setTotalPages(response.data.data.totalPages)
    }
    catch (error) {
      console.error(error)
      window.alert("Problem doing filteration")
    }
  }

  return (

    <>
      <Breadcrumb title="Users List Page">
        <Typography component={Link} to="/" variant="subtitle2" color="inherit" className="link-breadcrumb">
          Home
        </Typography>
        <Typography variant="subtitle2" color="primary" className="link-breadcrumb">
          Users List Page
        </Typography>
      </Breadcrumb>
      <Card>
        <CardContent>
          <div className="dashboard-container">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6} sm={3}>
                <TextField
                  label="Search"
                  variant="outlined"
                  size="small"
                  margin="normal"
                  value={searchStr}
                  onChange={(e) => handleCustomerSearch(e.target.value)}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button variant="outlined" size="small" onClick={getCustomersBetweenDates}>
                  Fetch Data
                </Button>
                <Button variant="outlined" size="small" onClick={resetFilters}>
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
            {!customers?
            <h2>Loading...</h2>:
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
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    {isNextPageLoading?
                    <h2>Loading...</h2>:
                    <TableBody>
                      {customers.map((customer, index) => (
                      <React.Fragment key={index}>
                        <>
                          <TableRow>
                            <TableCell>{customer._id.substring(0, 8)}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.amtPaid}</TableCell>
                            <TableCell>{customer.createdAt.slice(0,10)}</TableCell>
                            <TableCell>
                              <Typography variant="outlined"
                                onClick={() => showDetails(customer._id)}
                                style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                              >
                                {selectedCustomerId === customer._id?'Close':'View'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          {selectedCustomerId === customer._id &&
                          <TableRow>
                            <TableCell colSpan={5}>
                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon onClick={()=>showPaymentDetails(customer.stripeDetails)}/>}>
                                  <Typography variant="h6">Details</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <CollapsibleTab stripeDetails={stripeDetailsData} />
                                </AccordionDetails>
                              </Accordion>
                            </TableCell>
                          </TableRow>}
                        </>
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
          </div>
        </CardContent>
      </Card>
    </>
  );
}

const CollapsibleTab = ({ stripeDetails }) => {

  const handleDelete = async () => {
    try {
      const email = stripeDetails.customer_email;

      if (email) {
        await axios.delete(`http://localhost:7000/customer/deleteUser/${email}`);
        console.log(`User with email ${email} deleted successfully`);
        setIsSnackbarOpen(true);
      } else {
        console.error('Email not available in stripeDetailsData');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };



  return (
    <div className="collapsible-tab">
      <Typography variant="h6">Payment Details:</Typography>
      {stripeDetails ? (
        <>
          <Typography>Total Amount: {stripeDetails.amount_total}</Typography>
          <Typography>Currency: {stripeDetails.currency}</Typography>
          <Typography>Customer Email: {stripeDetails.customer_email}</Typography>
          <Typography>Payment Status: {stripeDetails.payment_status}</Typography>
          <Typography>Payment Intent: {stripeDetails.payment_intent}</Typography>
          <Button variant="outlined" onClick={handleDelete}>
            Delete User
          </Button>

          {/* <Snackbar
            open={isSnackbarOpen}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            message="User deleted successfully"
          /> */}
        </>
      ) : (
        <Typography>Loading payment details...</Typography>
      )}
    </div>
  );
};
