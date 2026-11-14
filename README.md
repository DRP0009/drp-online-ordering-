# DRP Coffee — Online Ordering starter

A responsive bilingual (Arabic/English) React + Vite starter using DRP's purple visual identity and the menu/prices supplied in the conversation.

## Run on Windows

1. Install Node.js LTS from https://nodejs.org/
2. Extract this ZIP.
3. Open the extracted `drp-online-ordering` folder in VS Code.
4. Open Terminal > New Terminal.
5. Run:

   ```bash
   npm install
   npm run dev
   ```

6. Open the local URL printed in the terminal (usually http://localhost:5173).

## Important status

This is the first front-end prototype:
- Bilingual menu and category filters.
- Product cards and add-to-cart.
- Cart quantity controls, order notes, and customer fields.
- JOD pricing.

Order submission is intentionally NOT connected yet. The current checkout only prepares/copies an order summary. Next step is to connect Supabase, save orders, add admin login/dashboard, confirm delivery/pickup details, and replace placeholder cup illustrations with real DRP product photos.

## Menu notes

Products and prices are entered from the DRP menu image and text shared in chat. Some items appear in both hot and iced lists and are intentionally separate menu entries. V60 is listed once from the photo/additional text. Please verify any spelling/category changes before launch.
