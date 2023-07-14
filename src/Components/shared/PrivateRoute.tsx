import React from 'react'
import { Redirect, Route } from 'react-router-dom'

// eslint-disable-next-line max-len
// It is important that you make sure you pass the component in the component prop and not in a render method or as nested child.
const PrivateRoute = ({ component: Component, isAuth, ...rest }: any) => (
  <Route
    {...rest}
    render={(props) => (isAuth
      ? <Component {...props} />
      : <Redirect to="/" />)}
  />
)

export default PrivateRoute