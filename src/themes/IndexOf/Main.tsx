import { eq, sql } from 'drizzle-orm';
import { PageTable } from '../../page';
import Theme from '../Theme';
import NotFound from './NotFound';

export default (async ({ c, page }) => {
	const post_per_page = c.var.config.post_per_page * (Number(c.var.theme.magnification) || 2);
	const total_page = Math.ceil((await c.var.db.$count(PageTable, eq(PageTable.type, 'post'))) / post_per_page);
	const posts_in_page = await c.var.db
		.select({
			name: PageTable.name,
			title: PageTable.title,
		})
		.from(PageTable)
		.where(eq(PageTable.type, 'post'))
		.orderBy(sql`rowid DESC`)
		.offset((page - 1) * post_per_page)
		.limit(post_per_page);

	if (posts_in_page.length == 0) return NotFound({ c });

	return (
		<>
			<title>
				第 {page} 页 | {c.var.config.site_name}
			</title>
			<ul class="ml-4 list-disc">
				{posts_in_page.map((post) => (
					<li>
						<a class="text-blue-600 underline" href={`/post/${post.name}`}>
							{post.title}
						</a>
					</li>
				))}
			</ul>
			<hr class="my-2" />
			<span>
				第 {page}/{total_page} 页
			</span>
			<span> </span>
			{page == 1 ? (
				<span>上一页</span>
			) : (
				<a class="text-blue-600 underline" href={`/pages/${page - 1}`}>
					上一页
				</a>
			)}
			<span> </span>
			{page == total_page ? (
				<span>下一页</span>
			) : (
				<a class="text-blue-600 underline" href={`/pages/${page + 1}`}>
					下一页
				</a>
			)}
			<span> </span>
			{Array.from({ length: total_page }, (_, i) => (
				<>
					<a class="text-blue-600 underline" href={`/pages/${i + 1}`}>
						第 {i + 1} 页
					</a>
					<span> </span>
				</>
			))}
		</>
	);
}) as Theme['Main'];
