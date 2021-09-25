import React from 'react'
import { Grid } from '@material-ui/core';
import MonthlyChart from './MonthlyChart';
import YearlyChart from './YearlyChart';

const HomePage = () => {

    return (
        <Grid lg={11} item container style={{paddingLeft: 80, paddingTop: 40}}>
            <Grid item lg={5} md={12} sm={12} xs={12} style={{paddingBottom: 200, marginRight: 100}}><MonthlyChart /></Grid>
            <Grid item lg={6} md={12} sm={12} xs={12}><YearlyChart /></Grid>
        </Grid>
    )
}

export default HomePage;
