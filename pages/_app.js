import '../styles/globals.css';
import { UserContext } from '../lib/context';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/navbar';


function MyApp({ Component, pageProps }) {
  return( 
    <>
      <UserContext.Provider >
        <NavBar />
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
