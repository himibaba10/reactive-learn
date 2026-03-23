const EmailTemplate = ({ message }) => {
  return <div dangerouslySetInnerHTML={{ __html: message }} />;
};

export default EmailTemplate;
