import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { appRoutes } from '@/utils/appRoutes'

function App() {
  const element = useRoutes(appRoutes)

  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return element
}

export default App
