import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import {useNavigate} from 'react-router-dom';

const Home = () => {
  const { user } = useContext(UserContext);
  const [isModalOpen, setisModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [errors, setErrors] = useState({});
  const [project, setproject] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/projects/all")
     .then((response) => {
        console.log("Projects fetched:", response.data);
        setproject(response.data);
      })
     .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  },[])

  const validateForm = () => {
    const newErrors = {};
    if (!projectName) {
      newErrors.projectName = "Project name is required";
    }
    return newErrors;
  };

  const createProject = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await axios.post("/projects/create", {
        name: projectName,
      });
      console.log("Project created:", response.data);
      setisModalOpen(false);
      setProjectName("");
      setErrors({});
    } catch (error) {
      console.error("Error creating project:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "An error occurred while creating the project" });
      }
    }
  };

  return (
    <main className="p-4">
      <div className="projects flex flex-wrap gap-4">
        <button
          className="project p-4 border border-gray-200 rounded-md shadow-md"
          onClick={() => setisModalOpen(true)}
        >
          NEW PROJECT
          <i className="ri-link ml-2"></i>
        </button>
        {project.map((project) => (

          <div key={project._id} 
          className="project flex flex-col gap-2 p-4 border border-gray-200 
          rounded-md shadow-md cursor-pointer min-w-52 hover:bg-slate-300"
          onClick={() => navigate(`/project/${project._id}`, { state: { project } })}
          >
            <h2 className="font-semibold">{project.name}</h2>
            <div className="flex flex-wrap gap-2">
            <p className=""> <i className="ri-user-line"> Collaborators:</i></p>
              <p>{project.users.length}</p>
            </div>

          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl mb-4">Create Project</h2>
            <form onSubmit={createProject}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.projectName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.projectName}
                  </p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
                  onClick={() => setisModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Create
                </button>
              </div>
              {errors.general && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.general}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;