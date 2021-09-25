import React from 'react'
import { AddTransaction } from './AddTransaction';
import TransactionTable from './TransactionTable'
import { Grid } from '@material-ui/core';


const TransactionPage = () => {

    return (
        <Grid lg={12} item container className="TransactionRow" style={{paddingLeft: 100, paddingTop: 30}}>
            <Grid item lg={6} md={12} sm={12} xs={12} style={{marginRight: 40}}><TransactionTable /></Grid>
            <Grid item lg={5} md={12} sm={7} xs={9}><AddTransaction /></Grid>
        </Grid>
    )
}

export default TransactionPage;
