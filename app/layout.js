import { auth } from '@/auth';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthSessionProvider } from '@/providers/session-provider';
import { dbConnect } from '@/service/mongo';
import { Poppins } from 'next/font/google';
import './globals.css';

export const metadata = {
  title: 'Reactive Learn | Create, Learn, Share',
  description: 'Create || Learn || Share',
};

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default async function RootLayout({ children }) {
  await dbConnect();
  const session = await auth();
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <AuthSessionProvider session={session}>
          <TooltipProvider>{children}</TooltipProvider>
        </AuthSessionProvider>
        <Toaster richColors position='top-center' />
      </body>
    </html>
  );
}
