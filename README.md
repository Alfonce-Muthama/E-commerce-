Njerus Shop

A simple, modern frontend-only online shop demo featuring:

- Customer registration (stored locally)
- Product catalog and shopping cart
- Checkout flow with Mpesa as the preferred payment method (simulated)

This is a static site meant for quick demos. For production you will need a backend (Node/Express, Django, etc.) and a real Mpesa integration using Safaricom Daraja APIs.

Run locally

Open `index.html` directly in your browser or serve the folder with any static server.

On Windows PowerShell you can run:

```powershell
python -m http.server 5500
# Then open http://localhost:5500/
```

Mpesa integration notes

This project simulates Mpesa STK Push in the UI only. To integrate real payments, you will need to:

1. Create a Safaricom Daraja application and obtain Consumer Key and Secret.
2. Implement a backend endpoint to:
   - Generate OAuth token
   - Create the STK Push request (`/mpesa/stkpush/v1/processrequest`)
   - Validate and handle callbacks (`/mpesa/stkpushquery/v1/query`)
3. From the frontend, call your backend to initiate payments and poll/receive the result.

Example backend pseudo-flow (Node/Express):

```js
POST /api/payments/mpesa/stk-push { phone, amount, orderId }
  → backend gets OAuth token from Daraja
  → backend calls STK push API with shortCode/passkey/timestamp
  → return CheckoutRequestID and CustomerMessage
  → handle callback route to mark order paid
```

Security tip: Never expose Consumer Key/Secret or passkey in frontend code.

Project structure

- `index.html` – UI shell, sections, dialogs
- `css/styles.css` – styles and layout
- `js/app.js` – products, cart, registration, and checkout logic

Customization

Edit the `products` array in `js/app.js` to change the catalog and prices. Branding, colors, and layout can be updated in `css/styles.css`.


