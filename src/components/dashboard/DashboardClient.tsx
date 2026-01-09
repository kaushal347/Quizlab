"use client";

import React from 'react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

type Props = {
    quizMe: React.ReactNode;
    history: React.ReactNode;
    hotTopics: React.ReactNode;
    recentActivities: React.ReactNode;
};

const DashboardClient = ({ quizMe, history, hotTopics, recentActivities }: Props) => {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7 auto-rows-[minmax(180px,auto)]"
        >
            {/* Row 1 */}
            <motion.div variants={item} className="md:col-span-1 lg:col-span-4 h-full">
                {quizMe}
            </motion.div>
            <motion.div variants={item} className="md:col-span-1 lg:col-span-3 h-full">
                {history}
            </motion.div>

            {/* Row 2 */}
            <motion.div variants={item} className="md:col-span-1 lg:col-span-4 h-full">
                {hotTopics}
            </motion.div>
            <motion.div variants={item} className="md:col-span-1 lg:col-span-3 h-full">
                {recentActivities}
            </motion.div>
        </motion.div>
    );
};

export default DashboardClient;
