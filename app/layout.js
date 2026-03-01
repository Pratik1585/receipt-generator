export const metadata = {
  title: "Payment Receipt Generator",
  description: "Professional Receipt Generator"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-gradient-to-br from-slate-100 to-slate-200 min-h-screen">
        {children}
      </body>
    </html>
  );
}