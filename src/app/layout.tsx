"use client"
import Navbar from "@/client/components/Navbar";

import { Provider } from "react-redux";
import { makeStore } from "@/lib/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const store = makeStore();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <Navbar />
          {children}
        </Provider>
      </body>
    </html>
  );
}
