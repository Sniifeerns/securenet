import React from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NewsSection() {
  return (
    <section id="news" className="relative py-24 px-4">
      <div className="absolute inset-0 bg-[#0a0a0f]" />
      
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-orange-400 text-sm font-medium tracking-wider uppercase">Noticias</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            SecureNet Lab en <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">Medios</span>
          </h2>
        </motion.div>

        {/* News Card */}
        <motion.div
          className="relative group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900/80 to-gray-900/40 border border-gray-800 hover:border-orange-500/30 transition-all duration-500">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-8 items-center">
                {/* Icon/Image area */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                    <Newspaper className="w-16 h-16 text-orange-400" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-sm mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>27 Noviembre 2025</span>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Trabajando en el proyecto SecureNet Lab
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed mb-6">
                    Artículo destacado en el medio "Somos del Prieto" donde se presenta el desarrollo 
                    del proyecto SecureNet Lab, una infraestructura de red segura diseñada por el Grupo B 
                    como parte del proyecto de innovación del ciclo formativo.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <a
                      href="https://somosdelprieto.com/index.php/2025/11/27/trabajando-en-el-proyecto-securenet-lab/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="group/btn px-6 py-6 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40">
                        Leer Artículo Completo
                        <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                    
                    <a
                      href="https://somosdelprieto.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 hover:border-orange-500/50 text-gray-400 hover:text-orange-400 transition-all duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Visitar Medio
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 border border-orange-500/20 rounded-full" />
            <div className="absolute bottom-4 left-4 w-12 h-12 border border-red-500/20 rounded-full" />
          </div>
        </motion.div>

        {/* Additional info */}
        <motion.p
          className="text-center text-gray-500 mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          Cobertura mediática del proyecto en publicaciones educativas y tecnológicas
        </motion.p>
      </div>
    </section>
  );
}