import React, { Component } from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import VisibilityIcon from '@material-ui/icons/Visibility'
import generalUtils from '../utils/general'

export class PullRequestRow extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isRead: this.props.data.isRead
    }

    this.handleIsRead = this.handleIsRead.bind(this)
  }

  async handleIsRead () {
    const isRead = await this.state.isRead
    await this.setState({ isRead: !isRead })
    const token = await window.sessionStorage.token
    await generalUtils.changePullReqIsRead(token, this.props.data.id, this.state.isRead)
  }

  render () {
    return (
      <TableRow className={this.state.isRead ? 'is-read' : null}>
        <TableCell><a href={this.props.data.url} target='_blank' rel='noopener noreferrer'>{this.props.data.title}</a></TableCell>
        <TableCell><a href={this.props.data.repoUrl} target='_blank' rel='noopener noreferrer'>{this.props.data.repo}</a></TableCell>
        <TableCell><a href={this.props.data.repoUrl + '/tree/' + this.props.data.branch} target='_blank' rel='noopener noreferrer'>{this.props.data.branch}</a></TableCell>
        <TableCell><a href={this.props.data.authorUrl} target='_blank' rel='noopener noreferrer'>{this.props.data.author}</a></TableCell>
        <TableCell>{new Date(this.props.data.published).toString().split('(')[0]}</TableCell>
        <TableCell align='right'><VisibilityIcon className='visibility-icon' onClick={this.handleIsRead} /></TableCell>
      </TableRow>
    )
  }
}

export default PullRequestRow
