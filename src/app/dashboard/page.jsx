"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Shield, Stethoscope, Heart, ArrowRight } from "lucide-react"

export default function DashboardRouter() {
  const router = useRouter()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 280, damping: 24 } 
    }
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden relative"
      style={{ backgroundColor: "#FFFDFE" }}
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#3B75FD]/6 rounded-full blur-[140px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#80A0B5]/8 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-white/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-6xl relative z-10"
      >
        <motion.div variants={item} className="text-center mb-12 sm:mb-16">
          <div 
            className="inline-block mb-4 px-5 py-2 rounded-full text-sm font-medium border transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: "rgba(59, 117, 253, 0.07)",
              borderColor: "rgba(59, 117, 253, 0.25)",
              color: "#3B75FD"
            }}
          >
            Simplified Healthcare Management
          </div>
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
            style={{ color: "#020331" }}
          >
            Welcome to{" "}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #3B75FD, #80A0B5)"
              }}
            >
              MediCare
            </span>
          </h1>
          <p 
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#80A0B5" }}
          >
            A unified platform for patients, doctors, and administrators.
            Select your portal to get started with seamless health management.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {[
            {
              role: "Administrator",
              icon: Shield,
              desc: "Manage system settings, users, and approvals securely.",
              href: "/admin-login",
            },
            {
              role: "Doctor",
              icon: Stethoscope,
              desc: "Access patient records, diagnostics, and appointments.",
              href: "/doctor-login",
            },
            {
              role: "Patient",
              icon: Heart,
              desc: "Track health history, view reports, and book visits.",
              href: "/patients-login",
            }
          ].map((card, idx) => {
            const Icon = card.icon

            return (
              <motion.div 
                key={idx} 
                variants={item} 
                className="h-full"
              >
                <Link href={card.href} className="group block h-full">
                  <div 
                    className="relative h-full rounded-3xl p-8 border transition-all duration-400 ease-out"
                    style={{
                      backgroundColor: "#FFFDFE",
                      borderColor: "rgba(128, 160, 181, 0.16)",
                    }}
                    // Hover styles
                    // Using inline style for dynamic hover (you can also move to tailwind arbitrary variants)
                  >
                    {/* Card hover layer */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        background: "linear-gradient(135deg, rgba(59,117,253,0.04) 0%, rgba(128,160,181,0.03) 100%)",
                        boxShadow: "0 20px 40px -10px rgba(59,117,253,0.12)"
                      }}
                    />

                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-400 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        backgroundColor: "rgba(59, 117, 253, 0.08)",
                        border: "1px solid rgba(59, 117, 253, 0.25)",
                        color: "#3B75FD"
                      }}
                    >
                      {/* Icon changes color & bg on hover */}
                      <div className="transition-all duration-400 group-hover:bg-[#3B75FD] group-hover:text-white rounded-2xl w-full h-full flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                    </div>

                    <h2 
                      className="text-2xl font-bold mb-4 transition-colors duration-300"
                      style={{ color: "#020331" }}
                    >
                      <span className="group-hover:text-[#3B75FD] transition-colors duration-300">
                        {card.role}
                      </span>
                    </h2>

                    <p 
                      className="leading-relaxed mb-8 transition-colors duration-300"
                      style={{ color: "#80A0B5" }}
                    >
                      {card.desc}
                    </p>

                    <div 
                      className="flex items-center text-sm font-semibold transition-all duration-300"
                      style={{ color: "#3B75FD" }}
                    >
                      Enter Portal 
                      <ArrowRight 
                        className="w-5 h-5 ml-2.5 transition-transform duration-300 group-hover:translate-x-2" 
                      />
                    </div>

                    {/* Decorative gradient blob - grows & moves on hover */}
                    <div 
                      className="absolute bottom-0 right-0 w-40 h-40 rounded-tl-[120px] -mr-12 -mb-12 transition-all duration-500 ease-out group-hover:scale-125 group-hover:-mr-8 group-hover:-mb-8"
                      style={{
                        background: "radial-gradient(circle at 20% 20%, rgba(59,117,253,0.08), transparent 70%)",
                      }}
                    />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        <motion.div variants={item} className="text-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center text-sm transition-all duration-300 hover:text-[#3B75FD] hover:translate-x-1"
            style={{ color: "#80A0B5" }}
          >
            Return to Home Page
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}