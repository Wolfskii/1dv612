import React, { Component } from 'react'
import firebase from '../firebase'
import githubApi from '../utils/gitubApi'
import generalUtils from '../utils/general'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Copyright from './Copyright'

export class Login extends Component {
  constructor (props) {
    super(props)

    this.useStyles = makeStyles((theme) => ({
      paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      },
      avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
      },
      form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1)
      },
      submit: {
        margin: theme.spacing(3, 0, 2)
      }
    }))
  }

  render () {
    const classes = this.useStyles
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component='h3' variant='h6'>
              Sign in with you GitHub account
          </Typography>
          <form className={classes.form} noValidate>
            <Button
              fullWidth
              variant='contained'
              color='primary'
              onClick={generalUtils.handleLoginUser}
              className={classes.submit}
            >
                Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href='https://github.com/password_reset' target='_blank' variant='body2'>
                    Forgot password?
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
          <Copyright siteName='GitNot' />
        </Box>
      </Container>
    )
  }

  componentDidMount () {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await window.sessionStorage.getItem('oauthToken')
        await githubApi.saveUserData(token)
        await this.props.changeLoggedIn(true)
        window.location = '/dashboard'
      }
    })
  }
}

export default Login
