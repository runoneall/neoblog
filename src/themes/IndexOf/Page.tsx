import { and, eq } from 'drizzle-orm';
import { PageTable } from '../../page';
import Theme from '../Theme';
import NotFound from './NotFound';
import { createHtmlRenderer } from '@comark/html';
import { raw } from 'hono/html';

export default (async ({ c, name, type }) => {
	const result = await c.var.db
		.select({
			title: PageTable.title,
			content: PageTable.content,
		})
		.from(PageTable)
		.where(and(eq(PageTable.name, name), eq(PageTable.type, type)))
		.get();

	if (!result) return NotFound({ c });

	const renderHtml = createHtmlRenderer({
		components: {
			a: async ([, attrs, ...children], { render }) => {
				return `<a href="${attrs.href}" target="_blank" rel="noopener">${await render(children)}</a>`;
			},
		},
	});

	return (
		<>
			<title>
				{result.title} | {c.var.config.site_name}
			</title>
			<a class="font-extrabold underline text-blue-800 text-4xl" href={`/${type}/${name}`}>
				{result.title}
			</a>
			<div class="prose mt-4 max-w-none">{raw(await renderHtml(result.content))}</div>
		</>
	);
}) as Theme['Page'];
