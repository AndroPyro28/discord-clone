import getCurrentUser from "@/actions/getCurrentUser";
import getServers from "@/actions/getServers";
import prismaDB from "@/lib/db";

const NavigationSidebar = async () => {
  // const servers = await getServers();

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22]">
      
    </div>
  );
};

export default NavigationSidebar;
