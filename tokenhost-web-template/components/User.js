import { fetchDocumentFromCollectionByFieldName } from '../lib/utility'
import React, { Component, useEffect, useState } from 'react'

export default (props) => {
  const address = props.sender
  const key = props.key
  const [user, setUser] = useState({})
  useEffect(
    function () {
      fetchDocumentFromCollectionByFieldName({
        collectionName: 'users',
        fieldName: 'address',
        value: address,
      }).then((result) => {
        setUser(result)
      })
    },
    [props.key],
  )

  if (!user) {
    return <section className="hero is-primary mb-6"></section>
  } else {
    return (
      <section className="hero is-primary mb-6">
        <img width={50} src={user.photo} className="p-2" />
        <h6 className=" p-2 title is-6">{user.name}</h6>
      </section>
    )
  }
}
