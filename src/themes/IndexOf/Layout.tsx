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
			<div class="m-4 font-mono">
				<div class="flex items-center overflow-y-auto text-nowrap gap-x-2 scrollbar-thin">
					<a class="text-black underline font-bold" href="/">
						{c.var.config.site_name}
					</a>
					{pages.map((page) => (
						<a class="text-blue-800 underline font-bold hover:text-blue-400" href={`/page/${page.name}`}>
							{page.title}
						</a>
					))}
				</div>
				<hr class="my-2" />
				{children}
			</div>
			<style>{raw(c.var.config.extra_css)}</style>
			<script>{raw(c.var.config.extra_js)}</script>
		</>
	);
}) as Theme['Layout'];
