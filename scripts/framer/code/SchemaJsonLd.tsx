import { addPropertyControls, ControlType } from "framer"

interface SchemaJsonLdProps {
    kind: "product" | "solution"
    name: string
    description: string
    brand: string
    category: string
    slug: string
    image?: { src: string; alt?: string }
    style?: React.CSSProperties
}

const SITE = "https://www.meditron.ch"

/**
 * Emits JSON-LD (Product / BreadcrumbList) for the current CMS item. Renders nothing visible.
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight fixed
 */
export default function SchemaJsonLd(props: SchemaJsonLdProps) {
    const { kind = "product", name = "", description = "", brand = "", category = "", slug = "", image } = props
    const base = kind === "product" ? `${SITE}/products/` : `${SITE}/solutions/`
    const url = base + slug
    const crumbs = kind === "product"
        ? [["Home", SITE + "/"], ["Products", SITE + "/products"], [name, url]]
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
    const json = JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    return (
        <div style={{ position: "relative", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
        </div>
    )
}

addPropertyControls(SchemaJsonLd, {
    kind: { type: ControlType.Enum, title: "Kind", options: ["product", "solution"], optionTitles: ["Product", "Solution"], defaultValue: "product" },
    name: { type: ControlType.String, title: "Name", defaultValue: "" },
    description: { type: ControlType.String, title: "Description", displayTextArea: true, defaultValue: "" },
    brand: { type: ControlType.String, title: "Brand", defaultValue: "" },
    category: { type: ControlType.String, title: "Category", defaultValue: "" },
    slug: { type: ControlType.String, title: "Slug", defaultValue: "" },
    image: { type: ControlType.ResponsiveImage, title: "Image" },
})
