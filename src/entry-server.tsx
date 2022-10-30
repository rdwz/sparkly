import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { App } from './components/app.jsx'

export function render(url: string) {
	return ReactDOMServer.renderToString(
		<StaticRouter location={url}>
			<App />
		</StaticRouter>,
	)
}
