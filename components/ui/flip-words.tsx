// components/ui/flip-words.tsx
"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "@/lib/utils"

type FlipWordsProps = Omit<React.ComponentProps<"span">, "children"> & {
    words: string[]
    duration?: number
    letterDelay?: number
    wordDelay?: number
}

export function FlipWords({
                              ref,
                              words,
                              duration = 4000,
                              letterDelay = 0.05,
                              wordDelay = 0.25,
                              className,
                              ...props
                          }: FlipWordsProps) {
    const localRef = React.useRef<HTMLSpanElement>(null)
    React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement)

    const [currentIndex, setCurrentIndex] = React.useState(0)

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length)
        }, duration)
        return () => clearInterval(interval)
    }, [words, duration])

    return (
        <span
            ref={localRef}
            {...props}
            className={cn("inline-block relative w-full h-full", className)}
            style={{
                display: "inline-block",
                position: "relative",
                width: "100%",
                height: "100%",
            }}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={words[currentIndex]}
                    initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{
                        opacity: 0,
                        y: -40,
                        x: 40,
                        scale: 1.2,
                        filter: "blur(8px)",
                        position: "absolute",
                    }}
                    transition={{ type: "spring", stiffness: 120, damping: 16 }}
                    className="absolute left-0 top-0 flex items-center justify-center lg:justify-start whitespace-nowrap w-full h-full"
                >
                    {words[currentIndex].split(" ").map((word, wordIndex) => (
                        <motion.span
                            key={`${word}-${wordIndex}`}
                            initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                                delay: wordIndex * wordDelay,
                                duration: 0.35,
                                ease: "easeOut",
                            }}
                            className="inline-block"
                        >
                            {word.split("").map((letter, letterIndex) => (
                                <motion.span
                                    key={`${word}-${letterIndex}`}
                                    initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                    transition={{
                                        delay:
                                            wordIndex * wordDelay + letterIndex * letterDelay,
                                        duration: 0.25,
                                        ease: "easeOut",
                                    }}
                                    className="inline-block"
                                >
                                    {letter}
                                </motion.span>
                            ))}
                            <span className="inline-block">&nbsp;</span>
                        </motion.span>
                    ))}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

