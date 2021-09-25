import React, { useState, useContext, useEffect } from 'react'
import { Divider, Paper, Typography } from '@material-ui/core'
import { Button } from '@material-ui/core'
import { TextField } from '@material-ui/core'
import { makeStyles } from '@material-ui/core'
import VisibilityIcon from '@material-ui/icons/Visibility';
import { AuthContext } from '../context/GlobalState'
import { ErrorContext } from '../context/GlobalState'
import Alert from '@mui/material/Alert';


const useStyles = makeStyles((theme) => ({
    textfields: {
        width: 260,
        marginLeft: 70,
        marginTop: 30 
    }
  }));

const Login = (props) => {
    const classes = useStyles();
    const [loginUsername, setLoginUsername] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false)
    const [errormsg, setErrormsg] = useState('')
    const { loginUser } = useContext(AuthContext);
    const { error } = useContext(ErrorContext);

    useEffect(() => {
        handleErrormsg(); 
    })
    
    const handleViewPassword = (e) => {
        e.preventDefault()
        setViewPassword(!viewPassword)
    }

    const handleLogin = (e) => {
        e.preventDefault();
        if(loginUsername.length === 0 || loginPassword.length === 0){
            setErrormsg('Please fill in all login fields.')
            return
        }
        loginUser({username: loginUsername, password: loginPassword})
    }

    const handleErrormsg = () => {
        if(typeof(error.msg) === 'string' && error.msg !== 'Access denied' && error.msg !== 'Username already exists.'){
            setErrormsg(error.msg)
        }
    }

    return(
        <div>
            
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', paddingTop: 20}}>
                
                {errormsg.length !== 0 ? <Alert severity="error" style={{position: 'relative'}}>{errormsg}</Alert> : ''}

                <TextField
                required
                id="outlined-required"
                label="Username"
                variant="outlined"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className={classes.textfields}
                />
                
                <TextField
                id="outlined-password-input"
                label="Password"
                type={viewPassword ? '' : 'password'}
                variant="outlined"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className={classes.textfields}
                />

            </div>
            <Button style={{position: 'relative', top: -47, left: 330}} onClick={handleViewPassword}><VisibilityIcon /></Button>

            <Button 
            color='primary' 
            variant="contained"
            onClick={(e) => handleLogin(e)}
            style={{postion: 'relative', top: 30, left: 188}}
            >
            Log In
            </Button>
        </div>

    )
}

const Register = (props) => {
    const classes = useStyles();
    const [registerName, setRegisterName] = useState('')
    const [registerUsername, setRegisterUsername] = useState('')
    const [registerPassword, setRegisterPassword] = useState('')
    const [viewPassword, setViewPassword] = useState(false)
    const [errormsg, setErrormsg] = useState('')
    const { registerUser } = useContext(AuthContext);
    const { error } = useContext(ErrorContext);

    useEffect(() => {
        handleErrormsg(); 
    })
    
    const handleRegister = (e) => {
        e.preventDefault()
        if(registerName.length === 0 || registerUsername.length === 0 || registerPassword.length === 0){
            setErrormsg('Please fill in all register fields.')
            return
        }
        registerUser({name: registerName, username: registerUsername, password: registerPassword})
    }

    const handleViewPassword = (e) => {
        e.preventDefault()
        setViewPassword(!viewPassword)
    }

    const handleErrormsg = () => {
        if((typeof(error.msg) === 'string') && (error.msg === 'Username already exists.' || error.msg === 'Please fill in all register fields.')){
            setErrormsg(error.msg)
        }
    }

    return (
        <div>
            
            {errormsg.length !== 0 ? <Alert severity="error" style={{position: 'relative'}}>{errormsg}</Alert> : ''}
            
            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                <TextField
                required
                id="outlined-required"
                label="Display Name"
                variant="outlined"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className={classes.textfields}
                />

                <TextField
                required
                id="outlined-required"
                label="Username"
                variant="outlined"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                className={classes.textfields}
                />
                
                <TextField
                id="outlined-password-input"
                label="Password"
                type={viewPassword ? '' : 'password'}
                variant="outlined"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className={classes.textfields}
                />

            </div>
            
            <Button style={{position: 'relative', top: -47, left: 330}}  onClick={handleViewPassword}><VisibilityIcon/></Button>

            <Button 
            color='primary' 
            variant="contained" 
            onClick={(e) => handleRegister(e)}
            style={{postion: 'relative', top: 30, left: 168}}
            >
            Register
            </Button>
        </div>
    )
}

const LoginRegister = (props) => {
    
    return (
        <div style={{position: 'absolute', left: 740, top: 20}}>
            <Typography style={{color: 'white', marginLeft: 0, marginTop: 30}}>
                <h2>Expense Tracker</h2>
            </Typography>
            <div >

                <Paper elevation={3} style={{backgroundColor: '#494952', width: 400, height: 750}}>

                    <Login />
                    <Divider style={{marginTop: 80}} />
                    <Register />

                </Paper>
            </div>
        </div>
    )
}

export default LoginRegister
