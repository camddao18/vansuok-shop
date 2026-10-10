"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";

/**
 * Lives on the confirmation page. Clears the cart (the order exists), and while a bank
 * transfer is still unconfirmed, re-fetches the page so the webhook's result shows up.
 */
export function OrderWatcher({ waiting }: { waiting: boolean }) {
  const router = useRouter();
  const { clear, ready } = useCart();

  useEffect(() => {
    if (ready) clear();
  }, [ready, clear]);

  useEffect(() => {
    if (!waiting) return;
    let tries = 0;
    const id = setInterval(() => {
      if (++tries > 60) return clearInterval(id); // ~5 minutes
      router.refresh();
    }, 5000);
    return () => clearInterval(id);
  }, [waiting, router]);

  return null;
}
