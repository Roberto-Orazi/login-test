import { PublicRoutes } from './PublicRoutes'
import { PrivateRoutes } from './PrivateRoutes'

export const AppNavigation = () => (
  <>
    <PublicRoutes />
    <PrivateRoutes />
  </>
)