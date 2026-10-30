import { raw } from 'hono/html';
import Theme from '../Theme';
import { PageTable } from '../../page';
import { eq } from 'drizzle-orm';

export default (async ({ c, children }) => {
	const pages = await c.var.db
		.select({
			name: PageTable.name,
			title: PageTable.title,
		})
		.from(PageTable)
		.where(eq(PageTable.type, 'page'));

	return (
		<>
			<div class="m-2 break-all wrap-break-word text-justify font-mono">
				<a class="text-blue-600 underline" href="/">
					{c.var.config.site_name}
				</a>
				<span>.</span>
				<hr class="my-2" />
				{pages.map((page) => (
					<>
						<a class="text-blue-600 underline" href={`/page/${page.name}`}>
							{page.title}
						</a>
						<span> </span>
					</>
				))}
				<hr class="my-2" />
				{children}
			</div>
			<style>{raw(c.var.config.extra_css)}</style>
			<script>{raw(c.var.config.extra_js)}</script>
		</>
	);
}) as Theme['Layout'];
