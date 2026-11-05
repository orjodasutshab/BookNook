"use client";
import { useState } from "react";

type Props = { src?: string | null; name?: string | null; size?: number; ring?: boolean };

export default function Avatar({ src, name, size = 40, ring = true }: Props) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size, minWidth: size };
  const ringCls = ring ? "ring-2 ring-primary ring-offset-2 ring-offset-base-100" : "";

  if (!src || failed) {
    return (
      <div
        style={{ ...style, fontSize: size * 0.42 }}
        className={`rounded-full bg-primary text-primary-content flex items-center justify-center font-bold select-none ${ringCls}`}
      >
        {(name?.trim()?.[0] || "U").toUpperCase()}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name || "User"}
      style={style}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`rounded-full object-cover ${ringCls}`}
    />
  );
}
