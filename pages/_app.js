import '../styles/globals.css';
import { ProjectContext, UserContext } from '../lib/context';
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import { useProjectData, useUserData } from '../lib/hooks';
import { useState } from 'react';
import Modal from '../components/Modal';


function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  const projectNames = useProjectData();
  
  const [ isOpen, setIsOpen ] = useState(false);
  const [ selectedProject, setSelectedProject ] = useState('');
  const projectData = { projectNames, selectedProject }

  return( 
    <>
      <UserContext.Provider value={userData} >
      <ProjectContext.Provider value={projectData} >
        <Navbar 
          handleOpen={() => setIsOpen(true)} 
          handleSelectedProject={(projectName) => setSelectedProject(projectName)}/>
        <Component {...pageProps} />
        <Toaster />
        <Modal handleClose={() => setIsOpen(false)} isOpen={isOpen} />
      </ProjectContext.Provider>
      </UserContext.Provider>
    </>
  )
}

export default MyApp
