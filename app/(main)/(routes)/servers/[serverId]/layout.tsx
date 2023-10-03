import getCurrentUser from "@/actions/getCurrentUser"
import getServerById from "@/actions/getServerById"
import ServerSidebar from "@/components/server/ServerSidebar";

export default async function RootLayout({
    children,
    params: {serverId}
  }: {
    children: React.ReactNode,
    params: {serverId: string}
  }) {

    const server = await getServerById(serverId);

    return (
        <div className="h-full">
          <div className="invisible md:visible md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
            <ServerSidebar serverId={serverId} />
          </div>
          <main className="h-full md:pl-60">
          {children}
          </main>
          </div>
    )
  }
  