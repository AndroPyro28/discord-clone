import React, { useEffect } from "react";
import AuthForm from "./components/AuthForm";
import StarsCanvas from "@/components/canvas/Stars";
import EarthCanvas from "@/components/canvas/Earth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type IProps = {
  searchParams?:{
    [key:string]: string | string[] | undefined
  }
}
const page = ({searchParams}: IProps) => {

  return (
    <div className="bg-black h-screen flex justify-evenly relative z-0">
      
       <div className="flex-1 self-center flex justify-center">
        <AuthForm />
      </div>

      <div className="relative z-0 flex-1 flex justify-start">
        <EarthCanvas />
      </div>

      <StarsCanvas />
    </div>
  );
};

export default page;
