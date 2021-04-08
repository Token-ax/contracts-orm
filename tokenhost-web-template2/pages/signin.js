import React, { Component, Fragment } from 'react'
import Head from 'next/head'
import getConfig from 'next/config'
import Router from 'next/router'
import { auth, firebase, firestore } from '../lib/db'
import { fetchDocumentFromCollectionByFieldName, isEmpty } from '../lib/utility'
import { fetchUserItems } from '../lib/utility'
import { base } from '../lib/db'

import { generateKeys } from '../helpers/Web3Helper'

const { publicRuntimeConfig } = getConfig()

export default class signin extends Component {
  _isMounted = false

  constructor(props) {
    super(props)
    this.state = { hideContent: true }
  }

  componentDidMount() {
    this._isMounted = true
    auth.onAuthStateChanged((user) => {
      if (user) {
        Router.push('/')
      } else if (this._isMounted) {
        this.setState({ hideContent: false })
      }
    })
  }

  componentWillUnmount() {
    this._isMounted = false
  }
  createKey = (eth_account) => {
    const x = fetchUserItems('keys').then((keys) => {
      if (!keys.length) {
        eth_account['userId'] = localStorage.getItem('USER')
        eth_account[
          'createdAt'
        ] = firebase.firestore.FieldValue.serverTimestamp()
        base.addToCollection('keys', eth_account).then(function () {
          Router.push('/')
        })
      }
    })
  }
  authenticate = (provider) => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]()
    auth.signInWithPopup(authProvider).then((result) => {
      const authUser = {
        uid: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,

        photo: result.user.photoURL,
      }
      this.authHandler(authUser)
    })
  }

  authHandler = (authUser) => {
    localStorage.setItem('USER', authUser.uid)

    // check if user exists in users collection
    fetchDocumentFromCollectionByFieldName({
      collectionName: 'users',
      fieldName: 'uid',
      value: authUser.uid,
    }).then((foundUser) => {
      const eth_account = generateKeys()

      if (isEmpty(foundUser)) {
        // it is an empty object
        // add the user to users collection and go to home page
        authUser['address'] = eth_account['address']
        firestore
          .collection('users')
          .add(authUser)
          .then((createdUser) => {
            this.createKey(eth_account)
          })
      } else {
        //this.createKey(eth_account)
        // TODO there's a chance that someone gets their account creating but then aborts before creating a key, in that case we'd need to update the 'address' field in their user id
        //since this is a proof of concept leave this for the future where we may refactor all this anyway
        Router.push('/')
      }
    })
  }

  render() {
    if (this.state.hideContent) {
      return null
    }

    return (
      <Fragment>
        <Head>
          <title>Sign in | {publicRuntimeConfig.pageTitle}</title>
          <link
            rel="stylesheet"
            href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
          />
        </Head>
        <div className="columns">
          <div className="column is-one-third is-offset-one-third has-text-centered button-container">
            <button
              className="button google is-fullwidth is-rounded p-5 is-inverted"
              onClick={() => this.authenticate('Google')}
            >
              <span className="icon">
                <i className="fab fa-google" />
              </span>
              <span>Login with Google</span>
            </button>
          </div>
        </div>
        <style jsx>{`
          .button-container {
            margin-top: 2rem;
            margin-bottom: 2rem;
          }
          .button {
            margin-top: 1rem;
          }
          .button:hover {
            opacity: 1;
          }
          .github {
            border-color: #444;
          }
          .facebook {
            border-color: #3b5998;
            color: #3b5998;
          }
          .twitter {
            border-color: #1583d7;
            color: #1583d7;
          }
          .google {
            border-color: rgb(26, 115, 232);
            color: rgb(26, 115, 232);
          }
        `}</style>
      </Fragment>
    )
  }
}
