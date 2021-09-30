import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Button } from '@material-ui/core';
import { GlobalContext, AuthContext } from '../context/GlobalState'

// Sorting functions
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}



// Table head functional prop
const headCells = [
  { id: 'category', numeric: false, disablePadding: false, label: 'Category' },
  { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
  { id: 'amount', numeric: true, disablePadding: false, label: 'Amount' },
  { id: 'date', numeric: true, disablePadding: false, label: 'Date' },
  { id: 'delete', numeric: false, disablePadding: true}
];

function EnhancedTableHead(props) {
  const { classes,  order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>

        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >

            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
            
            {/* Sorting arrow */}
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}

            </TableSortLabel>
          </TableCell>
        ))}

      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};



// Full table prop
const useStyles = makeStyles((theme) => ({
  root: {
    width: 750,
    marginLeft: 50,
    marginRight: 200,
  },
  paper: {
    width: 750,
    marginBottom: theme.spacing(2),
  },
  table: {
    width: 750,
  },
  transrow: {

  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  deleterow: {
    padding: 0,
    width: '1%',
  },
  deletebutton: {
    color: '#B33A3A',
    marginBlock: 0,
    padding: 0,
    width: '10%'
  }
}));

export default function TransactionTable() {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { transactions, getTransactions, deleteTransaction } = useContext(GlobalContext)
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if(user !== null){
      getTransactions({ userid: user._id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRowcolor = (rowcategory) => {
    if (rowcategory === 'Income'){
      return '#9ceb8f'
    } else if (rowcategory === 'Bills') {
      return '#f66455'
    } else if (rowcategory === 'Entertainment') {
      return '#f1d303'
    } else if (rowcategory === 'Food') {
      return '#f88cbd'
    } else if (rowcategory === 'Transport') {
      return '#f8b1a5'
    } else if (rowcategory === 'Shopping') {
      return '#9e9add'
    } else {
      return '#b8efec'
    }
  }

  const handleDelete = (transactionid, transactiondescription, transactiondate) => {
    const deletetrans = { id: transactionid, userid: user._id }
    deleteTransaction(deletetrans)
    alert(`You have deleted: ${transactiondescription} from ${transactiondate}`)
  }

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, transactions.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Typography component={'span'}>
          <h2 style={{color: 'white'}}>Transaction History</h2>
      </Typography>

      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={transactions.length}
            />

            <TableBody>

              {stableSort(transactions, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => {

                  return (
                    <TableRow key={transaction.id} style={{backgroundColor: getRowcolor(transaction.category)}}>

                      <TableCell align='left' style={{borderBottom:"none"}}>{transaction.category}</TableCell>
                      <TableCell align="left" style={{borderBottom:"none"}}>{transaction.description}</TableCell>
                      <TableCell align="right" style={{borderBottom:"none"}}>${transaction.amount}</TableCell>
                      <TableCell align="right" style={{borderBottom:"none"}}>{transaction.date}</TableCell>
                      <TableCell align="right" style={{borderBottom:"none"}} className={classes.deleterow}>
                        <Button className={classes.deletebutton} onClick={() => handleDelete(transaction.id, transaction.description, transaction.date)}><DeleteForeverIcon/></Button>  
                      </TableCell>


                    </TableRow>
                  );

                })}

              {emptyRows > 0 && (
                <TableRow style={{ height: 33 }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}

            </TableBody>

          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Paper>
      
    </div>
  );
}
