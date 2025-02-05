"use client";

import {useState, useEffect, use} from "react";
import {motion} from "framer-motion";
import {AlertTriangle, Loader} from "lucide-react";

export default function ShortIdPage({params}: { params: Promise<{ shortId: string }> }) {
    const {shortId} = use(params);
    const [data, setData] = useState<{ shortId: string; originalUrl: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/url/${shortId}`);
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "An error occurred.");
                }

                setData(result);
                window.location.href = result.originalUrl;
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [shortId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="h-12 w-12 text-blue-500 animate-spin"/>
            </div>
        );
    }

    if (error) {
        return (
            <motion.div
                className="flex flex-col items-center justify-center h-screen px-6 bg-gray-50"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <div>
                    <div className="flex flex-col items-center space-y-6">
                        <AlertTriangle className="text-red-500" size={120}/>
                        <p className="text-gray-800 text-center text-lg leading-relaxed">
                            {error}
                        </p>
                    </div>

                    <button
                        className="mt-10 w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 transition-colors font-semibold"
                        onClick={() => window.location.href = "/"}
                    >
                        Create a New Short URL
                    </button>
                </div>
            </motion.div>

        );
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen px-6 text-center bg-gray-50">
            <motion.div
                className="max-w-md w-full p-6 bg-white border border-gray-200 rounded-lg shadow-md"
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                <h1 className="text-xl font-bold text-gray-800">Short ID : {shortId}</h1>
                <p className="text-lg mt-4 text-gray-700">
                    Vous serez redirigé vers :{" "}
                    <a
                        href={data?.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-semibold underline break-words"
                    >
                        {data?.originalUrl}
                    </a>
                </p>
                <div className="mt-6 text-gray-600">
                    <p>Redirection en cours...</p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                            className="bg-blue-500 h-2 rounded-full"
                            initial={{width: 0}}
                            animate={{width: "100%"}}
                            transition={{duration: 3, ease: "linear"}}
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
