import { like, or } from 'drizzle-orm';
import { PageTable } from '../../page';
import Theme from '../Theme';
import NotFound from './NotFound';

export default (async ({ c, query }) => {
	const escape = (term: string) => term.replace(/[%_]/g, '\\$&');
	const results = await c.var.db
		.select({
			name: PageTable.name,
			type: PageTable.type,
			title: PageTable.title,
		})
		.from(PageTable)
		.where(or(like(PageTable.title, `%${escape(query)}%`), like(PageTable.content, `%${escape(query)}%`)))
		.limit(c.var.config.post_per_page * (Number(c.var.theme.magnification) || 2));

	if (results.length == 0) return NotFound({ c });

	return (
		<>
			<title>
				搜索 {query} | {c.var.config.site_name}
			</title>
			<ul class="ml-4 list-disc">
				{results.map((result) => (
					<li>
						<a class="text-blue-600 underline" href={`/${result.type}/${result.name}`}>
							{result.title}
						</a>
					</li>
				))}
			</ul>
		</>
	);
}) as Theme['Search'];
