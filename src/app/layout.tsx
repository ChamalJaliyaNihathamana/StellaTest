import Navbar from "@/client/components/Navbar";
import StoreProvider from "./StoreProvider";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <StoreProvider> {/* Use your custom StoreProvider */}
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}