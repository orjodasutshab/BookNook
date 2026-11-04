"use client";
import { useEffect } from "react";

export default function Title({ name }: { name: string }) {
  useEffect(() => {
    document.title = `BookNook | ${name}`;
  }, [name]);
  return null;
}
