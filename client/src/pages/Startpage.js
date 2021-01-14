import React, { Component } from 'react'
import Login from '../components/Login'
import Button from '@material-ui/core/Button'
import logo from '../img/logo.svg'
import generalUtils from '../utils/general'

export class Startpage extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isLoggedIn: this.props.isLoggedIn
    }
  }

  render () {
    return (
      <div id='hero'>
        <div id='hero-content'>
          <div id='logo'><a href={generalUtils.getMainUrl}><img src={logo} alt='logo' height='200px' /></a></div>
          <h1>About GitNot</h1>
          <br />
          <p>This is a web app created by Dawid Kaleta, studying Web Programming at the Linnaeus University in Kalmar, Sweden.
             The application is ment to keep track of a users different Github events from their various organizations and
             consists of both a server and client (this web app) and is built with technologies like Node.js,
             Google Firebase, Google Cloud Functions, OAuth, React and MaterialUI.
          </p>
          <br />
          {this.renderLoggedInOrNot()}

        </div>
      </div>
    )
  }

  renderLoggedInOrNot () {
    if (!window.sessionStorage.getItem('githubToken')) {
      return <Login changeLoggedIn={this.props.changeLoggedIn} />
    } else {
      return <Button variant='contained' color='primary' onClick={generalUtils.getMainUrl}>To Dashboard</Button>
    }
  }

  handleSendToDashboard () {
    window.location = '/dashboard'
  }
}

export default Startpage
