import Theme from '../Theme';

export default (async ({ c, page }) => {
	return (
		<>
			<title>
				第 {page} 页 | {c.var.config.site_name}
			</title>
		</>
	);
}) as Theme['Main'];
