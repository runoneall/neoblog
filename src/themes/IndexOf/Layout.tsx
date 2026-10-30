import Theme from '../Theme';

export default (async ({ c, children }) => {
	return children;
}) as Theme['Layout'];
