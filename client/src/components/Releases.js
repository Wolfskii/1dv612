import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Title from './Title'
import ReleaseRow from './ReleaseRow'
import firebase from '../firebase'
import generalUtils from '../utils/general'

function useReleaseRows () {
  const [releaseRows, setReleaseRows] = useState([])

  useEffect(() => {
    let initState = true
    // As the onSnapshot method gets all current docs too we want to separate the current from the future notifications

    firebase
      .firestore()
      .collection('releases')
      .where('hookOwnerId', '==', parseInt(window.sessionStorage.userId))
      .onSnapshot((snapshot) => {
        const releaseRows = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
        setReleaseRows(releaseRows)

        if (initState === false) {
          snapshot.docChanges().forEach(function (change) {
            if (change.type === 'added') {
              const body = `"${change.doc.data().title}" was created by ${change.doc.data().author} in repo: ${change.doc.data().repo} of organization: ${change.doc.data().organization}.`
              generalUtils.showNotification('New Release', body, change.doc.data().url)
            } else if (change.type === 'removed') {
              const body = `"${change.doc.data().title}" in repo: ${change.doc.data().repo} of organization: ${change.doc.data().organization} was removed.`
              generalUtils.showNotification('Release removed', body, change.doc.data().url)
            }
          })
        }
        initState = false
      })
  }, [])

  return releaseRows
}

function renderIfMatching (row, props) {
  if (props.currOrg === row.organization) {
    if (props.showIsRead === false && row.isRead === true) {
      // Don't output (if on dont show already read notifications)
    } else {
      return <ReleaseRow data={row} key={row.id} />
    }
  }
}

function preventDefault (event) {
  event.preventDefault()
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3)
  }
}))

export default function Releases (props) {
  const releaseRows = useReleaseRows()

  const classes = useStyles()
  return (
    <>
      <Title>Recent Releases</Title>
      <Table size='small'>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Repo</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Published</TableCell>
            <TableCell align='right'>Toggle read</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {releaseRows.map((row) => (renderIfMatching(row, props)))}
        </TableBody>
      </Table>
    </>
  )
}
