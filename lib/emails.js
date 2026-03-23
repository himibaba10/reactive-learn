import EmailTemplate from '@/components/email-template.jsx';
import { render } from '@react-email/render';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmails = async (emailInfo) => {
  if (!emailInfo) return null;

  const response = await Promise.allSettled(
    emailInfo.map(async ({ to, subject, message }) => {
      if (to && subject && message) {
        const emailHtml = await render(<EmailTemplate message={message} />);

        return await resend.emails.send({
          from: 'contact@reactiveferdous.com',
          to: [to],
          subject,
          html: emailHtml,
        });
      } else {
        return Promise.reject(new Error('Could not send email.'));
      }
    }),
  );

  return response;
};
