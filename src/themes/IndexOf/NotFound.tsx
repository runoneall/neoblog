import Theme from '../Theme';

export default (async ({ c }) => {
	return (
		<>
			<title>未找到 | {c.var.config.site_name}</title>
		</>
	);
}) as Theme['NotFound'];
