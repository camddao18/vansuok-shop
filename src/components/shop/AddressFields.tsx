"use client";

import { Req } from "./Req";
import { useEffect, useState } from "react";

interface Unit {
  name: string;
  code: number;
}

// Vietnam has had two administrative levels (province -> ward/commune) since 1 July 2025.
// Data: https://provinces.open-api.vn (community API). If it is unreachable we fall back to text inputs.
const API = "https://provinces.open-api.vn/api/v2";

export function AddressFields() {
  const [provinces, setProvinces] = useState<Unit[] | null>(null);
  const [wards, setWards] = useState<Unit[]>([]);
  const [provinceCode, setProvinceCode] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    fetch(`${API}/p/`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((list: Unit[]) => setProvinces([...list].sort((a, b) => a.name.localeCompare(b.name, "vi"))))
      .catch((e) => e?.name !== "AbortError" && setFailed(true));
    return () => ac.abort();
  }, []);

  useEffect(() => {
    setWards([]);
    if (!provinceCode) return;
    const ac = new AbortController();
    fetch(`${API}/p/${provinceCode}?depth=2`, { signal: ac.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((p: { wards: Unit[] }) =>
        setWards([...p.wards].sort((a, b) => a.name.localeCompare(b.name, "vi"))),
      )
      .catch((e) => e?.name !== "AbortError" && setFailed(true));
    return () => ac.abort();
  }, [provinceCode]);

  if (failed) {
    return (
      <>
        <label className="vs-label">
          <span>Tỉnh / Thành phố<Req /></span>
          <input className="vs-input" name="province" autoComplete="address-level1" required maxLength={80} />
        </label>
        <label className="vs-label">
          <span>Phường / Xã<Req /></span>
          <input className="vs-input" name="ward" autoComplete="address-level3" required maxLength={80} />
        </label>
      </>
    );
  }

  return (
    <>
      <label className="vs-label">
        <span>Tỉnh / Thành phố<Req /></span>
        <select
          className="vs-input" name="province" required disabled={!provinces} defaultValue=""
          onChange={(e) => {
            const p = provinces?.find((x) => x.name === e.target.value);
            setProvinceCode(p ? String(p.code) : "");
          }}
        >
          <option value="" disabled>{provinces ? "Chọn tỉnh / thành phố" : "Đang tải…"}</option>
          {provinces?.map((p) => <option key={p.code} value={p.name}>{p.name}</option>)}
        </select>
      </label>
      <label className="vs-label">
        <span>Phường / Xã<Req /></span>
        <select className="vs-input" name="ward" required disabled={!wards.length} defaultValue="" key={provinceCode}>
          <option value="" disabled>{provinceCode ? (wards.length ? "Chọn phường / xã" : "Đang tải…") : "Hãy chọn tỉnh / thành phố trước"}</option>
          {wards.map((w) => <option key={w.code} value={w.name}>{w.name}</option>)}
        </select>
      </label>
    </>
  );
}
