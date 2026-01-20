import "./globals.css";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-[#F4F6FA] h-full overflow-hidden">
        <main className="h-full w-full overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
