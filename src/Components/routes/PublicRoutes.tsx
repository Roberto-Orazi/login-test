import { Switch, Route } from 'react-router-dom'
import { Login } from '../Views/Login'

export const PublicRoutes = () => (
  <Switch>
    <Route exact path="/">
      <Login />
    </Route>
  </Switch>
)

