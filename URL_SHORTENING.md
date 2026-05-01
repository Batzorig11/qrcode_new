# URL Shortening for QR Studio: Research Summary

Shortening URLs is a critical feature for professional QR code generation. It reduces the complexity (density) of the QR pattern, making it easier to scan, especially when using logo overlays or small print sizes.

## 1. Top Provider Comparison (Free Tiers 2026)

| Provider | Monthly Link Limit | Monthly Click Limit | Custom Domain | Best For... |
| :--- | :--- | :--- | :--- | :--- |
| **Dub.co** | 25 | 1,000 | Yes (3) | Modern Devs, High-end Branding |
| **Short.io** | 1,000 (Lifetime) | 50,000 | Yes (5) | High Volume, API Analytics |
| **TinyURL** | 100 (API) | Unlimited | No | Simplicity, Infinite Clicks |
| **Bitly** | 5 | Unlimited | No | Casual use (Note: Has Ads) |

## 2. Why Use a Custom Domain?

*   **Trust:** Users are more likely to scan `qr.yourbrand.com` than a random `tinyurl.com` link.
*   **Reliability:** You own the traffic. If you switch providers, your domain (and thus your printed QR codes) continues to work.
*   **Scanability:** Shorter domains (e.g., `go.io`) create simpler QR patterns than longer default provider domains.

## 3. Implementation Requirements (TinyURL Example)

To integrate a shortener into the QR Studio, you will need:
1.  **API Token:** Generated from the provider's dashboard.
2.  **Environment Variable:** Store the token securely in `.env.local`.
3.  **Proxy API Route:** A Next.js API route to handle the request to the provider (to avoid CORS issues).
4.  **UI Integration:** A "Shorten" button or automatic threshold check (e.g., if URL > 100 chars).

## 4. Key Takeaways

*   **Nord Aesthetic:** Using a custom domain with Dub.co or Short.io perfectly matches the "Professional Studio" vibe of our current design.
*   **Analytics:** Essential for measuring ROI and catching dead links.
*   **Scanning Reliability:** Short URLs are the #1 way to ensure a QR code with a central logo remains scannable.

---
*Created on: May 1, 2026*
