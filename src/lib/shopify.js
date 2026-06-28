const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
const USE_MOCK = !DOMAIN || !TOKEN;

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const MOCK_COLLECTIONS = [
  { id: "col_rings",     handle: "rings",     title: "Rings",     description: "Solitaires, bands & cocktail rings in 9K–22K gold.",        image: "/images/products/ring-1.png" },
  { id: "col_earrings",  handle: "earrings",  title: "Earrings",  description: "Studs, drops & chandeliers for every occasion.",             image: "/images/products/ring-2.png" },
  { id: "col_necklaces", handle: "necklaces", title: "Necklaces", description: "Pendants, chokers & statement chains.",                      image: "/images/products/necklace-1.png" },
  { id: "col_bracelets", handle: "bracelets", title: "Bracelets", description: "Bangles, kadas & tennis bracelets.",                         image: "/images/products/bracelet-1.png" },
  { id: "col_bridal",    handle: "bridal",    title: "Bridal",    description: "Curated sets for your most cherished moments.",              image: "/images/products/ring-1.png" },
  { id: "col_heritage",  handle: "heritage",  title: "Heritage",  description: "Heirlooms inspired by 1909 royal craftsmanship.",           image: "/images/products/bracelet-1.png" },
];

export const MOCK_PRODUCTS = [
  {
    id: "p1", handle: "eternal-bloom-ring", title: "Eternal Bloom Ring",
    productType: "Ring", collectionHandle: "rings", tags: ["Bestseller"],
    price: "27500", compareAtPrice: null,
    image: "/images/products/ring-1.png", variantId: "v1", availableForSale: true,
    description: "A timeless solitaire ring inspired by blooming flowers, set with a certified diamond in 14K gold. Each petal is hand-set by our master craftsmen.",
  },
  {
    id: "p2", handle: "lumiere-solitaire", title: "Lumière Solitaire",
    productType: "Ring", collectionHandle: "rings", tags: ["New"],
    price: "29800", compareAtPrice: "34000",
    image: "/images/products/ring-2.png", variantId: "v2", availableForSale: true,
    description: "A brilliant-cut solitaire ring with exceptional fire and scintillation. The modern tulip setting elevates the diamond.",
  },
  {
    id: "p3", handle: "stardust-drop-earrings", title: "Stardust Drop Earrings",
    productType: "Earrings", collectionHandle: "earrings", tags: ["Heritage"],
    price: "28500", compareAtPrice: null,
    image: "/images/products/necklace-1.png", variantId: "v3", availableForSale: true,
    description: "Celestial drop earrings featuring pavé-set diamonds in a cascade design. A nod to the starlit nights of Kashi.",
  },
  {
    id: "p4", handle: "timeless-kara-bracelet", title: "Timeless Kara Bracelet",
    productType: "Bracelet", collectionHandle: "bracelets", tags: ["Exclusive"],
    price: "30000", compareAtPrice: null,
    image: "/images/products/bracelet-1.png", variantId: "v4", availableForSale: true,
    description: "A heritage kara reimagined in 22K gold with intricate hand-engraving passed down through five generations.",
  },
  {
    id: "p5", handle: "celestial-pendant", title: "Celestial Pendant",
    productType: "Necklace", collectionHandle: "necklaces", tags: ["New"],
    price: "25500", compareAtPrice: null,
    image: "/images/products/necklace-1.png", variantId: "v5", availableForSale: true,
    description: "A star-motif pendant on a fine gold chain, perfect for everyday elegance with a touch of the celestial.",
  },
  {
    id: "p6", handle: "royal-jadau-set", title: "Royal Jadau Necklace",
    productType: "Necklace", collectionHandle: "bridal", tags: ["Exclusive", "Bridal"],
    price: "185000", compareAtPrice: null,
    image: "/images/products/ring-1.png", variantId: "v6", availableForSale: true,
    description: "A museum-quality jadau necklace set with uncut polki diamonds and Basra pearls. Each stone individually set by hand.",
  },
  {
    id: "p7", handle: "vine-drop-earrings", title: "Vine Drop Earrings",
    productType: "Earrings", collectionHandle: "earrings", tags: ["Bestseller"],
    price: "22000", compareAtPrice: "26000",
    image: "/images/products/ring-2.png", variantId: "v7", availableForSale: true,
    description: "Delicate vine-motif earrings with leaf-shaped diamond clusters that catch the light with every movement.",
  },
  {
    id: "p8", handle: "heritage-kangan", title: "Heritage Kangan",
    productType: "Bracelet", collectionHandle: "heritage", tags: ["Heritage"],
    price: "45000", compareAtPrice: null,
    image: "/images/products/bracelet-1.png", variantId: "v8", availableForSale: true,
    description: "A traditional kangan reinterpreted in 22K gold, carrying the soul of 1909 craftsmanship into the modern era.",
  },
];

// ─── Shopify GraphQL ──────────────────────────────────────────────────────────

async function shopifyFetch(query, variables = {}) {
  const res = await fetch(`https://${DOMAIN}/api/2025-04/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0].message);
  return json.data;
}

function normalizeProduct(node) {
  const images = node.images?.edges?.map(e => e.node.url).filter(Boolean) || [];
  const variant = node.variants?.edges?.[0]?.node;
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    productType: node.productType || "",
    tags: node.tags || [],
    price: variant?.price?.amount || "0",
    compareAtPrice: variant?.compareAtPrice?.amount || null,
    image: images[0] || null,
    images,
    variantId: variant?.id || "",
    availableForSale: variant?.availableForSale ?? true,
    description: node.description || "",
    collectionHandle: "",
  };
}

const PRODUCT_FRAGMENT = `
  id handle title description productType tags
  images(first: 10) { edges { node { url altText } } }
  variants(first: 1) {
    edges { node {
      id title availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }}
  }
`;

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getCollections() {
  if (USE_MOCK) return MOCK_COLLECTIONS;
  const data = await shopifyFetch(`{
    collections(first: 50) {
      edges { node {
        id handle title description
        image { url }
        products(first: 1) { edges { node { featuredImage { url } } } }
      } }
    }
  }`);
  // collections we never want to surface on the storefront (case-insensitive, matches handle or title)
  const HIDDEN = ["frontpage", "mangalsutra", "necklace"];
  return data.collections.edges
    .map(({ node }) => node)
    .filter(n => {
      const h = (n.handle || "").toLowerCase();
      const t = (n.title || "").toLowerCase();
      return !HIDDEN.some(x => h.includes(x) || t.includes(x));
    })
    .map(n => ({
      id: n.id,
      handle: n.handle,
      title: n.title,
      description: n.description || "",
      // fall back to the first product's image when the collection has no cover image set
      image: n.image?.url || n.products?.edges?.[0]?.node?.featuredImage?.url || null,
    }));
}

export async function getProducts({ collectionHandle, limit = 12, query = "" } = {}) {
  if (USE_MOCK) {
    let results = [...MOCK_PRODUCTS];
    if (collectionHandle) results = results.filter(p => p.collectionHandle === collectionHandle);
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return results.slice(0, limit);
  }

  if (collectionHandle) {
    const data = await shopifyFetch(`
      query($handle: String!, $limit: Int!) {
        collectionByHandle(handle: $handle) {
          products(first: $limit) { edges { node { ${PRODUCT_FRAGMENT} } } }
        }
      }`, { handle: collectionHandle, limit });
    return (data.collectionByHandle?.products.edges || []).map(({ node }) => normalizeProduct(node));
  }

  const data = await shopifyFetch(`
    query($limit: Int!) {
      products(first: $limit) { edges { node { ${PRODUCT_FRAGMENT} } } }
    }`, { limit });
  return data.products.edges.map(({ node }) => normalizeProduct(node));
}

export async function getProductByHandle(handle) {
  if (USE_MOCK) return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  const data = await shopifyFetch(`
    query($handle: String!) {
      productByHandle(handle: $handle) { ${PRODUCT_FRAGMENT} }
    }`, { handle });
  return data.productByHandle ? normalizeProduct(data.productByHandle) : null;
}

export async function getCollectionByHandle(handle) {
  if (USE_MOCK) return MOCK_COLLECTIONS.find(c => c.handle === handle) || null;
  const data = await shopifyFetch(`
    query($handle: String!) {
      collectionByHandle(handle: $handle) {
        id handle title description image { url }
      }
    }`, { handle });
  const c = data.collectionByHandle;
  if (!c) return null;
  return { id: c.id, handle: c.handle, title: c.title, description: c.description, image: c.image?.url || null };
}

export async function searchProducts(query) {
  if (!query || query.length < 2) return [];
  if (USE_MOCK) {
    const q = query.toLowerCase();
    return MOCK_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.productType.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    ).slice(0, 6);
  }
  const data = await shopifyFetch(`
    query($query: String!) {
      products(first: 6, query: $query) { edges { node { ${PRODUCT_FRAGMENT} } } }
    }`, { query });
  return data.products.edges.map(({ node }) => normalizeProduct(node));
}

export async function createCheckout(items) {
  if (USE_MOCK) {
    alert("Shopify credentials are not configured yet.\nAdd VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN to .env");
    return null;
  }
  // Only real Shopify variant GIDs can be checked out (skip any legacy/mock items)
  const lines = items
    .filter(i => typeof i.variantId === "string" && i.variantId.startsWith("gid://"))
    .map(i => ({ merchandiseId: i.variantId, quantity: i.quantity }));
  if (lines.length === 0) {
    alert("Your cart has items that can't be checked out. Please remove and re-add them.");
    return null;
  }
  const data = await shopifyFetch(`
    mutation($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`, { input: { lines } });
  const { cart, userErrors } = data.cartCreate;
  if (userErrors?.length) throw new Error(userErrors[0].message);
  if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl;
  return cart?.checkoutUrl || null;
}

export function formatPrice(amount) {
  return "₹" + parseFloat(amount).toLocaleString("en-IN");
}
