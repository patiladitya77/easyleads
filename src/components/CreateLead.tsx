"use client";
import { useRouter } from "next/navigation";
import React from "react";

const CreateLead = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push("/home/buyers/new");
  };

  return (
    <div className="flex justify-between mx-10 bg-gray-100 shadow-md border border-gray-200">
      <p>Got a new Lead?</p>
      <button onClick={handleClick}>Create Here</button>
    </div>
  );
};

export default CreateLead;
