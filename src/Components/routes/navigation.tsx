import BasicNavigation from './PublicRoutes'
import { PrivateRoutes } from './PrivateRoutes'

export const AppNavigation = () => (
  <>
    <BasicNavigation />
    <PrivateRoutes />
  </>
)