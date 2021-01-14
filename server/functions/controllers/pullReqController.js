const admin = require('firebase-admin')
const cors = require('cors')
admin.initializeApp()

const pullReqController = {}

pullReqController.read = async (req, res, next) => {
  admin
    .firestore()
    .collection('pullRequests')
    .orderBy('published', 'desc')
    .get()
    .then(data => {
      const pullRequests = []
      data.forEach(doc => {
        pullRequests.push({
          id: doc.id,
          title: doc.data().title,
          published: doc.data().published,
          url: doc.data().url,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          branch: doc.data().branch,
          hookOwnerId: doc.data().hookOwnerId,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(pullRequests)
    })
    .catch(err => res.status(500).json({ message: err }))
}

pullReqController.readById = async (req, res, next) => {
  admin
    .firestore()
    .collection('pullRequests')
    .doc(req.params.pullReqId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ message: 'No such pull request!' })
      } else {
        return res.status(200).json(doc.data())
      }
    })
    .catch(err => res.status(500).json({ message: err }))
}

pullReqController.readByRepo = async (req, res, next) => {
  admin
    .firestore()
    .collection('pullRequests')
    .where('repo', '==', req.params.repo)
    .get()
    .then(data => {
      const pullRequests = []
      data.forEach(doc => {
        pullRequests.push({
          id: doc.id,
          title: doc.data().title,
          published: doc.data().published,
          url: doc.data().url,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          branch: doc.data().branch,
          hookOwnerId: doc.data().hookOwnerId,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(pullRequests)
    })
    .catch(err => res.status(500).json({ message: err }))
}

pullReqController.readByAuthor = async (req, res, next) => {
  admin
    .firestore()
    .collection('pullRequests')
    .where('author', '==', req.params.author)
    .get()
    .then(data => {
      const pullRequests = []
      data.forEach(doc => {
        pullRequests.push({
          id: doc.id,
          title: doc.data().title,
          published: doc.data().published,
          url: doc.data().url,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          branch: doc.data().branch,
          hookOwnerId: doc.data().hookOwnerId,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(pullRequests)
    })
    .catch(err => res.status(500).json({ message: err }))
}

pullReqController.post = async (req, res, next) => {
  // Check for GH constant webhook-IP
  if (req.connection.remoteAddress.includes('169.254.8')) {
    const action = req.body.action
    // Check which kind of action has happened
    if (action === 'opened' || action === 'reopened') {
      pullReqController.create(req, res)
    } else if (action === 'edited') {
      pullReqController.update(req, res)
    } else if (action === 'closed') {
      pullReqController.delete(req, res)
    }
  }
}

pullReqController.create = async (req, res, next) => {
  const newPullReq = {
    title: req.body.pull_request.title,
    published: req.body.pull_request.created_at,
    url: req.body.pull_request.html_url,
    author: req.body.pull_request.user.login,
    authorUrl: req.body.pull_request.user.html_url,
    repo: req.body.pull_request.head.repo.name,
    repoUrl: req.body.pull_request.head.repo.html_url,
    organization: req.body.organization.login,
    branch: req.body.pull_request.head.ref,
    hookOwnerId: req.body.sender.id,
    isRead: false
  }

  admin
    .firestore()
    .collection('pullRequests')
    .doc(notificationId(req, res))
    .set(newPullReq)
    .then((doc) => {
      res.status(201).json(newPullReq)
    })
    .catch(err => res.status(500).json({ message: err }))
}

pullReqController.update = async (req, res, next) => {
  try {
    admin
      .firestore()
      .collection('pullRequests')
      .doc(notificationId(req, res))
      .get()
      .then((doc) => {
        if (doc.exists) {
          admin.firestore().collection('pullRequests').doc(doc.id).update({
            title: req.body.pull_request.title,
            published: req.body.pull_request.created_at,
            url: req.body.pull_request.html_url,
            author: req.body.pull_request.user.login,
            authorUrl: req.body.pull_request.user.html_url,
            repo: req.body.pull_request.head.repo.name,
            repoUrl: req.body.pull_request.head.repo.html_url,
            organization: req.body.organization.login,
            branch: req.body.pull_request.head.ref,
            hookOwnerId: req.body.sender.id,
            isRead: false
          })
          const updatedPullReq = admin.firestore().collection('pullRequests').doc(doc.id)
          return res.status(200).json(updatedPullReq)
        } else {
          return res.status(404).json({ message: 'No such pull request!' })
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

pullReqController.delete = async (req, res, next) => {
  try {
    admin
      .firestore()
      .collection('pullRequests')
      .doc(notificationId(req, res))
      .get()
      .then((doc) => {
        if (doc.exists) {
          admin.firestore().collection('pullRequests').doc(doc.id).delete()
          return res.status(204)
        } else {
          return res.status(404).json({ message: 'No such pull request!' })
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

function notificationId (req, res) {
  return `${req.body.pull_request.id}${req.body.sender.id}`
}

module.exports = pullReqController
