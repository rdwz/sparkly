import { Route, Routes } from 'react-router-dom'
import { About } from './about'
import { Home } from './home'

export const Pages = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/about' element={<About />} />
    </Routes>
  )
}
