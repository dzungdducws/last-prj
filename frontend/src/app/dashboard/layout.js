import "@/style/globals.css";
import DashboardPage from "./page";
export const metadata = {
  title: "Dashboard",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <DashboardPage />
      {children}
    </>
  );
}
