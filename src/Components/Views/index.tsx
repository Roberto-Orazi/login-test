import { Switch, Route } from 'react-router-dom'
import { Login } from './Login'
import { Dashboard } from './Dashboard'
import { Layout } from '../layouts/Layout'

export const Routes = () => {
  return (
    <Layout>
      <Switch>
        <Route
        path={'/login'}
        exact
        component={Login}
        />
        <Route
        path={'/dashboard'}
        exact
        component={Dashboard}
        />
      </Switch>
    </Layout>
  )
}