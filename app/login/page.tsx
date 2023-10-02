import React from "react";
import AuthForm from "./components/AuthForm";
import StarsCanvas from "@/components/canvas/Stars";
import EarthCanvas from "@/components/canvas/Earth";

const page = () => {
  return (
    <div className=" bg-black h-screen flex justify-evenly relative z-0">
      
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
