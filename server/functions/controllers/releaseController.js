const admin = require('firebase-admin')

const releaseController = {}

releaseController.read = async (req, res, next) => {
  admin
    .firestore()
    .collection('releases')
    .orderBy('published', 'desc')
    .get()
    .then(data => {
      const releases = []
      data.forEach(doc => {
        releases.push({
          id: doc.id,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          hookOwnerId: doc.data().hookOwnerId,
          published: doc.data().published,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          title: doc.data().title,
          url: doc.data().url,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(releases)
    })
    .catch(err => res.status(500).json({ message: err }))
}

releaseController.readById = async (req, res, next) => {
  admin
    .firestore()
    .collection('releases')
    .doc(req.params.releaseId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ message: 'No such release!' })
      } else {
        return res.status(200).json(doc.data())
      }
    })
    .catch(err => res.status(500).json({ message: err }))
}

releaseController.readByRepo = async (req, res, next) => {
  admin
    .firestore()
    .collection('releases')
    .where('repo', '==', req.params.repo)
    .get()
    .then(data => {
      const releases = []
      data.forEach(doc => {
        releases.push({
          id: doc.id,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          hookOwnerId: doc.data().hookOwnerId,
          published: doc.data().published,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          title: doc.data().title,
          url: doc.data().url,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(releases)
    })
    .catch(err => res.status(500).json({ message: err }))
}

releaseController.readByAuthor = async (req, res, next) => {
  admin
    .firestore()
    .collection('releases')
    .where('author', '==', req.params.author)
    .get()
    .then(data => {
      const releases = []
      data.forEach(doc => {
        releases.push({
          id: doc.id,
          author: doc.data().author,
          authorUrl: doc.data().authorUrl,
          hookOwnerId: doc.data().hookOwnerId,
          published: doc.data().published,
          repo: doc.data().repo,
          repoUrl: doc.data().repoUrl,
          organization: doc.data().organization,
          title: doc.data().title,
          url: doc.data().url,
          isRead: doc.data().isRead
        })
      })
      return res.status(200).json(releases)
    })
    .catch(err => res.status(500).json({ message: err }))
}

releaseController.post = async (req, res, next) => {
  // Check for GH constant webhook-IP
  if (req.connection.remoteAddress.includes('169.254.8')) {
    const action = req.body.action
    // Check which kind of action has happened
    if (action === 'released') {
      releaseController.create(req, res)
    } else if (action === 'edited') {
      releaseController.update(req, res)
    } else if (action === 'deleted') {
      releaseController.delete(req, res)
    }
  }
}

releaseController.create = async (req, res, next) => {
  const newRelease = {
    title: req.body.release.name,
    published: req.body.release.created_at,
    url: req.body.release.html_url,
    author: req.body.release.author.login,
    authorUrl: req.body.release.author.html_url,
    repo: req.body.repository.name,
    repoUrl: req.body.repository.html_url,
    organization: req.body.organization.login,
    hookOwnerId: req.body.sender.id,
    isRead: false
  }

  admin
    .firestore()
    .collection('releases')
    .doc(notificationId(req, res))
    .set(newRelease)
    .then((doc) => {
      res.status(201).json(newRelease)
    })
    .catch(err => res.status(500).json({ message: err }))
}

releaseController.update = async (req, res, next) => {
  try {
    admin
      .firestore()
      .collection('releases')
      .doc(notificationId(req, res))
      .get()
      .then((doc) => {
        if (doc.exists) {
          admin.firestore().collection('releases').doc(doc.id).update({
            title: req.body.release.name,
            published: req.body.release.created_at,
            url: req.body.release.html_url,
            author: req.body.release.author.login,
            authorUrl: req.body.release.author.html_url,
            repo: req.body.repository.name,
            repoUrl: req.body.repository.html_url,
            organization: req.body.organization.login,
            hookOwnerId: req.body.sender.id,
            isRead: false
          })
          const updatedRelease = admin.firestore().collection('releases').doc(doc.id)
          return res.status(200).json(updatedRelease)
        } else {
          return res.status(404).json({ message: 'No such release!' })
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

releaseController.delete = async (req, res, next) => {
  try {
    admin
      .firestore()
      .collection('releases')
      .doc(notificationId(req, res))
      .get()
      .then((doc) => {
        if (doc.exists) {
          admin.firestore().collection('releases').doc(doc.id).delete()
          return res.status(204)
        } else {
          return res.status(404).json({ message: 'No such release!' })
        }
      })
  } catch (err) {
    return res.status(500).json({ message: err })
  }
}

function notificationId (req, res) {
  return `${req.body.release.id}${req.body.sender.id}`
}

module.exports = releaseController
