import '../styles/globals.css';
import { UserContext } from '../lib/context';


function MyApp({ Component, pageProps }) {
  return( 
    <>
      <UserContext.Provider >
        <Component {...pageProps} />
      </UserContext.Provider>
    </>
  )
}

export default MyApp
