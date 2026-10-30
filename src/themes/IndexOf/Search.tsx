import Theme from '../Theme';

export default (async ({ c, query }) => {
	return (
		<>
			<title>
				搜索 {query} | {c.var.config.site_name}
			</title>
		</>
	);
}) as Theme['Search'];
