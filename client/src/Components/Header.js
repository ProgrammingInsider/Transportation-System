import {useState} from 'react'
import useLogout from '../Hooks/useLogout';
import { FaBarsStaggered } from "react-icons/fa6";
import { RiAccountCircleFill } from "react-icons/ri";
import { useNavigate } from 'react-router';
import { useGlobalContext } from '../contextAPI';


const Header = () => {
    const navigate = useNavigate();
    const logout = useLogout();
    const {hideSideBar,toggleSideBar} = useGlobalContext();
    const [showLogout, setShowLogout] = useState(false)
  
    const signOut = async() => {
      await logout();

      navigate('/login');      
    }
  
    return <>
        <div className='header'>
          <div className='leftHeader'>
              <article className='bar' onClick={()=>toggleSideBar(!hideSideBar)}><FaBarsStaggered /></article>
          </div>
  
          <div className='rightHeader'>
              <article className='account' onClick={()=>setShowLogout(!showLogout)}>
                <RiAccountCircleFill />
                {showLogout && (<span className='Logout' onClick={signOut}>Logout</span>)}
              </article>
              <article className='time'>
              </article>
  
          </div>
  
  
        </div>
    </>
}

export default Header