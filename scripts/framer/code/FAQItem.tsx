import { useEffect, useId, useState } from "react"
import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion } from "framer-motion"

interface FAQItemProps {
    question: string
    answer: string
    answerRich?: React.ReactNode
    group: string
    defaultOpen: boolean
    textColor: string
    lineColor: string
    questionFont: any
    answerFont: any
    style?: React.CSSProperties
}

const EVENT = "meditron-faq-open"

/**
 * One FAQ row. Click to open; opening one row closes the others in the same group.
 * The answer stays in the HTML when closed and the row emits FAQPage JSON-LD.
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function FAQItem(props: FAQItemProps) {
    const {
        question = "Question",
        answer = "Answer",
        answerRich,
        group = "faq",
        defaultOpen = false,
        textColor = "rgb(16, 44, 71)",
        lineColor = "rgba(16, 44, 71, 0.2)",
        questionFont,
        answerFont,
        style,
    } = props
    const id = useId()
    const isStatic = useIsStaticRenderer()
    const [open, setOpen] = useState<boolean>(defaultOpen)

    useEffect(() => {
        if (typeof window === "undefined") return
        const onOpen = (e: Event) => {
            const d = (e as CustomEvent).detail
            if (d && d.group === group && d.id !== id) setOpen(false)
        }
        window.addEventListener(EVENT, onOpen)
        return () => window.removeEventListener(EVENT, onOpen)
    }, [group, id])

    const toggle = () => {
        const next = !open
        setOpen(next)
        if (next && typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent(EVENT, { detail: { group, id } }))
        }
    }

    const showOpen = isStatic ? defaultOpen : open
    // One FAQPage block per row: rows are independent CMS items, so the page-level list cannot be assembled here.
    const plainAnswer = (answer || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    const schema = question && plainAnswer && !answerRich
        ? JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: plainAnswer } }] })
        : ""

    return (
        <div style={{ position: "relative", width: "100%", borderBottom: `1px solid ${lineColor}`, ...style }}>
            <button
                type="button"
                aria-expanded={showOpen}
                aria-controls={`${id}-panel`}
                onClick={toggle}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    width: "100%",
                    padding: "22px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    color: textColor,
                    ...questionFont,
                }}
            >
                <span style={{ flex: 1 }}>{question}</span>
                <span
                    aria-hidden="true"
                    style={{
                        position: "relative",
                        width: 22,
                        height: 22,
                        flex: "0 0 22px",
                        transform: showOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                    }}
                >
                    <span style={{ position: "absolute", left: 0, top: 10, width: 22, height: 2, background: textColor, borderRadius: 2 }} />
                    <span style={{ position: "absolute", left: 10, top: 0, width: 2, height: 22, background: textColor, borderRadius: 2 }} />
                </span>
            </button>
            {/* The answer is always in the DOM (collapsed to height 0 when closed) so crawlers that do not run
                JavaScript, and AI assistants, read the question and the answer together. */}
            <motion.div
                id={`${id}-panel`}
                role="region"
                aria-hidden={!showOpen}
                initial={false}
                animate={{ height: showOpen ? "auto" : 0, opacity: showOpen ? 1 : 0 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden", height: showOpen ? "auto" : 0 }}
            >
                {answerRich ? (
                    <div className="mtr-faq-answer" style={{ padding: "0 46px 24px 0", color: textColor, ...answerFont }}>{answerRich}</div>
                ) : /<[a-z][\s\S]*>/i.test(answer) ? (
                    <div
                        className="mtr-faq-answer"
                        style={{ padding: "0 46px 24px 0", color: textColor, ...answerFont }}
                        dangerouslySetInnerHTML={{ __html: answer }}
                    />
                ) : (
                    <div style={{ padding: "0 46px 24px 0", color: textColor, whiteSpace: "pre-line", ...answerFont }}>{answer}</div>
                )}
            </motion.div>
            {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />}
        </div>
    )
}

addPropertyControls(FAQItem, {
    question: { type: ControlType.String, title: "Question", defaultValue: "Is Meditron the official Samsung distributor?" },
    answerRich: { type: ControlType.RichText, title: "Answer (rich text)" },
    answer: { type: ControlType.String, title: "Answer", displayTextArea: true, defaultValue: "Yes. Meditron has been the official Samsung Healthcare distributor in Switzerland since 2012." },
    group: { type: ControlType.String, title: "Group", defaultValue: "faq", description: "Rows with the same group close each other." },
    defaultOpen: { type: ControlType.Boolean, title: "Open", defaultValue: false },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "rgb(16, 44, 71)" },
    lineColor: { type: ControlType.Color, title: "Line", defaultValue: "rgba(16, 44, 71, 0.2)" },
    questionFont: { type: ControlType.Font, title: "Question font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontFamily: "Graphik Trial", fontWeight: 500, fontSize: 20, lineHeight: "1.4em" } },
    answerFont: { type: ControlType.Font, title: "Answer font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontFamily: "Graphik Trial", fontWeight: 400, fontSize: 18, lineHeight: "1.5em" } },
})
