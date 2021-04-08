import React, { Component, Fragment } from 'react'
import { useForm } from 'react-hook-form'
import { base } from '../lib/db'
import * as firebase from 'firebase'

import { useRouter } from 'next/router'

export default function Create() {
  const router = useRouter()

  const { register, handleSubmit, watch, errors } = useForm()
  const onSubmit = (data) => {
    data['userId'] = window.user.uid
    data['createdAt'] = firebase.firestore.FieldValue.serverTimestamp()
    base.addToCollection('keys', data).then(function () {
      router.push('/')
    })
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}

        <div className="field">
          <label className="label">Address</label>
          <div className="control">
            <input
              className="input"
              name="address"
              ref={register({ required: true })}
            />
            {/* errors will return when field validation fails  */}
            {errors.count && <span>This field is required</span>}{' '}
          </div>
        </div>
        <div className="field">
          <label className="label">Private Key</label>
          <div className="control">
            <input
              className="input"
              name="key"
              ref={register({ required: true })}
            />
            {/* errors will return when field validation fails  */}
            {errors.count && <span>This field is required</span>}{' '}
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button className="button">Submit</button>
          </div>
          <div className="control">
            <button
              onClick={() => router.push('/')}
              className="button is-link is-light"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
