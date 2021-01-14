import firebase from 'firebase'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: 'AIzaSyBVwDmfzM_hVxNMg99_3VEPFP_QPeFoLVM',
  authDomain: 'gitnot-c209b.firebaseapp.com',
  databaseURL: 'https://gitnot-c209b.firebaseio.com',
  projectId: 'gitnot-c209b',
  storageBucket: 'gitnot-c209b.appspot.com',
  messagingSenderId: '190103381899',
  appId: '1:190103381899:web:3420cd4e9781d11256f18e'
}

firebase.initializeApp(config)

export default firebase

export const database = firebase.database()
export const auth = firebase.auth()
// export const storage = firebase.storage()
// export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
// export const messaging = firebase.messaging()
