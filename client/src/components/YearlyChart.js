import React, { useState, useContext, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Paper } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import { AuthContext, GlobalContext } from '../context/GlobalState'

export default function YearlyChart(){
    const [showBills, setShowBills] = useState(true)
    const [showEntertainment, setShowEntertainment] = useState(true)
    const [showFood, setShowFood] = useState(true)
    const [showTransport, setShowTransport] = useState(true)
    const [showShopping, setShowShopping] = useState(true)
    const [showOthers, setShowOthers] = useState(true)
    const [showIncome, setShowIncome] = useState(true)
    const curryearstr = (new Date()).getFullYear().toString()
    const { transactions, getTransactions } = useContext(GlobalContext)
    const { user } = useContext(AuthContext)
    
    useEffect(() => {
    if(user !== null){
      getTransactions({ userid: user._id })
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const filterTransactionsYear = (allTransactions) => {
      return allTransactions.filter(transaction => transaction.date.slice(6, 10) === curryearstr)
    }

    const formatData = (allTransactionsInYear) => {
      let skeleton = [
        {
          name: 'January',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'February',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'March',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'April',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'May',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'June',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'July',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'August',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'September',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'October',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'November',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },{
          name: 'December',
          Income: 0,
          Bills: 0,
          Entertainment: 0,
          Food: 0,
          Transport: 0,
          Shopping: 0,
          Others: 0
        },
      ]

      for(let transaction of allTransactionsInYear){
        // get month num and category
        const monthstr = transaction.date.slice(0, 2)
        const monthnum = monthstr[0] === '0' ? Number(monthstr[1]) : Number(monthstr)
        const category = transaction.category

        // index into skeleton with month num and add value
        skeleton[monthnum-1][category] += transaction.amount
      }
      return skeleton
    }

    const chartData = formatData(filterTransactionsYear(transactions))

    const handleBillsClick = (checked) => {
      setShowBills(checked)
    }
    const handleEntertainmentClick = (checked) => {
      setShowEntertainment(checked)
    }
    const handleFoodClick = (checked) => {
      setShowFood(checked)
    }
    const handleTransportClick = (checked) => {
      setShowTransport(checked)
    }
    const handleShoppingClick = (checked) => {
      setShowShopping(checked)
    }
    const handleOthersClick = (checked) => {
      setShowOthers(checked)
    }
    const handleIncomeClick = (checked) => {
      setShowIncome(checked)
    }

    return (
      <div style={{ width: 800, position: 'relative', top: -20, left: 20}}>
      <Paper elevation={0} style={{backgroundColor: '#212121', borderTop: 900}}>
        
        <Typography component='span'>
            <h2 style={{ paddingLeft: 30, color: 'white'}}>This year's outlook</h2>
        </Typography>

        <LineChart
          width={800}
          height={400}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" interval={1}/>
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          
          {showBills ? <Line yAxisId="left" type="monotone" dataKey="Bills" stroke="#f66455" activeDot={{ r: 8 }}/> : ''}
          {showEntertainment ? <Line yAxisId="left" type="monotone" dataKey="Entertainment" stroke="#f1d303" activeDot={{ r: 8 }} /> : ''}
          {showFood ? <Line yAxisId="left" type="monotone" dataKey="Food" stroke="#f88cbd" activeDot={{ r: 8 }} /> : ''}
          {showTransport ? <Line yAxisId="left" type="monotone" dataKey="Transport" stroke="#f8b1a5" activeDot={{ r: 8 }} /> : ''}
          {showShopping ? <Line yAxisId="left" type="monotone" dataKey="Shopping" stroke="#9e9add" activeDot={{ r: 8 }} /> : ''}
          {showOthers ? <Line yAxisId="left" type="monotone" dataKey="Others" stroke="#b8efec" activeDot={{ r: 8 }} /> : ''}
          {showIncome ? <Line yAxisId="right" type="monotone" dataKey="Income" stroke="#9ceb8f" activeDot={{ r: 8 }} /> : ''}
        
        </LineChart>

        <div style={{position: 'relative', top: 20, left: 247}}>
            <Checkbox defaultChecked style={{color: "#f66455"}} onClick={(e) => handleBillsClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#f1d303"}} onClick={(e) => handleEntertainmentClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#f88cbd"}} onClick={(e) => handleFoodClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#f8b1a5"}} onClick={(e) => handleTransportClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#9e9add"}} onClick={(e) => handleShoppingClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#b8efec"}} onClick={(e) => handleOthersClick(e.target.checked)}/>
            <Checkbox defaultChecked style={{color: "#9ceb8f"}} onClick={(e) => handleIncomeClick(e.target.checked)}/>
        </div>
      </Paper>
      </div>
    );
}

