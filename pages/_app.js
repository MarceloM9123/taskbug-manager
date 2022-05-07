import '../styles/globals.css';
import { UserContext } from '../lib/context';
import { Toaster } from 'react-hot-toast';


function MyApp({ Component, pageProps }) {
  return( 
    <>
      <UserContext.Provider >
        <Component {...pageProps} />
        <Toaster />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
