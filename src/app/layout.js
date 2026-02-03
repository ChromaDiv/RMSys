import Sidebar from '@/components/Sidebar';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { SidebarProvider } from '@/context/SidebarContext';
import { DemoProvider } from '@/context/DemoContext';
import MainContentWrapper from '@/components/MainContentWrapper';
import FloatingChat from '@/components/FloatingChat';
import SessionWrapper from '@/components/SessionWrapper';
import './globals.css';

export const metadata = {
  title: 'Restaurant management system (RMSys)',
  description: 'AI-Powered enterprise restaurant management and supply chain intelligence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedMode = localStorage.getItem('themeMode');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  
                  let isDark;
                  if (savedMode === 'dark') {
                    isDark = true;
                  } else if (savedMode === 'light') {
                    isDark = false;
                  } else {
                    isDark = systemDark;
                  }
                  
                  if (isDark) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        <SessionWrapper>
          <ThemeProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <DemoProvider>
                  <SidebarProvider>
                    <div className="flex min-h-screen text-foreground">
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
        </SessionWrapper>
      </body>
    </html>
  );
}
