'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Building2 } from 'lucide-react'

const organizations = [
  { name: 'Partner 1', logo: '/images/partners/partner1.png' },
  { name: 'Partner 2', logo: '/images/partners/partner2.png' },
  { name: 'Partner 3', logo: '/images/partners/partner3.png' },
  { name: 'Partner 4', logo: '/images/partners/partner4.png' },
  { name: 'Partner 5', logo: '/images/partners/partner5.png' },
  { name: 'Partner 6', logo: '/images/partners/partner6.png' },
  { name: 'Partner 7', logo: '/images/partners/partner7.png' },
  { name: 'Partner 8', logo: '/images/partners/partner8.png' },
  { name: 'Partner 9', logo: '/images/partners/partner9.png' },
  { name: 'Partner 10', logo: '/images/partners/partner10.png' },
]

export default function TrustedOrganizations() {
  return (
    <section className="py-16 bg-white">
      <div className="container-fluid mx-auto px-4 max-w-[2000px]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
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
                  <Building2 className="w-4 h-4 text-[#2E7D32]" />
                </motion.div>
                <span className="text-[#2E7D32] text-sm font-medium">Our Partners</span>
              </div>
            </div>
          </motion.div>
          <h2 className="text-4xl font-bold mb-4 text-[#1A1C1B] mt-6">
            Our <span className="text-[#2E7D32]">Partners</span>
          </h2>
          <p className="text-xl text-[#2C302E] max-w-2xl mx-auto">
            We are proud to partner with renowned companies and institutions committed to sustainability.
          </p>
        </motion.div>

        {/* Partners Scroll */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="flex py-4 px-4">
            <motion.div
              className="flex gap-8 items-center"
              animate={{
                x: [0, -((180 + 32) * organizations.length)]  // Width of each logo (180px) + gap (32px)
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  duration: 30,
                  ease: "linear",
                },
              }}
              style={{
                width: "max-content",
                paddingLeft: '2rem',
                paddingRight: '2rem',
              }}
            >
              {/* First set of logos */}
              {organizations.map((org, index) => (
                <div 
                  key={`${org.name}-${index}`}
                  className="flex-shrink-0 w-[180px] h-[100px] relative grayscale hover:grayscale-0 transition-all duration-300 
                           bg-white rounded-lg shadow-md hover:shadow-xl p-5 group hover:-translate-y-2
                           border border-gray-100 hover:border-green-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <Image
                    src={org.logo}
                    alt={org.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="200px"
                  />
                </div>
              ))}

              {/* Second set for seamless loop */}
              {organizations.map((org, index) => (
                <div 
                  key={`${org.name}-${index}-dup`}
                  className="flex-shrink-0 w-[180px] h-[100px] relative grayscale hover:grayscale-0 transition-all duration-300 
                           bg-white rounded-lg shadow-md hover:shadow-xl p-5 group hover:-translate-y-2
                           border border-gray-100 hover:border-green-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <Image
                    src={org.logo}
                    alt={org.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="200px"
                  />
                </div>
              ))}

              {/* Third set for extra smoothness */}
              {organizations.map((org, index) => (
                <div 
                  key={`${org.name}-${index}-tri`}
                  className="flex-shrink-0 w-[180px] h-[100px] relative grayscale hover:grayscale-0 transition-all duration-300 
                           bg-white rounded-lg shadow-md hover:shadow-xl p-5 group hover:-translate-y-2
                           border border-gray-100 hover:border-green-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/0 to-green-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  <Image
                    src={org.logo}
                    alt={org.name}
                    fill
                    className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    sizes="200px"
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
} 