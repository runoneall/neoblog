import Theme from '../Theme';

export default (async ({ c }) => {
	return (
		<>
			<title>未找到 | {c.var.config.site_name}</title>
			<img class="w-full h-auto" src="https://http.cat/404.jpg" />
		</>
	);
}) as Theme['NotFound'];
