import { Switch } from 'react-router-dom'
import PrivateRoute from '../shared/PrivateRoute'
import { Dashboard } from '../Views/Dashboard'
import { getCredentials } from '../../utils/credentials.helper'
import { AddUser } from '../Views/AddUser'
import { EditUser } from '../Views/EditUser'

export const PrivateRoutes = () => {
  const IsLogged = getCredentials()
  return(
  <Switch>
    <PrivateRoute
      path="/dashboard"
      component={Dashboard}
      isAuth={IsLogged}
    />
    <PrivateRoute
      path="/adduser"
      component={AddUser}
      isAuth={IsLogged}
    />
    <PrivateRoute
      path="/edituser/:id"
      component={EditUser}
      isAuth={IsLogged}
    />
  </Switch>

)
}
