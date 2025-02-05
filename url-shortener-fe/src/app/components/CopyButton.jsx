import {useState, useCallback} from 'react';
import {Copy, Check} from 'lucide-react'; // Import icons
import {motion, AnimatePresence} from 'framer-motion'; // For animations

const CopyButton = ({shortUrl}) => {
    const [isCopied, setIsCopied] = useState(false);

    // Memoize handleCopy to avoid unnecessary re-renders
    const handleCopy = useCallback(() => {
        // Write the URL to the clipboard
        navigator.clipboard.writeText(shortUrl).then(() => {
            setIsCopied(true); // Show "copied" state
            setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        }).catch(() => {
            alert('Failed to copy to clipboard'); // Handle failure
        });
    }, [shortUrl]);

    return (
        <>
            <motion.button
                className="flex items-center space-x-2 p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors relative"
                onClick={handleCopy}
                title="Copy"
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
            >
                {isCopied ? (
                    <Check className="w-5 h-5"/>
                ) : (
                    <Copy className="w-5 h-5"/>
                )}
                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
            </motion.button>

            <AnimatePresence>
                {isCopied && (
                    <motion.div
                        className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
                        initial={{opacity: 0, y: 20}}
                        animate={{opacity: 1, y: 0}}
                        exit={{opacity: 0, y: 20}}
                        transition={{duration: 0.3}}
                    >
                        URL copied to clipboard!
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default CopyButton;
