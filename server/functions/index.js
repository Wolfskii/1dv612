const functions = require('firebase-functions').region('europe-west2')
const app = require('express')()

// Routes
// app.use('/', require('./routes/indexRoute'))
app.use('/releases', require('./routes/releaseRoute'))
app.use('/pullrequests', require('./routes/pullReqRoute'))

// Catch 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Page not found'
  })
})

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message || 'Internal Server Error')
})

exports.api = functions.https.onRequest(app)
