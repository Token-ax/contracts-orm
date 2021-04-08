import { doc } from 'prettier'
import { firestore, auth } from './db'

function fetchUserItems(collectionName) {
  const data = []
  const user = localStorage.getItem('USER')
  return new Promise((resolve, reject) => {
    if (!user) {
      resolve(data)
      return
    }

    firestore
      .collection(collectionName)
      .where('userId', '==', user)

      .orderBy('createdAt', 'desc')
      .get()
      .then((documentSet) => {
        if (documentSet != null) {
          documentSet.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            })
          })
        }
        resolve(data)
      })
  })
}

function fetchCollectionDocs(collectionName) {
  const data = []
  return new Promise((resolve, reject) => {
    firestore
      .collection(collectionName)
      .orderBy('createdAt', 'desc')
      .get()
      .then((documentSet) => {
        if (documentSet != null) {
          documentSet.forEach((doc) => {
            data.push({
              id: doc.id,
              ...doc.data(),
            })
          })
        }
        resolve(data)
      })
  })
}

function fetchDocumentFromCollection({ id, collectionName }) {
  return new Promise((resolve, reject) => {
    firestore
      .collection(collectionName)
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          resolve({
            id: doc.id,
            ...doc.data(),
          })
        } else {
          resolve({})
        }
      })
  })
}

function fetchDocumentFromCollectionByFieldName({
  collectionName,
  fieldName,
  value}
) {
  return new Promise((resolve, reject) => {
    firestore
      .collection(collectionName)
      .where(fieldName, '==', value)
      .limit(1)
      .get()
      .then((snapshot) => {
        if (snapshot.docs.length === 1) {
          const doc = snapshot.docs[0]
          if (doc.exists) {
            resolve({
              id: doc.id,
              ...doc.data(),
            })
          } else {
            resolve({})
          }
        } else {
          resolve({})
        }
      })
  })
}

function isEmpty(obj) {
  return obj.constructor === Object && Object.keys(obj).length === 0
}

export {
  fetchUserItems,
  fetchCollectionDocs,
  fetchDocumentFromCollection,
  fetchDocumentFromCollectionByFieldName,
  isEmpty,
}
