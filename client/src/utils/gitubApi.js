import axios from 'axios'

const githubApi = {
  payloadMainUrl: 'https://europe-west2-gitnot-c209b.cloudfunctions.net/api',

  saveUserData: async function (token) {
    const userDetails = await this.getUserDetails(token)
    const userOrgs = await this.getUsersOrgs(token, userDetails.userName)

    await window.sessionStorage.setItem('userName', userDetails.userName)
    await window.sessionStorage.setItem('userId', userDetails.userId)
    await window.sessionStorage.setItem('userPhoto', userDetails.userPhoto)
    await window.sessionStorage.setItem('userOrgs', await JSON.stringify(userOrgs))
  },

  getUserDetails: async function (token) {
    const url = 'https://api.github.com/user'

    const userData = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      const userData = {}
      userData.userName = res.data.login
      userData.userId = res.data.id
      userData.userPhoto = res.data.avatar_url

      return userData
    }).catch(function (err) {
      // Log any errors
      console.log('something went wrong', err)
    })

    return userData
  },

  getUsersOrgs: async function (token, userName) {
    const userOrgs = await axios.get('https://api.github.com/user/orgs', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      return res.data
    }).catch(function (err) {
      // Log any errors
      console.log('something went wrong', err)
    })

    const adminOrgs = []

    for (const org of userOrgs) {
      // Check if user has admin privileges in org (can't subscribe to events otherwise)
      const hasAdminPriv = await this.hasOrgAdminPrivileges(token, userName, org.login)

      if (hasAdminPriv === true) {
        adminOrgs.push(org.login)
      }
    }

    return adminOrgs
  },

  hasOrgAdminPrivileges: async function (token, userName, orgName) {
    const hasAdminPrivs = await axios.get(`https://api.github.com/orgs/${orgName}/memberships/${userName}`, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).then(res => {
      return res.data.role
    })

    if (hasAdminPrivs === 'admin') {
      return true
    } else {
      return false
    }
  },

  createOrgHooks: async function (token, orgs) {
    const usersOrgs = await JSON.parse(orgs)

    for (const org of usersOrgs) {
      await this.createOrgHookPullReqs(token, org)
      await this.createOrgHookReleases(token, org)
    }
  },

  createOrgHookReleases: async function (token, org) {
    const url = `https://api.github.com/orgs/${org}/hooks`

    const payloadUrl = `${this.payloadMainUrl}/releases`
    const data = await JSON.stringify({
      name: 'web',
      active: true,
      events: [
        'release'
      ],
      config: {
        url: payloadUrl,
        content_type: 'json'
      }
    })

    await axios.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).catch(function (err) {
      // Log any errors
      console.log('something went wrong', err)
    })
  },

  createOrgHookPullReqs: async function (token, org) {
    const url = `https://api.github.com/orgs/${org}/hooks`

    const payloadUrl = `${this.payloadMainUrl}/pullrequests`
    const data = await JSON.stringify({
      name: 'web',
      active: true,
      events: [
        'pull_request'
      ],
      config: {
        url: payloadUrl,
        content_type: 'json'
      }
    })

    await axios.post(url, data, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    }).catch(function (err) {
      // Log any errors
      console.log('something went wrong', err)
    })
  }
}

export default githubApi
