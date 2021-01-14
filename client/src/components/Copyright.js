import React, { Component } from 'react'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import generalUtils from '../utils/general'

export class Copyright extends Component {
  render () {
    return (
      <Typography variant='body2' color='textSecondary' align='center'>
        {'Copyright © '}
        <Link color='inherit' href={this.getMainUrl()}>
          {'GitNot'}
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    )
  }

  getMainUrl () {
    if (window.location.hostname === 'localhost') {
      return 'http://' + window.location.hostname + ':3000'
    } else {
      return 'https://' + window.location.hostname
    }
  }
}

export default Copyright
