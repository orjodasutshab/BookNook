"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Title from "@/components/Title";
import { authClient } from "@/lib/auth-client";

function validatePassword(p: string) {
  if (p.length < 6) return "Password must be at least 6 characters long";
  if (!/[A-Z]/.test(p)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(p)) return "Password must have a lowercase letter";
  return "";
}

