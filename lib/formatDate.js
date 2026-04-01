export const formatDate = (inputDate) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(inputDate);

  if (isNaN(date.getTime())) {
    throw new Error(`"${inputDate}" is not a valid date.`);
  }

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
};
