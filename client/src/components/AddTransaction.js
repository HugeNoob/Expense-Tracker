import { Paper, Typography } from '@material-ui/core'
import React, { useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Button from "@material-ui/core/Button";
import "date-fns";
import { format } from 'date-fns';
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { Box } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import { GlobalContext, AuthContext } from '../context/GlobalState';

const useStyles = makeStyles((theme) => ({
    paper: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 20,
        paddingRight: 20,
    },
    formfirstrow: {
      "& .MuiTextField-root": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
    categoryselect: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    button: {
        marginLeft: 180,
        marginTop: 20,
        height: 45
    },
    formsecondrow: {
        marginLeft: 8
    }
  }));

export const AddTransaction = () => {
    const classes = useStyles();
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { transactions, addTransaction } = useContext(GlobalContext);
    const { user } = useContext(AuthContext);

    const handleAmountChange = e => {
        let curr_amt = e.target.value
        if (!Number(curr_amt)){
            setAmount('')
            return;
        }
        setAmount(Number(curr_amt))
    } 

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
    
    const submit = () => {
        if(category.length===0 || description.length===0){
            alert('Please fill all parameters.')
            return
        } else if (typeof(amount) != 'number'){
            console.log(typeof(amount))
            alert('Please fill a number for the transaction amount.')
            return
        }

        let newID = 1
        if (transactions.length >= 1){
            newID = transactions.at(-1).id + 1
        }
        
        let newRow = {
            userid: user._id,
            id: newID,
            category: category,
            description: description,
            amount: amount,
            date: format(selectedDate, 'MM/dd/yyyy'),
        }

        addTransaction(newRow)
        setCategory('')
        document.getElementById('descriptioninput').value = ''
        document.getElementById('amountinput').value = ''
        setSelectedDate(new Date())
        alert('Transaction Recorded!')
    }

    return (
        <Grid style={{paddingRight: 100, paddingLeft: 50, width: 620}}>

            <Typography component={'span'}>
                <h2 style={{color: 'white'}}>Add Transaction</h2>
            </Typography>

            <Paper className={classes.paper}>
                <form className={classes.formfirstrow} noValidate autoComplete="off">
                    <div className='transinputrow'>
                        <FormControl className={classes.categoryselect}>
                            <InputLabel id="categoryinput">Category</InputLabel>
                            <Select
                            id="categoryinput"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            >
                            <MenuItem value={'Income'}>Income</MenuItem>
                            <MenuItem value={'Bills'}>Bills</MenuItem>
                            <MenuItem value={'Entertainment'}>Entertainment</MenuItem>
                            <MenuItem value={'Food'}>Food</MenuItem>
                            <MenuItem value={'Transport'}>Transport</MenuItem>
                            <MenuItem value={'Shopping'}>Shopping</MenuItem>
                            <MenuItem value={'Others'}>Others</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                        required
                        id="descriptioninput"
                        label="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        />

                        <TextField
                        required
                        id="amountinput"
                        label="Amount"
                        onChange={handleAmountChange}
                        />
                    </div>
                </form>
                
                <Box className={classes.formsecondrow}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="yyyy-MM-dd"
                        margin="normal"
                        id="DatePicker"
                        label="Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            "aria-label": "change date"
                        }}
                        />
                    </MuiPickersUtilsProvider>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<CloudUploadIcon />}
                        onClick={() => submit()}
                    >
                        Upload
                    </Button>
                </Box> 
            </Paper>

        </Grid>
    )
}

