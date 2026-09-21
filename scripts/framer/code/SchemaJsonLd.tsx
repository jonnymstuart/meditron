import { addPropertyControls, ControlType } from "framer"

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

/**
 * Emits JSON-LD (Product / Article / BreadcrumbList) for the current CMS item. Renders nothing visible.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SchemaJsonLd(props: SchemaJsonLdProps) {
    const { kind = "product", name = "", description = "", brand = "", category = "", slug = "", image, author = "", datePublished = "" } = props
    const base = kind === "product" ? `${SITE}/products/` : kind === "article" ? `${SITE}/news-events/` : `${SITE}/solutions/`
    const url = base + slug
    const crumbs = kind === "product"
        ? [["Home", SITE + "/"], ["Products", SITE + "/products"], [name, url]]
        : kind === "article"
          ? [["Home", SITE + "/"], ["News & Events", SITE + "/news-events"], [name, url]]
          : [["Home", SITE + "/"], ["Solutions", SITE + "/solutions/ultrasound"], [name, url]]
    const graph: any[] = [
        {
            "@type": "BreadcrumbList",
            itemListElement: crumbs.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: u })),
        },
    ]
    if (kind === "product" && name) {
        graph.push({
            "@type": "Product",
            name,
            description: description || undefined,
            image: image?.src ? [image.src] : undefined,
            brand: brand ? { "@type": "Brand", name: brand } : undefined,
            category: category || undefined,
            url,
            offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
                priceSpecification: { "@type": "PriceSpecification", priceCurrency: "CHF", description: "Price on request" },
                seller: { "@type": "Organization", name: "Meditron SA", url: SITE },
                url: SITE + "/contact",
            },
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
            inLanguage: "en",
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
