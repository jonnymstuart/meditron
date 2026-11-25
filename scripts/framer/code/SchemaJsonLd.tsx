import { addPropertyControls, ControlType, useLocaleInfo } from "framer"

interface SchemaJsonLdProps {
    kind: "product" | "solution" | "article"
    name: string
    description: string
    brand: string
    category: string
    slug: string
    image?: { src: string; alt?: string }
    author: string
    datePublished: string
    style?: React.CSSProperties
}

const SITE = "https://www.meditron.ch"

// Breadcrumb names per locale (schema only; the visible navigation is unchanged).
const CRUMBS: Record<string, { home: string; products: string; news: string; solutions: string }> = {
    en: { home: "Home", products: "Products", news: "News & Events", solutions: "Solutions" },
    de: { home: "Startseite", products: "Produkte", news: "News & Ratgeber", solutions: "Lösungen" },
    fr: { home: "Accueil", products: "Produits", news: "Actualités et guides", solutions: "Solutions" },
    it: { home: "Home", products: "Prodotti", news: "News e guide", solutions: "Soluzioni" },
}

/**
 * Emits JSON-LD (MedicalDevice / Article / BreadcrumbList) for the current CMS item. Renders nothing visible.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SchemaJsonLd(props: SchemaJsonLdProps) {
    const { kind = "product", name = "", description = "", brand = "", category = "", slug = "", image, author = "", datePublished = "" } = props
    // The slug prop is already the localized CMS slug; the URL needs the locale prefix (/de, /fr, /it; none for EN).
    // Before 25 Nov every DE/FR/IT page declared the EN path, which is a 404 for articles with localized slugs.
    const { activeLocale } = useLocaleInfo()
    const lang = String(activeLocale?.code || "en").slice(0, 2).toLowerCase()
    const isEn = lang === "en" || !activeLocale?.slug
    const root = isEn ? SITE : `${SITE}/${activeLocale.slug}`
    const inLanguage = isEn ? "en" : `${lang}-CH`
    const L = CRUMBS[isEn ? "en" : lang] || CRUMBS.en
    const base = kind === "product" ? `${root}/products/` : kind === "article" ? `${root}/news-events/` : `${root}/solutions/`
    const url = base + slug
    const crumbs = kind === "product"
        ? [[L.home, root + "/"], [L.products, root + "/products"], [name, url]]
        : kind === "article"
          ? [[L.home, root + "/"], [L.news, root + "/news-events"], [name, url]]
          : [[L.home, root + "/"], [L.solutions, root + "/solutions/ultrasound"], [name, url]]
    const graph: any[] = [
        {
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: u })),
        },
    ]
    if (kind === "product" && name) {
        // MedicalDevice, not Product. Google's product snippets require offers, review or aggregateRating on a Product
        // (Search Console marks it critical otherwise). Meditron publishes no prices and has no reviews to mark up, so a
        // Product type always fails. MedicalDevice carries the same facts without merchant requirements.
        const fullName = brand && !name.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand} ${name}` : name
        graph.push({
            "@type": "MedicalDevice",
            "@id": url + "#device",
            name: fullName,
            description: description || undefined,
            image: image?.src ? [image.src] : undefined,
            url,
            subjectOf: { "@type": "WebPage", "@id": url, url, inLanguage },
        })
    }
    if (kind === "article" && name) {
        const date = datePublished ? String(datePublished).slice(0, 10) : undefined
        graph.push({
            "@type": "Article",
            headline: name,
            description: description || undefined,
            image: image?.src ? [image.src] : undefined,
            datePublished: date,
            dateModified: date,
            inLanguage,
            author: author
                ? { "@type": "Person", name: author, worksFor: { "@id": SITE + "/#org" } }
                : { "@type": "Organization", "@id": SITE + "/#org", name: "Meditron SA" },
            publisher: { "@type": "Organization", "@id": SITE + "/#org", name: "Meditron SA", logo: { "@type": "ImageObject", url: "https://framerusercontent.com/images/Bh1NiA8jHvEeS15K8WcRYSKE0.png" } },
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            url,
        })
    }
    const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    return (
        <div style={{ position: "relative", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
        </div>
    )
}

addPropertyControls(SchemaJsonLd, {
    kind: { type: ControlType.Enum, title: "Kind", options: ["product", "solution", "article"], optionTitles: ["Product", "Solution", "Article"], defaultValue: "product" },
    name: { type: ControlType.String, title: "Name", defaultValue: "" },
    description: { type: ControlType.String, title: "Description", displayTextArea: true, defaultValue: "" },
    brand: { type: ControlType.String, title: "Brand", defaultValue: "" },
    category: { type: ControlType.String, title: "Category", defaultValue: "" },
    slug: { type: ControlType.String, title: "Slug", defaultValue: "" },
    image: { type: ControlType.ResponsiveImage, title: "Image" },
    author: { type: ControlType.String, title: "Author", defaultValue: "", hidden: (p) => p.kind !== "article" },
    datePublished: { type: ControlType.Date, title: "Published", hidden: (p) => p.kind !== "article" },
})
