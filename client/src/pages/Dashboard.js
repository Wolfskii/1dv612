import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import PullRequests from '../components/PullRequests'
import Releases from '../components/Releases'
import OrgSelection from '../components/OrgSelection'
import Copyright from '../components/Copyright'
import generalUtils from '../utils/general'
import githubApi from '../utils/gitubApi'
import './Dashboard.css'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}))

export default function Dashboard (props) {
  const userOrgs = JSON.parse(window.sessionStorage.getItem('userOrgs'))
  let firstOrg = ''
  if (window.sessionStorage.userOrgs) { firstOrg = userOrgs[0] }
  const [currOrg, setCurrOrg] = useState(firstOrg)
  const [showIsRead, setshowIsRead] = useState(true)
  const [isLoggedIn] = useState(props.isLoggedIn)

  useEffect(() => {
    if (window.sessionStorage.oauthToken) {
      const token = window.sessionStorage.getItem('oauthToken')
      const userOrgs = window.sessionStorage.getItem('userOrgs')
      githubApi.createOrgHooks(token, userOrgs)
      generalUtils.requestNotificationPermission()
    } else {
      window.location = '/'
    }
  }, [isLoggedIn])

  function changeCurrOrg (newOrg) {
    setCurrOrg(newOrg)
  }

  function changeShowIsRead () {
    setshowIsRead(!showIsRead)
  }

  function renderOnLoginStatus () {
    if (window.sessionStorage.oauthToken) {
      return renderLoggedIn()
    } else {
      return renderLoggedOut()
    }
  }

  function renderLoggedOut () {
    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <Container maxWidth='lg' className={classes.container}>
            <h2>Not logged in</h2>
            <p>You will be redirected to the start page, please log in first to access this page. </p>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    )
  }

  function renderLoggedIn () {
    return (
      <div className={classes.root}>
        <main className={classes.content}>
          <Container maxWidth='lg' className={classes.container}>
            <OrgSelection orgs={userOrgs} changeCurrOrg={changeCurrOrg} />
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Releases currOrg={currOrg} showIsRead={showIsRead} />
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <PullRequests currOrg={currOrg} showIsRead={showIsRead} />
                </Paper>
              </Grid>
            </Grid>
            <br />
            <input type='checkbox' id='showIsRead' name='showIsRead' checked={showIsRead} onChange={changeShowIsRead} />
            <label for='showIsRead'> Show already read notifications</label>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    )
  }

  const classes = useStyles()

  return renderOnLoginStatus()
}
