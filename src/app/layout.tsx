import Navbar from "@/client/components/Navbar";
import StoreProvider from "./StoreProvider";
import { ChatProvider } from "@/client/components/chatProvider";


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
          <ChatProvider api="/api/gemini">{children}</ChatProvider>
        </StoreProvider>
      </body>
    </html>
  );
}