import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const Project = () => {
  const location = useLocation();
  const { state } = location;
  const { project } = state || {}; // Destructure project from state

  console.log(project);

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);

  const handleUserClick = (userId) => {
    setSelectedUserId([...selectedUserId, userId]);
  };

  // Dummy data for users
  const dummyUsers = [
    "user1@example.com",
    "user2@example.com",
    "user3@example.com",
    "user4@example.com",
    "user5@example.com",
    "user6@example.com",
    "user7@example.com",
    "user8@example.com",
    "user9@example.com",
    "user10@example.com",
  ];

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-400">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-300">
          <button
            className="flex gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <i className="ri-add-fill mr-1 "></i>
            <p>Add Collaborators</p>
          </button>
          <button
            className="p-2"
            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
          >
            <i className="ri-group-fill"></i>
          </button>
        </header>

        <div className="conversion-area flex-grow flex flex-col">
          <div className="message-box flex-grow flex flex-col gap-1 p-1">
            <div className="message max-w-56 flex flex-col gap-1 p-2 bg-slate-200 w-fit rounded-md">
              <small className="text-xs opacity-65">example@.com</small>
              <p className="text-sm">hello</p>
            </div>
            <div className="ml-auto message max-w-56 flex flex-col gap-1 p-2 bg-slate-200 w-fit rounded-md">
              <small className="text-xs opacity-65">example@.com</small>
              <p className="text-sm">hello</p>
            </div>
          </div>
          <div className="inputfeild w-full flex">
            <input
              type="text"
              className="p-2 px-4 border-none outline-none flex-grow"
              placeholder="Enter message..."
            />
            <button className="px-5 bg-slate-500 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-200 absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
          <header className="flex justify-end p-2 px-3 bg-slate-300">
            <button
              className="p-2"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            <div className="user flex gap-2 items-center cursor-pointer hover:bg-slate-300 p-2">
              <div className="aspect-square bg-slate-300 p-5 text-black w-fit h-fit flex items-center justify-center rounded-full">
                <i className="ri-user-fill absolute"></i>
              </div>
              <h1 className="font-semibold text-lg">UserName</h1>
            </div>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className='flex justify-between items-center mb-4'>
              <h2 className='text-xl font-semibold'>Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className='p-2'>
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {dummyUsers.map((user, index) => (
                <div
                  key={index}
                  className={`user cursor-pointer hover:bg-slate-200 ${selectedUserId.includes(user) ? 'bg-slate-200' : ''} p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className='font-semibold text-lg'>{user}</h1>
                </div>
              ))}
            </div>
            <button
              className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'
              onClick={() => setIsModalOpen(false)}
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Project;