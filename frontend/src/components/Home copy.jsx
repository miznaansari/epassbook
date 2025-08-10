import React, { useEffect } from "react";
import AllStats from "./home/AllStats";
import ViewTxn from "./home/ViewTxn";
import { useNavigate } from "react-router";
import Allbutton from "./home/Allbutton";

const Home = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth"); // No token → go to auth page
    } else {
      navigate("/"); // Token exists → stay on home page
    }
  }, [navigate]);   
  return (
    <>
    <div
      className=" text-white"
      style={{
        background: "radial-gradient(circle at center, #2d1e48, #0f0f1a) h-[100%]",
      }}
    >
      <div className="flex flex-col md:flex-row ">
      {/* Left: Landing Intro */}
      <div className="flex flex-col justify-center items-start p-2 md:p-20 mt-20 md:w-1/2">
        <h1 className="text-4xl font-bold mb-4">Welcome to MyExpensePro</h1>
        {/* <p className="text-lg leading-relaxed text-gray-300 max-w-lg">
          Take full control of your finances with our intuitive expense
          management system. Track your total salary received, monitor where
          every rupee goes, submit SIP details, and keep an eye on all your
          spending — all in one place.
        </p> */}
        <div className="py-10 w-[100%]">
            <AllStats />
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-xl">✔</span>
            <span>Track monthly income & salary credits</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-xl">✔</span>
            <span>Analyze your spending patterns</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-xl">✔</span>
            <span>Submit & track SIP contributions</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-green-400 text-xl">✔</span>
            <span>Get a complete financial overview</span>
          </div>
        </div>
      </div>

      {/* Right: Stats + Chart */}
      <div className="flex flex-col md:w-1/2 items-center justify-center p-8 space-y-8">
        <ViewTxn />
      </div>
</div>
      <Allbutton />

    </div>
</>
  );
};

export default Home;
