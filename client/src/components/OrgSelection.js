import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import PersonIcon from '@material-ui/icons/Person'
import { blue } from '@material-ui/core/colors'

class SimpleDialog extends Component {
  constructor (props) {
    super(props)

    this.open = this.props.open
    this.onClose = this.props.onClose
    this.selectedValue = this.props.selectedValue

    this.styles = theme => ({
      avatar: {
        backgroundColor: blue[100],
        color: blue[600]
      }
    })
  }

  handleClose = () => {
    this.props.onClose(this.props.selectedValue)
  }

  handleListItemClick = (value) => {
    this.props.onClose(value)
  }

  render () {
    const classes = this.styles

    return (
      <Dialog onClose={this.handleClose} aria-labelledby='simple-dialog-title' open={this.props.open}>
        <DialogTitle id='simple-dialog-title'>Your organizations</DialogTitle>
        <List>
          {this.props.orgs.map((org) => (
            <ListItem button onClick={() => this.handleListItemClick(org)} key={org}>
              <ListItemAvatar>
                <Avatar className={classes.avatar}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={org} />
            </ListItem>
          ))}
        </List>
      </Dialog>
    )
  }

  componentDidMount () {
    // Something
  }
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
  orgs: PropTypes.array.isRequired
}

export default class SimpleDialogUsecase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      open: false,
      orgs: this.props.orgs,
      selectedValue: this.props.orgs[0]
    }
  }

  render () {
    return (
      <div>
        <div className='org-heading'>
          <h1>{this.state.selectedValue}</h1>
        </div>
        <div>
          <Button variant='outlined' color='primary' onClick={this.handleClickOpen}>
            Select organization
          </Button>
          <SimpleDialog orgs={this.state.orgs} selectedValue={this.state.selectedValue} open={this.state.open} onClose={this.handleClose} />
        </div>
      </div>
    )
  }

  componentDidMount () {
    // TODO: Remove here, add to dahsboard: this.addOrgsToList()
    this.props.changeCurrOrg(this.state.selectedValue)
  }

  handleClickOpen = () => {
    this.setState({
      open: true
    })
  }

  handleClose = (value) => {
    this.props.changeCurrOrg(value)

    this.setState({
      open: false,
      selectedValue: value
    })
  }
}
