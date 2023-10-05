import { Switch } from 'react-router-dom'
import PrivateRoute from '../shared/PrivateRoute'
import { Dashboard } from '../Views/Dashboard'
import { getCredentials } from '../../utils/credentials.helper'
import { AddUser } from '../Views/AddUser'
import { EditUser } from '../Views/EditUser'
import { ELinks } from '../navigation/navigation.types'

export const PrivateRoutes = () => {
  const IsLogged = getCredentials()
  return(
  <Switch>
    <PrivateRoute
      path= {ELinks.dashboard}
      component={Dashboard}
      isAuth={IsLogged}
    />
    <PrivateRoute
      path= {ELinks.addUser}
      component={AddUser}
      isAuth={IsLogged}
    />
    <PrivateRoute
      path={`${ELinks.editUser}/:id`}
      component={EditUser}
      isAuth={IsLogged}
    />
  </Switch>

)
}
