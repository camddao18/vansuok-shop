"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

/** Nút gửi form: hiện trạng thái "đang xử lý" và khóa lại trong lúc action chạy; `confirm` hỏi xác nhận trước. */
export function SubmitButton({ children, pendingText = "Đang xử lý…", confirm, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { pendingText?: string; confirm?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      {...rest}
      type="submit"
      disabled={pending || rest.disabled}
      aria-busy={pending}
      onClick={(e) => { if (confirm && !window.confirm(confirm)) e.preventDefault(); }}
    >
      {pending ? pendingText : children}
    </button>
  );
}
