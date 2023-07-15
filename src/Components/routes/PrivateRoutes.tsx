import { Switch } from 'react-router-dom'
import PrivateRoute from '../shared/PrivateRoute'
import { Dashboard } from '../Views/Dashboard'
import { getCredentials } from '../../utils/credentials.helper'

export const PrivateRoutes = () => {
  const IsLogged = getCredentials()
  return(
  <Switch>
    <PrivateRoute
      path="/dashboard"
      component={Dashboard}
      isAuth={IsLogged}
    />
  </Switch>

)
}
