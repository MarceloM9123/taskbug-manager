import '../styles/globals.css';
import { UserContext } from '../lib/context';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useUserData } from '../lib/hooks';
import { useState } from 'react';
import Modal from '../components/Modal';


function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const [ isOpen, setIsOpen ] = useState(false);


  return( 
    <>
      <UserContext.Provider value={userData} >
        <Navbar handleOpen={() => setIsOpen(true)}/>
        <Component {...pageProps} />
        <Toaster />
        <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen} />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
