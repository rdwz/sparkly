import { Route, Routes } from 'react-router-dom'
import { About } from './about'
import { Home } from './home'
import { NotFound } from './not-found'

export const Pages = () => {
	return (
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/about' element={<About />} />
			<Route path='/not-found' element={<NotFound />} />
		</Routes>
	)
}
