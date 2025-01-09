import React from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();
  console.log(location.state);

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-72 bg-red-300">
        <header className="flex justify-end p-2 px-4 w-full bg-slate-300">
          <button className="p-2">
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversion-area flex-grow flex flex-col ">
          <div className="message-box flex-grow flex flex-col gap-1 p-1">
            <div className="message max-w-56 flex flex-col gap-1 p-2 bg-slate-200 w-fit rounded-md">
              <small
              className="text-xs opacity-65"
              >example@.com</small>
              <p className="text-sm">hello</p>
            </div>
            <div className="ml-auto message max-w-56 flex flex-col gap-1 p-2 bg-slate-200 w-fit rounded-md">
              <small
              className="text-xs opacity-65"
              >example@.com</small>
              <p className="text-sm">hello</p>
            </div>
          </div>
          <div className="inputfeild w-full flex">
            <input
              type="text"
              className="p-2 px-4 border-none outline-none"
              placeholder="Enter message..."
            />
            <button
            className="flex-grow p-2"
            ><i className="ri-send-plane-fill"></i></button>
          </div>
        </div>

        <div className="sidePanel w-36 h-60 bg-red-800 absolute left-[-100%] top-0"></div>

      </section>
    </main>
  );
};

export default Project;
