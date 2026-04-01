import { sendEmails } from '../emails';

// 1. Mock the Resend SDK completely so we never fire real HTTP requests!
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => {
    return {
      emails: {
        send: jest.fn().mockResolvedValue({ id: 'mock_email_123' }),
      },
    };
  }),
}));

// 2. Mock the React Email HTML renderer (prevents complex DOM parsing during unit tests)
jest.mock('@react-email/render', () => ({
  render: jest.fn().mockResolvedValue('<p>Mocked HTML</p>'),
}));

// 3. Mock the raw React Component to bypass Next.js styling imports
jest.mock('@/components/email-template.jsx', () => {
  return function MockEmail() {
    return null;
  };
});

describe('sendEmails suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully send emails and return resolved settled array', async () => {
    const emailInfo = [
      {
        to: 'test@example.com',
        subject: 'Test Subject',
        message: 'Hello world!',
      },
    ];

    const response = await sendEmails(emailInfo);

    // Promise.allSettled always returns an array of { status, value/reason }
    expect(response).toBeDefined();
    expect(response[0].status).toBe('fulfilled');
    expect(response[0].value).toEqual({ id: 'mock_email_123' });
  });

  it('should return null if no emailInfo array is provided', async () => {
    const response = await sendEmails(null);
    expect(response).toBeNull();
  });

  it('should reject email items missing required fields', async () => {
    const emailInfo = [
      {
        to: 'broken@example.com',
        // Missing subject & message!
      },
    ];

    const response = await sendEmails(emailInfo);

    expect(response[0].status).toBe('rejected');
    expect(response[0].reason).toEqual(new Error('Could not send email.'));
  });
});
