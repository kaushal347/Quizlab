"use client"

import { useEffect } from "react"

export function useQuizSecurity(onCheat?: () => void) {
    useEffect(() => {
        // Disable right click
        const disableContextMenu = (e: MouseEvent) => e.preventDefault()

        // Block copy shortcuts
        const blockKeys = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey || e.metaKey) &&
                ["c", "v", "x", "a"].includes(e.key.toLowerCase())
            ) {
                e.preventDefault()
            }
        }

        // Tab switch detection
        const onBlur = () => {
            onCheat?.()
        }

        document.addEventListener("contextmenu", disableContextMenu)
        document.addEventListener("keydown", blockKeys)
        window.addEventListener("blur", onBlur)

        return () => {
            document.removeEventListener("contextmenu", disableContextMenu)
            document.removeEventListener("keydown", blockKeys)
            window.removeEventListener("blur", onBlur)
        }
    }, [onCheat])
}
