import { Switch, Route } from 'react-router-dom'
import { Login } from '../Views/Login'

const BasicNavigation = () => (
  <Switch>
    <Route exact path="/">
      <Login />
    </Route>
  </Switch>
)

export default BasicNavigation