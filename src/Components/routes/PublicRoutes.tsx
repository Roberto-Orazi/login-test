import { Switch, Route } from 'react-router-dom'
import { Login } from '../Views/Login'

const PublicNavigation = () => (
  <Switch>
    <Route exact path="/">
      <Login />
    </Route>
  </Switch>
)

export default PublicNavigation