export const formatDate = (inputDate) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  const date = new Date(inputDate);

  const formatter = new Intl.DateTimeFormat('en-US', options);
  return formatter.format(date);
};
