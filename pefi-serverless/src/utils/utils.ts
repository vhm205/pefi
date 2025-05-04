export const getDateNow = (): string => {
	const now = new Date();
	return now.toISOString().split('T')[0];
};