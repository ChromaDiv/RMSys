import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { DemoProvider } from '@/context/DemoContext';
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
          <LanguageProvider>
            <CurrencyProvider>
              <DemoProvider>
                <SidebarProvider>
                  <div className="flex min-h-screen bg-background text-foreground">
                    <Sidebar />
                    <MainContentWrapper>
                      {children}
                    </MainContentWrapper>
                    <FloatingChat />
                  </div>
                </SidebarProvider>
              </DemoProvider>
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
