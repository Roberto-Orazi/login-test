import { Switch } from 'react-router-dom'
import PrivateRoute from '../shared/PrivateRoute'
import { Dashboard } from '../Views/Dashboard'

export const PrivateRoutes = () => (
  <Switch>
    <PrivateRoute
      path="/dashboard"
      component={Dashboard}
      isAuth
    />
  </Switch>
)