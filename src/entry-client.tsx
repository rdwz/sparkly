import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './components/app'
// import './styles/index.css'

ReactDOM.hydrateRoot(
	document.getElementById('root') as HTMLElement,
	<BrowserRouter>
		<App />
	</BrowserRouter>,
)
