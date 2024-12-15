import "@/style/globals.css";
import RoomDetailPage from "./page";
export const metadata = {
  title: "RoomDetailPage",
};

export default async function RoomDetailLayout({ params, me }) {
  const _params = await params;

  return (
    <>
      <RoomDetailPage params={_params} />
    </>
  );
}
