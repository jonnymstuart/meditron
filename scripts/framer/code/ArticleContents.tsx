import { useEffect, useState } from "react"
import { addPropertyControls, ControlType } from "framer"

interface ArticleContentsProps {
    title: string
    bodyName: string
    headingLevel: "h2" | "h3"
    textColor: string
    linkColor: string
    titleFont: any
    itemFont: any
    style?: React.CSSProperties
}

const slugify = (s: string) =>
    s
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60)

/**
 * Table of contents for an article. Reads the headings of the CMS body on the same page,
 * gives each one an id and lists them as anchor links. Renders nothing when there are no headings.
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight auto
 */
export default function ArticleContents(props: ArticleContentsProps) {
    const {
        title = "Contents",
        bodyName = "Body",
        headingLevel = "h2",
        textColor = "rgb(16, 44, 71)",
        linkColor = "rgb(16, 44, 71)",
        titleFont,
        itemFont,
        style,
    } = props
    const [items, setItems] = useState<{ id: string; text: string }[]>([])

    useEffect(() => {
        if (typeof document === "undefined") return
        const build = () => {
            const body = document.querySelector(`[data-framer-name="${bodyName}"]`)
            if (!body) return
            const found: { id: string; text: string }[] = []
            const used = new Set<string>()
            body.querySelectorAll(headingLevel).forEach((h) => {
                const text = (h.textContent || "").trim()
                if (!text) return
                let id = h.id || slugify(text) || "section"
                let n = 2
                while (used.has(id)) id = `${slugify(text)}-${n++}`
                used.add(id)
                h.id = id
                found.push({ id, text })
            })
            setItems(found)
        }
        build()
        const t = setTimeout(build, 500)
        return () => clearTimeout(t)
    }, [bodyName, headingLevel])

    if (items.length === 0) return <div style={{ ...style, display: "none" }} />

    const go = (e: React.MouseEvent, id: string) => {
        const el = document.getElementById(id)
        if (!el) return
        e.preventDefault()
        el.scrollIntoView({ behavior: "smooth", block: "start" })
        history.replaceState(null, "", `#${id}`)
    }

    return (
        <nav aria-label={title} style={{ ...style, display: "flex", flexDirection: "column", gap: 12, color: textColor }}>
            <div style={{ ...titleFont }}>{title}</div>
            <ol style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                {items.map((it) => (
                    <li key={it.id} style={{ ...itemFont }}>
                        <a href={`#${it.id}`} onClick={(e) => go(e, it.id)} style={{ color: linkColor, textDecoration: "none", borderBottom: `1px solid ${linkColor}33` }}>
                            {it.text}
                        </a>
                    </li>
                ))}
            </ol>
        </nav>
    )
}

addPropertyControls(ArticleContents, {
    title: { type: ControlType.String, title: "Title", defaultValue: "Contents" },
    bodyName: { type: ControlType.String, title: "Body layer", defaultValue: "Body", description: "Layer name of the rich text body to read headings from." },
    headingLevel: { type: ControlType.Enum, title: "Headings", options: ["h2", "h3"], optionTitles: ["H2", "H3"], defaultValue: "h2" },
    textColor: { type: ControlType.Color, title: "Text", defaultValue: "rgb(16, 44, 71)" },
    linkColor: { type: ControlType.Color, title: "Links", defaultValue: "rgb(16, 44, 71)" },
    titleFont: { type: ControlType.Font, title: "Title font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontFamily: "Graphik Trial", fontWeight: 500, fontSize: 18, lineHeight: "1.4em" } },
    itemFont: { type: ControlType.Font, title: "Item font", controls: "extended", defaultFontType: "sans-serif", defaultValue: { fontFamily: "Graphik Trial", fontWeight: 400, fontSize: 15, lineHeight: "1.5em" } },
})
