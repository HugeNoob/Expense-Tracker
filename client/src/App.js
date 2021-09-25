import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import { createTheme } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import HomePage from './components/HomePage';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import clsx from 'clsx';
import TransactionPage from './components/TransactionPage';
import { AuthContext } from './context/GlobalState';
import LoginRegister from './components/LoginRegister';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    color: '#ffffff',
    backgroundColor: '#333333',
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    color: '#ffffff'
  },
  hide: {
    display: 'none',
  },
  moneyicon: {
    marginLeft: 10
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    paper: 'red',
  },
  drawerpaper: {
    backgroundColor: '#424242'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) - 100,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    color: '#ffffff'
  },
}));


function App() {
  const THEME = createTheme({
      typography: {
      "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
      "fontSize": 14,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
      }, breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 1000,
          lg: 1650,
          xl: 1801,
        },
      },
  });
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { authstate, user, loadUser, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = (e) => {
    logoutUser();
  }

  return (
    <Router>
      {authstate !== true ? <LoginRegister /> : <div className='container' >
        <MuiThemeProvider theme={THEME}>

            {/* App Outline */}
            <div className={classes.root}>

              {/* Top app bar */}
              <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                  [classes.appBarShift]: open,
                })}
              >

                <Toolbar>

                  <IconButton
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, {
                      [classes.hide]: open,
                    })}
                  >
                    <MenuIcon />
                  </IconButton>

                  <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}>
                      <Typography variant="h6">
                        Expense Tracker 
                      </Typography>
                      <MonetizationOnIcon className={classes.moneyicon}/>
                  </div> 

                  <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap', position: 'relative', left: 1500}}> 
                    <AccountCircleIcon />
                    <Typography style={{marginLeft: 10}}>
                      {user !== null ? user.name : ''}
                    </Typography>

                  </div>


                </Toolbar>

              </AppBar>

              <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                })}
                classes={{
                  paper: clsx(classes.drawerpaper,{
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                  }),
                }}
              >
                <div className={classes.toolbar}>
                  <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon style={{color: 'white'}}/>
                  </IconButton> 
                </div>
                <Divider />

                {/* Items in side drawer */}
                <List>
                  <Link style={{color: '#424242'}} to='/'>
                    <ListItem alignItems='center' button >
                      <ListItemIcon>{<HomeIcon style={{fill: 'white'}} className={classes.listIcon}/>}</ListItemIcon>
                      <ListItemText primary='Home Page'/>
                    </ListItem>
                  </Link>

                  <Link style={{color: '#424242'}} to='/transactions'>
                    <ListItem alignItems='center' button >
                      <ListItemIcon>{<LocalAtmIcon style={{fill: 'white'}} className={classes.listIcon}/>}</ListItemIcon>
                      <ListItemText primary='Transactions'/>
                    </ListItem>
                  </Link>

                  <Divider />

                  <Link style={{color: '#424242'}} to='/'>
                    <ListItem alignItems='center' button onClick={(e) => handleLogout(e)} >
                        <ListItemIcon>{<ExitToAppIcon style={{fill: 'white'}} className={classes.listIcon}/>}</ListItemIcon>
                        <ListItemText primary='Logout'/>
                    </ListItem>
                  </Link>

                </List>


              </Drawer>
              
              <main className={classes.content}>
                <div className={classes.toolbar} />
                  <Switch>
                    <Route path='/' exact component={HomePage} />
                    <Route path='/transactions' exact component={TransactionPage} />
                  </Switch>
              </main>
              
            </div>
          
        </MuiThemeProvider>
      </div>}
    </Router>
  );
}

export default App;
