import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from './firebase'
import Dashboard from './pages/Dashboard'
import Header from './components/Header'
import Startpage from './pages/Startpage'
import './App.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = { isLoggedIn: false }
    this.changeLoggedIn = this.changeLoggedIn.bind(this)
  }

  changeLoggedIn (isLoggedIn) {
    this.setState({
      isLoggedIn: isLoggedIn
    })
  }

  render () {
    return (

      <Router>

        <div id='app'>
          <Header isLoggedIn={this.state.isLoggedIn} />
          <div id='body'>
            <Switch>
              <Route isLoggedIn={this.state.isLoggedIn} changeLoggedIn={this.changeLoggedIn} exact path='/dashboard' component={Dashboard} />
              <Route exact path='/'>
                <Startpage isLoggedIn={this.state.isLoggedIn} changeLoggedIn={this.changeLoggedIn} />
              </Route>
            </Switch>
          </div>
        </div>

      </Router>

    )
  }

  componentDidMount () {

  }
}

export default App
