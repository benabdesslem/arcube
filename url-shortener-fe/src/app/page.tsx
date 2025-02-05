"use client";

import {useState} from "react";
import {QRCodeCanvas} from 'qrcode.react';
import {ExternalLink, Link, QrCode, Share, Trash2, WandSparkles} from "lucide-react";
import CopyButton from "@/app/components/CopyButton";
import {motion, AnimatePresence} from "framer-motion";
import {isValidUrl} from "@/app/utils/urlValidator";

export default function Home() {
    const [inputUrl, setInputUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showQRCode, setShowQRCode] = useState(false);

    const handleShortenUrl = async () => {
        if (!inputUrl) {
            setError("Please enter a URL");
            return;
        }

        if (isValidUrl(inputUrl)) {
            setError("Please enter a valid URL");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const response = await fetch("/api/url/shorten", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({url: inputUrl}),
            });

            if (!response.ok) {
                throw new Error("Failed to shorten URL");
            }

            const data = await response.json();
            const domain = window.location.origin;
            setShortUrl(`${domain}/${data.shortId}`);
        } catch (error) {
            console.error(error);
            setError("An error occurred while shortening the URL");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setInputUrl("");
        setShortUrl("");
        setShowQRCode(false);
    }

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start min-w-[30rem]">
                <div className="w-full flex justify-center items-center">
                    <Link className="text-blue-500" size={120}/>
                </div>
                <h1 className="text-lg font-bold">Shorten a long URL</h1>
                <div className="flex flex-col gap-4 w-full">
                    <input
                        type="text"
                        className="border p-2 rounded w-full"
                        placeholder="Enter long link here"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        className="mt-10 w-full bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 transition-colors font-semibold"
                        onClick={handleShortenUrl}
                        disabled={isLoading}
                    >
                        {isLoading ? "Shortening..." : "Shorten URL"}
                    </button>
                    {shortUrl && (
                        <div className="mt-6 space-y-4">
                            <div className="flex items-center">
                                <WandSparkles className="mr-2 text-green-600"/>
                                <p className="text-green-600 font-semibold">Shortened URL:</p>
                            </div>
                            {/* Input field for the short URL */}
                            <input
                                type="text"
                                value={shortUrl}
                                disabled
                                className="border p-2 rounded w-full"
                            />

                            {/* Buttons with labels */}
                            <div className="flex flex-wrap gap-2">
                                {/* Visit Button */}
                                <button
                                    className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                    onClick={() => window.open(shortUrl, '_blank')}
                                    title="Visit"
                                >
                                    <ExternalLink className="w-5 h-5"/>
                                    <span>Visit</span>
                                </button>

                                {/* Share Button */}
                                <button
                                    className="flex items-center space-x-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                    onClick={() => navigator.share({url: shortUrl})}
                                    title="Share"
                                >
                                    <Share className="w-5 h-5"/>
                                    <span>Share</span>
                                </button>

                                {/* QR Code Button */}
                                <button
                                    className="flex items-center space-x-2 p-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                                    onClick={() => setShowQRCode(true)}
                                    title="QR Code"
                                >
                                    <QrCode className="w-5 h-5"/>
                                    <span>QR Code</span>
                                </button>

                                {/* Copy Button */}
                                <CopyButton shortUrl={shortUrl}/>

                                {/* Clear Button */}
                                <button
                                    className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                    onClick={handleClear}
                                    title="Clear"
                                >
                                    <Trash2 className="w-5 h-5"/>
                                    <span>Clear</span>
                                </button>
                            </div>
                            <AnimatePresence>
                                {showQRCode && (
                                    <motion.div
                                        className="flex justify-center"
                                        initial={{opacity: 0, scale: 0.8}}
                                        animate={{opacity: 1, scale: 1}}
                                        exit={{opacity: 0, scale: 0.8}}
                                        transition={{duration: 0.3}}
                                    >
                                        <QRCodeCanvas
                                            value={shortUrl}
                                            size={128}
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}