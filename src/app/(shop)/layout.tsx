import { CartProvider } from "@/components/shop/CartProvider";
import { Intro } from "@/components/shop/Intro";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { AccountProvider } from "@/components/shop/AccountProvider";
import { getSessionCustomer } from "@/lib/customer-session";
import { getProducts } from "@/lib/products";

/** Storefront chrome: cart state, tài khoản khách, header and footer. The admin portal has its own layout. */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const me = await getSessionCustomer();
  return (
    <CartProvider products={await getProducts()}>
      <AccountProvider account={me && { name: me.name, phone: me.phone, email: me.email }}>
        <Intro />
        <Header />
        <main>{children}</main>
        <Footer />
      </AccountProvider>
    </CartProvider>
  );
}
