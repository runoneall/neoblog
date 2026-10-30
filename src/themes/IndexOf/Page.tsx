import { eq } from 'drizzle-orm';
import { PageTable } from '../../page';
import Theme from '../Theme';
import NotFound from './NotFound';

export default (async ({ c, name }) => {
	const result = await c.var.db
		.select({
			type: PageTable.type,
			title: PageTable.title,
			content: PageTable.content,
		})
		.from(PageTable)
		.where(eq(PageTable.name, name))
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
