"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CreateLead = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/home/buyers/new");
  };

  return (
    <div className="flex items-center justify-between mx-10 p-4 bg-white shadow-sm border border-gray-200 rounded-lg">
      <p className="text-gray-700 font-medium">Got a new lead?</p>
      <button
        onClick={handleClick}
        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition cursor-pointer"
      >
        <div className="flex ">
          <p>Create Here</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 mx-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
      </button>
    </div>
  );
};

export default CreateLead;
