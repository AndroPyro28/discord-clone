import getServers from "@/actions/getServers";
import NavigationAction from "./NavigationAction";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./NavigationItem";
import { ModeToggle } from "../ModeToggle";
import LogoutButton from "../LogoutButton";
const NavigationSidebar = async () => {
  const servers = await getServers();

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
      <ScrollArea className="flex-1 w-full">
      {
        servers.map((server) =>{
          return<div key={server.id} className="mb-4">
            <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
          </div>
        })
      }
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
      <ModeToggle/>
      <LogoutButton />
      </div>
    </div>
  );
};

export default NavigationSidebar;
