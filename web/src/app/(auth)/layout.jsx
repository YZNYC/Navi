import { ThemeProvider } from "@/components/theme-provider";

export default function AuthLayout({ children }) {
  return (
    <html lang="pt-br" className="scroll-smooth" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
