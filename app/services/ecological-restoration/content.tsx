'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Microscope, 
  ClipboardList, 
  Swords, 
  Trees, 
  LineChart,
  FileCheck,
  PlaneTakeoff,
  Timer,
  Sprout,
  Mountain,
  Droplets,
  Leaf,
  Wind,
  TreePine,
  Flower2,
  Shield,
  Workflow
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EcologicalRestorationContent() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/images/services/ecological-restoration.jpg"
            alt="Ecological Restoration"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <Link href="/services" className="inline-flex items-center text-white hover:text-emerald-400 transition-all duration-300 mb-6 hover:translate-x-[-4px] group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:transform group-hover:translate-x-[-4px]" />
            Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ecological Restoration Projects
            </h1>
            <p className="text-xl text-gray-200 mb-6">
              Rehabilitating degraded ecosystems and promoting biodiversity through expert restoration services
            </p>
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Schedule Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left Column - Main Content */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Comprehensive Ecosystem Restoration
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  Our ecological restoration services focus on rehabilitating degraded ecosystems and promoting biodiversity. We combine scientific expertise with practical implementation to restore natural environments to their optimal state, ensuring long-term sustainability and ecological balance.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-6"
              >
                {[
                  {
                    icon: <Microscope className="h-8 w-8 text-emerald-700" />,
                    title: "Site Assessment",
                    description: "Comprehensive evaluation of ecosystem conditions and restoration requirements",
                    bgColor: "bg-emerald-50",
                    hoverBg: "hover:bg-emerald-100",
                    iconColor: "text-emerald-700"
                  },
                  {
                    icon: <ClipboardList className="h-8 w-8 text-blue-700" />,
                    title: "Restoration Planning",
                    description: "Detailed planning and design of restoration strategies and timelines",
                    bgColor: "bg-blue-50",
                    hoverBg: "hover:bg-blue-100",
                    iconColor: "text-blue-700"
                  },
                  {
                    icon: <Swords className="h-8 w-8 text-teal-700" />,
                    title: "Invasive Management",
                    description: "Control and management of invasive species to protect native ecosystems",
                    bgColor: "bg-teal-50",
                    hoverBg: "hover:bg-teal-100",
                    iconColor: "text-teal-700"
                  },
                  {
                    icon: <Trees className="h-8 w-8 text-purple-700" />,
                    title: "Habitat Reconstruction",
                    description: "Expert revegetation and habitat reconstruction services",
                    bgColor: "bg-purple-50",
                    hoverBg: "hover:bg-purple-100",
                    iconColor: "text-purple-700"
                  }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-6 ${item.bgColor} rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${item.hoverBg}`}
                  >
                    <div className={`transform transition-transform duration-300 hover:scale-110 ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold mt-4 mb-2 transition-colors duration-300">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Process & Monitoring */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-emerald-50 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:bg-emerald-100/50"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Our Restoration Process
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      text: "Site Assessment and Feasibility Studies",
                      icon: <FileCheck className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Restoration Planning and Design Development",
                      icon: <PlaneTakeoff className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Invasive Species Management Strategies",
                      icon: <Timer className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Native Species Reintroduction",
                      icon: <Sprout className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Habitat Reconstruction Implementation",
                      icon: <Mountain className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Soil and Water System Rehabilitation",
                      icon: <Droplets className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    }
                  ].map((item, index) => (
                    <li key={index} className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                      {item.icon}
                      <span className="text-gray-700">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="border border-gray-200 p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:border-emerald-200"
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Project Outcomes
                </h3>
                <ul className="space-y-4">
                  {[
                    {
                      text: "Restored Biodiversity",
                      icon: <Shield className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Enhanced Ecosystem Services",
                      icon: <Workflow className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Improved Natural Habitats",
                      icon: <Trees className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Sustainable Ecosystems",
                      icon: <Leaf className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    },
                    {
                      text: "Long-term Environmental Health",
                      icon: <LineChart className="h-5 w-5 text-emerald-600 mt-1 mr-3 flex-shrink-0 transition-transform duration-300 hover:rotate-12" />
                    }
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start transform transition-all duration-300 hover:translate-x-2">
                      {benefit.icon}
                      <span className="text-gray-700">{benefit.text}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          {/* Large Decorative Elements */}
          <div className="absolute inset-0 opacity-[0.07]">
            <Trees className="absolute -top-12 -left-12 w-96 h-96 text-[#A8C6A1] transform rotate-12" />
            <Trees className="absolute -bottom-12 -right-12 w-96 h-96 text-[#A8C6A1] transform -rotate-12" />
          </div>

          {/* Floating Elements - Left Side */}
          <div className="absolute left-0 inset-y-0 w-1/3">
            <Leaf className="absolute top-12 left-12 w-8 h-8 text-white opacity-20 animate-float-slow" />
            <Sprout className="absolute top-1/4 left-24 w-12 h-12 text-white opacity-15 animate-float-slow delay-200" />
            <Wind className="absolute top-1/2 left-16 w-10 h-10 text-white opacity-20 animate-float-slow delay-300 transform rotate-45" />
            <Flower2 className="absolute bottom-1/4 left-20 w-6 h-6 text-white opacity-15 animate-float-slow delay-400" />
          </div>

          {/* Floating Elements - Center */}
          <div className="absolute left-1/3 right-1/3 inset-y-0">
            <TreePine className="absolute top-16 left-1/2 w-10 h-10 text-white opacity-20 animate-float-medium transform -translate-x-1/2" />
            <Leaf className="absolute top-1/3 left-1/4 w-8 h-8 text-white opacity-15 animate-float-medium delay-150" />
            <Sprout className="absolute bottom-1/3 right-1/4 w-12 h-12 text-white opacity-20 animate-float-medium delay-300" />
            <Wind className="absolute bottom-24 left-1/2 w-8 h-8 text-white opacity-15 animate-float-medium delay-450 transform -translate-x-1/2 rotate-12" />
          </div>

          {/* Floating Elements - Right Side */}
          <div className="absolute right-0 inset-y-0 w-1/3">
            <Flower2 className="absolute top-20 right-16 w-10 h-10 text-white opacity-20 animate-float-slow" />
            <TreePine className="absolute top-1/3 right-20 w-8 h-8 text-white opacity-15 animate-float-slow delay-150" />
            <Leaf className="absolute bottom-1/3 right-24 w-12 h-12 text-white opacity-20 animate-float-slow delay-300" />
            <Sprout className="absolute bottom-20 right-16 w-8 h-8 text-white opacity-15 animate-float-slow delay-450" />
          </div>
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Restore Your Ecosystem?
            </h2>
            <p className="text-gray-200 mb-8">
              Let&apos;s work together to rehabilitate and enhance your natural environment. Schedule a consultation to discuss your ecological restoration needs.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-900 hover:bg-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Animation Keyframes */}
      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .delay-150 { animation-delay: 1.5s; }
        .delay-200 { animation-delay: 2s; }
        .delay-300 { animation-delay: 3s; }
        .delay-400 { animation-delay: 4s; }
        .delay-450 { animation-delay: 4.5s; }
      `}</style>
    </main>
  )
} 