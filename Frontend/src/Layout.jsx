import Header from './components/Header/Header.jsx'
import { Outlet } from 'react-router-dom'

//Shared layout for routes that need the header
function Layout(){
    return(
        <>
                <Header />
                <Outlet />
        </>
    )
}

export default Layout