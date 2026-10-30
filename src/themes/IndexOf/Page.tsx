import { and, eq } from 'drizzle-orm';
import { PageTable } from '../../page';
import Theme from '../Theme';
import NotFound from './NotFound';

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

	return (
		<>
			<title>
				{result.title} | {c.var.config.site_name}
			</title>
		</>
	);
}) as Theme['Page'];
