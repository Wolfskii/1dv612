import firebase from '../firebase'

const general = {
  serverUrl: 'https://europe-west2-gitnot-c209b.cloudfunctions.net/api',

  getMainUrl: async function () {
    if (window.location.hostname === 'localhost') {
      return 'http://' + window.location.hostname + ':3000'
    } else {
      return 'https://' + window.location.hostname
    }
  },

  changePullReqIsRead: async function (token, pullReqId, isRead) {
    const pullreqToChange =
    firebase
      .firestore()
      .collection('pullRequests')
      .doc(pullReqId)

    return pullreqToChange.update({
      isRead: isRead
    })
      .catch(function (error) {
      // The document probably doesn't exist.
        console.error('Error updating pull request: ', error)
      })
  },

  changeReleaseIsRead: async function (token, releaseId, isRead) {
    const pullreqToChange =
    firebase
      .firestore()
      .collection('releases')
      .doc(releaseId)

    return pullreqToChange.update({
      isRead: isRead
    })
      .catch(function (error) {
      // The document probably doesn't exist.
        console.error('Error updating pull request: ', error)
      })
  },

  handleLoginUser: async function () {
    const provider = new firebase.auth.GithubAuthProvider()

    provider.addScope('admin:repo_hook')
    provider.addScope('admin:org_hook')
    provider.addScope('notifications')
    provider.addScope('read:org')
    provider.addScope('repo:status')

    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    firebase.auth().signInWithPopup(provider).then((result) => {
      const token = result.credential.accessToken
      window.sessionStorage.setItem('oauthToken', token)
    }).catch(function (error) {
      // Handle Errors here.
      console.log(error)
    })
  },

  handleLogoutUser: async function () {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      window.sessionStorage.clear()
    }).catch(function (error) {
      console.log(error)
    })
    window.location = '/'
  },

  requestNotificationPermission: function () {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification')
    } else {
      window.Notification.requestPermission()
    }
  },

  showNotification: function (title, body, link) {
    const options = {
      body: body,
      icon: 'https://i.imgur.com/lO8wsXV.png',
      dir: 'ltr'
    }

    const notification = new window.Notification(title, options)

    if (link) {
      notification.onclick = function (event) {
        event.preventDefault() // prevent the browser from focusing the Notification's tab
        window.open(link, '_blank')
      }
    }

    return notification
  }
}

export default general
