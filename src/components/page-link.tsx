import { Link as RouterLink, LinkProps } from 'react-router-dom'

interface PageLinkProps extends LinkProps {
	children: React.ReactNode
	className?: string
}

export const PageLink = (props: PageLinkProps) => {
	const className = props.className ?? ''

	return (
		<RouterLink
			to={props.to}
			className={`link no-underline hover:underline ${className}`}
		>
			{props.children}
		</RouterLink>
	)
}
