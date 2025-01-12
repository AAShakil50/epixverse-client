import { lazy, Suspense } from 'react'
import {
  BrowserRouter,
  Route,
  Routes
} from 'react-router-dom'
import LoadingComponent from './components/loading'
import HomePage from './pages/home'

const ProjectsPage = lazy(() => import('./pages/projects'))
const ProjectPage = lazy(() => import('./pages/project'))

function App() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <BrowserRouter>
        <Routes>
          <Route path='/'>
            <Route index element={<HomePage />} />
            <Route path='projects' element={<ProjectsPage />} />
            <Route path='project/:id' element={<ProjectPage />} />
            <Route path='*' element={<center className='text-4xl font-bold'>404 Not Found</center>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  )
}

export default App
