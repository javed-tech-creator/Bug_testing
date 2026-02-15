import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sales from "../assets/Icons/department/sales.png";
import recce from "../assets/Icons/department/recce.png";
import design from "../assets/Icons/department/design.png";
import quotation from "../assets/quotation.webp";
const ProjectsItem = [
    {
        name: "Projects",
        icon: sales,
        path: "/project/login",
    },
    // {
    //     name: "Manager",
    //     icon: recce,
    //     path: "/manager/login",
    // }
];

const Projects = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);
    const handleLoging = (path) => {
        setLoading(path);
        navigate(path);
    };

    useEffect(() => {
        setLoading(null);
    }, []);
    return (
        <div className="min-h-screen bg-primary flex flex-col items-center justify-center px-4 py-10">
            <div className="mb-12 text-center text-white">
                <h1 className="text-2xl underline underline-offset-4 md:text-4xl font-light tracking-wide">
                    DSS Projects Login
                </h1>
            </div>

            <div className="flex mt-10 justify-center items-center flex-wrap grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-16 max-w-7xl w-full">
                {ProjectsItem.map((dept, index) => (
                    <div
                        key={index}
                        className="w-[12rem] relative rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 pt-6 pb-4 px-5 flex flex-col items-center text-center group"
                    >
                        {/* Icon floating on top */}
                        <div className="absolute border border-gray-200 p-1.5 -top-11 left-1/2  transform -translate-x-1/2 bg-gray-50 text-white rounded-full w-18 h-18 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {/* {dept.icon} */}
                            <img
                                src={dept.icon}
                                alt={dept.name}
                                className=" p-2 object-center"
                            />
                        </div>

                        <div className="mt-4 mb-2">
                            <h2 className="text-base font-medium text-gray-900 ">
                                {dept.name}
                            </h2>
                        </div>

                        <button
                            disabled={dept.path === "#" || loading}
                            onClick={() => handleLoging(dept?.path)}
                            className={`mt-auto px-4 py-1.5 text-sm font-medium tracking-wider uppercase rounded-full border-none outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-all duration-200
              ${dept.path === "#"
                                    ? "bg-black text-white cursor-not-allowed"
                                    : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                                }`}
                        >
                            {loading === dept.path ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                "LOGIN"
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Projects;
