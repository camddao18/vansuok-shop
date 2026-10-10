import { CartProvider } from "@/components/shop/CartProvider";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { getProducts } from "@/lib/products";

/** Storefront chrome: cart state, header and footer. The admin portal has its own layout. */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider products={await getProducts()}>
      <Header />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  );
}
