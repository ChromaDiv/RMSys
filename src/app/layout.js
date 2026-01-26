import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { SidebarProvider } from '@/context/SidebarContext';
import MainContentWrapper from '@/components/MainContentWrapper';
import FloatingChat from '@/components/FloatingChat';
import './globals.css';

export const metadata = {
  title: 'Restaurant management system (RMSys)',
  description: 'AI-Powered enterprise restaurant management and supply chain intelligence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-background text-foreground">
              <Sidebar />
              <MainContentWrapper>
                {children}
              </MainContentWrapper>
              <FloatingChat />
            </div>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
