import React, { useState, useContext, useEffect } from 'react';
import { PieChart, Pie, Sector } from 'recharts';
import { Paper, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Slider from '@material-ui/core/Slider';
import { GlobalContext } from '../context/GlobalState'
import { AuthContext } from '../context/GlobalState'

const RenderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';


  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill='white' fontFamily="roboto">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={payload.fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={payload.fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={payload.fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={payload.fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="white" style={{fontFamily: 'roboto'}}>{`$${value}`}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" style={{fontFamily: 'roboto'}}>
        {`(${(percent * 100).toFixed(2)}% of total)`}
      </text>
    </g>
  );
};

function MonthlyOverview({props}){
  const monthData = Object.entries(props);
  return(
    <div style={{backgroundColor: '#212121', position: 'absolute', left: 30, top: 100}}>
      <Typography component='span'>
        <h3 style={{color: 'white'}}>Overview: </h3>
      </Typography>

      {monthData.map((dataRow) => {
        return(
        <div style={{display: 'flex', flexDirection: 'row'}} key={dataRow[0]}>
          <span style={{display: 'inline-block', backgroundColor: `${dataRow[1].color}` , width: 10, height: 10, marginTop: 4, marginRight: 5}}></span>
          <p style={{color: 'white', marginTop: 0, fontFamily: 'roboto', fontSize: 15}}>{dataRow[0]}: ${dataRow[1].amount}</p>
        </div>
      )})}
    </div>

  )
}

function MonthlyObservations({props}){
  const monthData = props;
  
  const processData = (data) => {
    const processed = {
      inflow: 0,
      outflow: 0,
      highestspent: {
        category: '',
        amount: 0
      },
    }
    for(let category in data){
      if(category === 'Income'){
        processed.inflow += data[category].amount
      } else {
        processed.outflow += data[category].amount
        if(data[category].amount > processed.highestspent.amount){
          processed.highestspent.category = category
          processed.highestspent.amount = data[category].amount
        }
      }
    }
    return processed
  }

  const observationData = processData(monthData);

  return(
    <div style={{backgroundColor: '#212121', position: 'absolute', left: 30, top: 420}}>
        <Typography component='span'>
          <h3 style={{color: 'white'}}>A few observations: </h3>
          <ul style={{color: 'white'}}>
            <li>
              Your total inflow and outflow this month are ${observationData.inflow} and ${observationData.outflow} respectively.
            </li>
            <li>
              Your net flow for the month is {(observationData.inflow-observationData.outflow) >= 0 ? `$${observationData.inflow-observationData.outflow}` : `-$${observationData.outflow-observationData.inflow}`}
            </li>
            <li>
              {observationData.highestspent.category.length > 0 ?
              `You've spent the most on ${observationData.highestspent.category}, with $${observationData.highestspent.amount} spent.` :
              `You haven't spent anything yet.`
              }
            </li>
          </ul>
        </Typography>
    </div>

  )
}

export default function MonthlyChart() {
  const [activeIndex, setActiveIndex] = useState(0)
  const { user } = useContext(AuthContext)
  const { transactions, getTransactions } = useContext(GlobalContext)

  useEffect(() => {
    if(user !== null){
      getTransactions({ userid: user._id })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const getMonthName = (monthstr) => {
    switch (monthstr) {
      case '01':
        return 'January'
      case '02':
        return 'February'
      case '03':
        return 'March'
      case '04':
        return 'April'
      case '05':
        return 'May'
      case '06':
        return 'June'
      case '07':
        return 'July'
      case '08':
        return 'August'
      case '09':
        return 'September'
      case '10':
        return 'October'
      case '11':
        return 'November'
      default:
        return 'December'
    }
  }

  const getMonthNumber = (monthstr) => {
    if(monthstr.slice(0,1) === '0'){
      return Number(monthstr.slice(1,2))
    } else {
      return Number(monthstr)
    }
  }

  const getMonthStr = (monthnumber) => {
    let monthstr = monthnumber.toString()
    if(monthstr.length === 1){
      return '0'.concat(monthstr)
    }
    return monthstr
  }

  const [month, setMonth] = useState(getMonthStr((new Date()).getMonth() + 1))
  const [sliderMonth, setSliderMonth] = useState(getMonthNumber(month))

  const filterRows = (array, month) => {
    return array.filter(row => row.date.slice(0,2) === month)
  }

  const consolidateData = array => {
    let results = {
      Income: {
        color: '#9ceb8f',
        amount: 0,
      },
      Bills: {
        color: '#f66455',
        amount: 0,
      },
      Entertainment: {
        color: '#f1d303',
        amount: 0,
      },
      Food: {
        color: '#f88cbd',
        amount: 0,
      },
      Transport: {
        color: '#f8b1a5',
        amount: 0,
      },
      Shopping: {
        color: '#9e9add',
        amount: 0,
      },
      Others: {
        color: '#b8efec',
        amount: 0,
      },
    };
    for(let row of array){
      switch(row.category){
        case 'Income':
          results.Income.amount += row.amount
          break
        case 'Bills':
          results.Bills.amount += row.amount
          break
        case 'Entertainment':
          results.Entertainment.amount += row.amount
          break
        case 'Food':
          results.Food.amount += row.amount
          break
        case 'Transport':
          results.Transport.amount += row.amount
          break
        case 'Shopping':
          results.Shopping.amount += row.amount
          break
        case 'Others':
          results.Others.amount += row.amount
          break
        default:
          break
      }
    }
    return results
  }

  const formatChartData = dict => {
    let chartData = [];
    for(let row in dict){
      if(row !== 'Income' && dict[row].amount !== 0){
        chartData = [...chartData, {name: row, value: dict[row].amount, fill: dict[row].color}]
      }    
    }
    return chartData
  }

  const monthData = consolidateData(filterRows(transactions, month));
  const chartData = formatChartData(monthData);
  const handleonPieEnter = (_, index) => {
    setActiveIndex(index)
  }

  const handleSliderChange = (_, value) => {
    setSliderMonth(value);
    setMonth(getMonthStr(value));
  }
  
  return (
      <div style={{ width: 800, position: 'relative', top: -20, left: 20}}>
        <Paper style={{backgroundColor: '#212121'}} elevation={0}>


          <Box sx={{ width: 300 }} style={{ position: 'relative', left: 30, top: 20}}>
            <Slider
              aria-label="Month"
              value={sliderMonth}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={1}
              max={12}
              onChangeCommitted={(_, value) => handleSliderChange(_, value)}
            />
          </Box>

          <Typography component='span'>
            <h2 style={{ paddingLeft: 30, color: 'white'}}>{getMonthName(month)}'s outlook</h2>
          </Typography>

          <PieChart width={550} height={300} style={{paddingLeft: 200}}>
            <Pie
              activeIndex={activeIndex}
              activeShape={RenderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              onMouseEnter={handleonPieEnter}
            />
          </PieChart>

          <MonthlyOverview props={monthData}/>
          <MonthlyObservations props={monthData} />

        </Paper>
      </div>
  );
}

