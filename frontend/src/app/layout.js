import "@/style/globals.css";
import Sidebar from "@/components/sidebar/Sidebar";
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
        <Sidebar />
        <main className="flex-grow bg-gray-100 h-screen overflow-y-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
