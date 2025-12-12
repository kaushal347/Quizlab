"use client";

import dynamic from "next/dynamic";
import React from "react";

const Brain3D = dynamic(() => import("@/components/Brain3D"), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black/20" />,
});

const Brain3DWrapper = () => {
    return <Brain3D />;
};

export default Brain3DWrapper;
