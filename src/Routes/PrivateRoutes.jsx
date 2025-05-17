import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthContext } from '../Provider/AuthProvider'
import UniversalLoading from '../Component/UniversalLoadin/UniversalLoadin'

const PrivateRoutes = ({children}) => {
    const {user,loading}=useContext(AuthContext)

if(loading){
    <UniversalLoading/>
}
    if (user){
        return children
    }
  return (
<Navigate to={"/login"}></Navigate>
  )
}

export default PrivateRoutes
