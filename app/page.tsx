'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Leaf, Globe, Sprout, Brain, TreePine, Flower2, Wind, Droplets, Sun, Trees } from 'lucide-react'
import TrustedOrganizations from '@/components/TrustedOrganizations'
import Testimonials from '@/components/Testimonials'
import ServicesSection from '@/components/ServicesSection'
import CTASection from '@/components/CTASection'
import WhyChooseUs from '@/components/WhyChooseUs'

const headingVariants = [
  {
    line1: "Sustainable Solutions",
    line2: "for a",
    line3: "Better Tomorrow",
    subheading: "Leading environmental consulting firm specializing in sustainability solutions, biodiversity conservation, and ecological services."
  },
  {
    line1: "Environmental",
    line2: "Innovation for",
    line3: "Future Growth",
    subheading: "Pioneering sustainable practices and innovative solutions for businesses committed to environmental stewardship."
  },
  {
    line1: "Conservation",
    line2: "Strategies for",
    line3: "Global Impact",
    subheading: "Empowering organizations with expert guidance in biodiversity preservation and ecological restoration."
  }
]

export default function Home() {
  const [currentHeading, setCurrentHeading] = useState(0)
  const partnerLogoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeading((prev) => (prev + 1) % headingVariants.length)
    }, 5000) // Changed to 5 seconds for better readability

    return () => clearInterval(interval)
  }, [])

  // Add this function to handle the smooth infinite scroll
  const handleScroll = () => {
    if (partnerLogoRef.current) {
      const scrollLeft = partnerLogoRef.current.scrollLeft
      const maxScrollLeft = partnerLogoRef.current.scrollWidth - partnerLogoRef.current.clientWidth

      if (scrollLeft === 0) {
        partnerLogoRef.current.scrollLeft = maxScrollLeft
      } else {
        partnerLogoRef.current.scrollLeft = 0
      }
    }
  }

  useEffect(() => {
    const interval = setInterval(handleScroll, 3000) // Adjust the scroll interval as needed

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/Hero-banner.jpeg"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl ml-0 sm:ml-8 md:ml-12"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentHeading}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                  <motion.div 
                    className="flex flex-col gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="text-white"
                    >
                      {headingVariants[currentHeading].line1}
                    </motion.span>
                    <div className="flex flex-col gap-1">
                      <motion.span 
                        className="text-4xl md:text-5xl lg:text-6xl text-[#A8C6A1] font-medium"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                      >
                        {headingVariants[currentHeading].line2}
                      </motion.span>
                      <motion.span 
                        className="text-5xl md:text-6xl lg:text-7xl text-[#A8C6A1] drop-shadow-lg"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        {headingVariants[currentHeading].line3}
                      </motion.span>
                    </div>
                  </motion.div>
                </h1>
                <motion.p 
                  className="text-lg md:text-xl lg:text-2xl mt-6 mb-8 text-neutral-100 max-w-xl font-light leading-relaxed drop-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  {headingVariants[currentHeading].subheading}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link 
                href="/contact"
                className="px-8 py-4 bg-[#1B5E20] hover:bg-[#2E7D32] rounded-full text-white font-semibold transition-all flex items-center justify-center gap-2 group w-fit hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="text-base">Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="px-8 py-4 bg-white/15 hover:bg-white/25 rounded-full text-white font-semibold backdrop-blur-sm transition-all w-fit hover:scale-105 shadow-lg hover:shadow-xl border border-white/20 hover:border-white/30"
              >
                <span className="text-base">Explore Services</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAF9] via-white to-[#F8FAF9]" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-[#2E7D32]/5 via-[#2E7D32]/3 to-[#2E7D32]/5 rounded-r-[100px] transform -translate-x-1/3 overflow-hidden backdrop-blur-[1px]">
          {/* Pattern Container */}
          <div className="absolute inset-0">
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent mix-blend-soft-light" />
            
            {/* Enhanced Dots Pattern */}
            <div className="absolute inset-0">
              {/* Larger dots */}
              <div className="absolute inset-0 grid grid-cols-12 gap-8 opacity-[0.08]">
                {Array.from({ length: 144 }).map((_, index) => (
                  <div key={index} className="w-1 h-1 rounded-full bg-[#2E7D32] drop-shadow-[0_0_1px_rgba(46,125,50,0.1)]" />
                ))}
              </div>
              {/* Smaller dots for added depth */}
              <div className="absolute inset-0 grid grid-cols-[repeat(24,1fr)] gap-4 opacity-[0.05]">
                {Array.from({ length: 288 }).map((_, index) => (
                  <div key={`small-${index}`} className="w-0.5 h-0.5 rounded-full bg-[#2E7D32]" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Mission Content */}
            <div className="space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <motion.div 
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="inline-block"
                >
                  <div className="px-4 py-1 bg-[#2E7D32]/5 backdrop-blur-sm border border-[#2E7D32]/20 rounded-full shadow-sm hover:shadow transition-all duration-300">
                    <div className="inline-flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <Sprout className="w-4 h-4 text-[#2E7D32]" />
                      </motion.div>
                      <span className="text-[#2E7D32] text-sm font-medium">Our Journey</span>
                    </div>
                  </div>
                </motion.div>
                <div className="mt-6 relative">
                  <h2 className="text-5xl font-bold text-[#1A1C1B] mb-4">
                    Our <span className="text-[#2E7D32]">Mission</span>
                  </h2>
                </div>
                <p className="text-xl text-[#2C302E] max-w-xl leading-relaxed">
                  Pioneering sustainable practices and innovative environmental solutions for a better tomorrow.
                </p>
              </motion.div>

              <div className="space-y-16">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative pl-12 group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 p-2 bg-[#2E7D32]/10 rounded-full group-hover:bg-[#2E7D32]/20 transition-all duration-300">
                    <Leaf className="w-6 h-6 text-[#2E7D32] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1A1C1B] mb-3 group-hover:text-[#2E7D32] transition-colors duration-300">
                    Sustainable Solutions Development
                  </h3>
                  <p className="text-[#2C302E] leading-relaxed text-lg">
                    Crafting innovative environmental strategies that seamlessly integrate with your business operations.
                  </p>
                  <div className="absolute left-3 top-14 h-24 w-px bg-gradient-to-b from-[#2E7D32] to-transparent group-hover:h-28 transition-all duration-300" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative pl-12 group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 p-2 bg-[#2E7D32]/10 rounded-full group-hover:bg-[#2E7D32]/20 transition-all duration-300">
                    <Globe className="w-6 h-6 text-[#2E7D32] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1A1C1B] mb-3 group-hover:text-[#2E7D32] transition-colors duration-300">
                    Global Environmental Impact
                  </h3>
                  <p className="text-[#2C302E] leading-relaxed text-lg">
                    Leveraging advanced technologies and methodologies to create measurable positive impact on our planet.
                  </p>
                  <div className="absolute left-3 top-14 h-24 w-px bg-gradient-to-b from-[#2E7D32] to-transparent group-hover:h-28 transition-all duration-300" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="relative pl-12 group hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="absolute left-0 top-0 p-2 bg-[#2E7D32]/10 rounded-full group-hover:bg-[#2E7D32]/20 transition-all duration-300">
                    <Brain className="w-6 h-6 text-[#2E7D32] group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-semibold text-[#1A1C1B] mb-3 group-hover:text-[#2E7D32] transition-colors duration-300">
                    Expert Environmental Planning
                  </h3>
                  <p className="text-[#2C302E] leading-relaxed text-lg">
                    Comprehensive environmental consulting backed by data-driven insights and industry expertise.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Right side - Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[650px] rounded-[2.5rem] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2E7D32]/0 to-[#2E7D32]/5 opacity-0 transition-all duration-500" />
              <Image
                src="/images/mission-hand.jpg"
                alt="Environmental Mission"
                fill
                className="object-contain p-1"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F8FAF9] via-white to-[#F8FAF9]" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-[#2E7D32]/5 via-[#2E7D32]/3 to-[#2E7D32]/5 rounded-l-[100px] transform translate-x-1/3 overflow-hidden backdrop-blur-[1px]">
          {/* Pattern Container */}
          <div className="absolute inset-0">
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent mix-blend-soft-light" />
            
            {/* Icons Container with Enhanced Styling */}
            <div className="absolute inset-0 opacity-[0.17] mix-blend-multiply">
              {/* First Row */}
              <div className="absolute top-12 left-1/4 transform hover:scale-110 transition-transform duration-1000">
                <TreePine className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-16 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Flower2 className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-20 right-1/4 transform hover:scale-110 transition-transform duration-1000">
                <Globe className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>

              {/* Second Row */}
              <div className="absolute top-1/4 left-1/3 transform hover:scale-110 transition-transform duration-1000">
                <Wind className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-1/4 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Droplets className="w-8 h-8 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-1/4 right-1/3 transform hover:scale-110 transition-transform duration-1000">
                <Sun className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>

              {/* Third Row */}
              <div className="absolute top-1/2 left-1/4 transform hover:scale-110 transition-transform duration-1000">
                <Trees className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Leaf className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-1/2 right-1/4 transform hover:scale-110 transition-transform duration-1000">
                <Sprout className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>

              {/* Fourth Row */}
              <div className="absolute bottom-1/4 left-1/3 transform hover:scale-110 transition-transform duration-1000">
                <Globe className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute bottom-1/4 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <TreePine className="w-8 h-8 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute bottom-1/4 right-1/3 transform hover:scale-110 transition-transform duration-1000">
                <Flower2 className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>

              {/* Fifth Row */}
              <div className="absolute bottom-20 left-1/4 transform hover:scale-110 transition-transform duration-1000">
                <Sun className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute bottom-24 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Wind className="w-12 h-12 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute bottom-16 right-1/4 transform hover:scale-110 transition-transform duration-1000">
                <Trees className="w-10 h-10 text-[#2E7D32] drop-shadow-sm" />
              </div>

              {/* Additional Scattered Icons */}
              <div className="absolute top-1/3 right-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Brain className="w-8 h-8 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute bottom-1/3 left-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Droplets className="w-6 h-6 text-[#2E7D32] drop-shadow-sm" />
              </div>
              <div className="absolute top-2/3 right-1/2 transform hover:scale-110 transition-transform duration-1000">
                <Leaf className="w-8 h-8 text-[#2E7D32] drop-shadow-sm" />
              </div>
            </div>

            {/* Enhanced Dots Pattern */}
            <div className="absolute inset-0">
              {/* Larger dots */}
              <div className="absolute inset-0 grid grid-cols-12 gap-8 opacity-[0.08]">
                {Array.from({ length: 144 }).map((_, index) => (
                  <div key={index} className="w-1 h-1 rounded-full bg-[#2E7D32] drop-shadow-[0_0_1px_rgba(46,125,50,0.1)]" />
                ))}
              </div>
              {/* Smaller dots for added depth */}
              <div className="absolute inset-0 grid grid-cols-[repeat(24,1fr)] gap-4 opacity-[0.05]">
                {Array.from({ length: 288 }).map((_, index) => (
                  <div key={`small-${index}`} className="w-0.5 h-0.5 rounded-full bg-[#2E7D32]" />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Image */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative h-[610px] rounded-[2.5rem] overflow-hidden"
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{
                  duration: 120,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "loop"
                }}
                className="w-full h-full"
              >
                <Image
                  src="/images/vision-image.jpg"
                  alt="Environmental Vision"
                  fill
                  className="object-contain p-1"
                />
              </motion.div>
            </motion.div>

            {/* Right side - Vision Content */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <motion.div 
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  className="inline-block"
                >
                  <div className="px-4 py-1 bg-[#2E7D32]/5 backdrop-blur-sm border border-[#2E7D32]/20 rounded-full shadow-sm hover:shadow transition-all duration-300">
                    <div className="inline-flex items-center gap-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                      >
                        <TreePine className="w-4 h-4 text-[#2E7D32]" />
                      </motion.div>
                      <span className="text-[#2E7D32] text-sm font-medium">Our Purpose</span>
                    </div>
                  </div>
                </motion.div>
                <h2 className="text-4xl font-bold text-[#1A1C1B] mt-6">
                  Our <span className="text-[#2E7D32]">Vision</span>
                </h2>
                <p className="text-lg text-[#2C302E] max-w-xl">
                  Shaping a sustainable future through innovative environmental solutions and conservation excellence.
                </p>
              </motion.div>

              <div className="space-y-6">
                {[
                  {
                    icon: <Sprout className="w-6 h-6 text-[#2E7D32]" />,
                    title: "Pioneering Sustainable Solutions",
                    description: "Leading the way in environmental consulting with innovative approaches to sustainability challenges."
                  },
                  {
                    icon: <Globe className="w-6 h-6 text-[#2E7D32]" />,
                    title: "Global Environmental Impact",
                    description: "Creating lasting positive change through strategic environmental initiatives and conservation efforts worldwide."
                  },
                  {
                    icon: <Brain className="w-6 h-6 text-[#2E7D32]" />,
                    title: "Future-Forward Thinking",
                    description: "Developing cutting-edge solutions that address both current and emerging environmental challenges."
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-[#2E7D32]/20 hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <motion.div 
                        className="p-3 rounded-2xl bg-[#2E7D32]/10 group-hover:bg-[#2E7D32]/20 transition-colors duration-500"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {item.icon}
                      </motion.div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3 text-[#1A1C1B] group-hover:text-[#2E7D32] transition-colors duration-300">
                          {item.title}
                        </h3>
                        <p className="text-[#2C302E] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Trusted Organizations Section */}
      <TrustedOrganizations />

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* CTA Section */}
      <CTASection />
    </main>
  )
}
