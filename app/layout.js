import { auth } from '@/auth';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthSessionProvider } from '@/providers/session-provider';
import { dbConnect } from '@/service/mongo';
import { Open_Sans, Ubuntu } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import './globals.css';

export const metadata = {
  title: 'Reactive Learn | Create, Learn, Share',
  description: 'Create || Learn || Share',
};

const ubuntu = Ubuntu({
  subsets: ['latin'],
  variable: '--font-ubuntu',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export default async function RootLayout({ children }) {
  await dbConnect();
  const session = await auth();
  return (
    <html lang='en' className='scrollbar-thin scrollbar-thumb-secondary scrollbar-track-gray-100' suppressHydrationWarning>
      <body className={`${openSans.className} ${ubuntu.variable} ${openSans.variable} font-sans`}>
        <NextTopLoader color='#10b981' showSpinner={false} height={3} />
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <AuthSessionProvider session={session}>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthSessionProvider>
          <Toaster richColors position='top-center' />
        </ThemeProvider>
      </body>
    </html>
  );
}
