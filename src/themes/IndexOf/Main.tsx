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
			<div class="overflow-x-auto scrollbar-thin">
				<ul class="list-disc ml-4 text-nowrap">
					{posts_in_page.map((post) => (
						<li>
							<a class="text-xl font-bold text-blue-900 hover:text-blue-600 underline" href={`/post/${post.name}`}>
								{post.title}
							</a>
						</li>
					))}
				</ul>
			</div>
			<hr class="my-2" />
			<div class="flex items-center overflow-x-auto scrollbar-thin text-nowrap gap-x-2 font-bold">
				<span>
					第 {page}/{total_page} 页
				</span>
				{page == 1 ? (
					<span>上一页</span>
				) : (
					<a class="underline text-blue-800 hover:text-blue-600" href={`/pages/${page - 1}`}>
						上一页
					</a>
				)}
				{page == total_page ? (
					<span>下一页</span>
				) : (
					<a class="underline text-blue-800 hover:text-blue-600" href={`/pages/${page + 1}`}>
						下一页
					</a>
				)}
				{Array.from({ length: total_page }, (_, i) => {
					i += 1;

					return (
						<a class="underline text-blue-800 hover:text-blue-600" href={`/pages/${total_page}`}>
							第 {i} 页
						</a>
					);
				})}
			</div>
		</>
	);
}) as Theme['Main'];
