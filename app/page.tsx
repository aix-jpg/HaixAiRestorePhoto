"use client"

import type React from "react"
import HomeClassic from "@/components/HomeClassic"
import GoogleAuthHandler from "@/components/GoogleAuthHandler"

export default function DawnChat() {
  return (
    <>
      <GoogleAuthHandler />
      <HomeClassic />
    </>
  )
}
