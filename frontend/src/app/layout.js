import "@/style/globals.css";
import Home from "./page";

export const metadata = {
  title: {
    template: "%s",
    default: "Home",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  metadataBase: new URL("https://next-learn-dashboard.vercel.sh"),
};

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="flex">
        <Home></Home>
        <main className="flex-grow bg-gray-100 h-screen overflow-y-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
