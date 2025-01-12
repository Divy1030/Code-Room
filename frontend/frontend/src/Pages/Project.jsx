import React, { useState, useEffect, useContext, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "../config/axios";
import { intializeSocket, receiceMessage, sendMessage } from "../config/socket";
import { UserContext } from '../context/user.context.jsx';

const Project = () => {
  const location = useLocation();
  const { state } = location;
  const { project } = state || {};

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set());
  const [users, setUsers] = useState([]);
  const [projectData, setProjectData] = useState(project);
  const [message, setMessage] = useState('');
  const { user } = useContext(UserContext);
  const messageBox = useRef(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: projectData._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function send() {
    if (!user || !user.user || !user.user._id) {
      console.error("User ID is undefined");
      return;
    }

    const messageObject = {
      message,
      sender: user.user.email,
    };

    sendMessage("project-message", messageObject);
    console.log("User ID:", user.user._id);
    appendOutgoingMessage(messageObject);
    setMessage('');
  }

  useEffect(() => {
    intializeSocket(project._id);

    const handleMessage = (data) => {
      console.log("Received message:", data);
      appendIncomingMessage(data);
    };

    receiceMessage("project-message", handleMessage);

    if (project._id) {
      axios
        .get(`/projects/get-project/${project._id}`)
        .then((res) => {
          setProjectData(res.data.project);
        })
        .catch((err) => {
          console.log(err);
        });

      axios
        .get("/users/all-user")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    } else {
      console.error("Project ID is undefined");
    }

    // Cleanup function to remove the event listener
    return () => {
      // Properly remove the event listener
      socket.off("project-message", handleMessage);
    };
  }, [project._id]);

  function appendIncomingMessage(messageObject) {
    if (messageBox.current) {
      const senderText = messageObject.sender === user.user.email ? "ME" : messageObject.sender;
      const message = document.createElement("div");
      message.classList.add("message", "max-w-56", "flex", "flex-col", "gap-1", "p-2", "bg-slate-200", "w-fit", "rounded-md");
      message.innerHTML = `
        <small class="text-xs opacity-65">${senderText}</small>
        <p class="text-sm">${messageObject.message}</p>
      `;
      messageBox.current.appendChild(message);
      scrollToBottom();
    } else {
      console.error("messageBox ref is not assigned");
    }
  }

  function appendOutgoingMessage(messageObject) {
    if (messageBox.current) {
      const senderText = messageObject.sender === user.user.email ? "ME" : messageObject.sender;
      const message = document.createElement("div");
      message.classList.add("ml-auto", "message", "max-w-56", "flex", "flex-col", "gap-1", "p-2", "bg-slate-200", "w-fit", "rounded-md");
      message.innerHTML = `
        <small class="text-xs opacity-65">${senderText}</small>
        <p class="text-sm">${messageObject.message}</p>
      `;
      messageBox.current.appendChild(message);
      scrollToBottom();
    } else {
      console.error("messageBox ref is not assigned");
    }
  }

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  return (
    <main className="h-screen w-screen flex">
      <section className="left relative flex flex-col h-full min-w-96 bg-slate-400">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-300 absolute top-0">
          <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
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

        <div className="conversion-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
          <div 
          ref={messageBox}
          className="message-box flex-grow flex flex-col gap-1 p-1 overflow-auto max-h-full">
          </div>
          <div className="inputfeild w-full flex absolute bottom-0">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              className="p-2 px-4 border-none outline-none flex-grow"
              placeholder="Enter message..."
            />
            <button onClick={send} className="px-5 bg-slate-500 text-white">
              <i className="ri-send-plane-fill"></i>
            </button>
          </div>
        </div>

        <div
          className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-200 absolute transition-all ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0`}
        >
          <header className="flex justify-end p-2 px-3 bg-slate-300">
            <button
              className="p-2"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-2">
            {projectData.users &&
              projectData.users.map((user) => (
                <div
                  key={user._id}
                  className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center"
                >
                  <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg text-black">
                    {user.email}
                  </h1>
                </div>
              ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select User</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2">
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user) => (
                <div
                  key={user._id}
                  className={`user cursor-pointer hover:bg-slate-200 ${
                    selectedUserId.has(user._id) ? "bg-slate-200" : ""
                  } p-2 flex gap-2 items-center`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold text-lg">{user.email}</h1>
                </div>
              ))}
            </div>
            <button
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={addCollaborators}
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