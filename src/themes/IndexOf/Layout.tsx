import { raw } from 'hono/html';
import Theme from '../Theme';

export default (async ({ c, children }) => {
	return (
		<>
			{children}
			<style>{raw(c.var.config.extra_css)}</style>
			<script>{raw(c.var.config.extra_js)}</script>
		</>
	);
}) as Theme['Layout'];
