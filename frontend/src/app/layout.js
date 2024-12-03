import "@/style/globals.css";
import Sidebar from "@/components/Sidebar";
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
        <main className="flex-grow p-4 bg-gray-100 h-screen overflow-scroll">{children}</main>
      </body>
    </html>
  );
}
