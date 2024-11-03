// src/components/Features.js
import React from 'react';
import { motion } from 'framer-motion';
import { 
  CurrencyDollarIcon, 
  ShieldCheckIcon, 
  ChartBarIcon,
  TagIcon,
  UserGroupIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    title: '代幣質押機制',
    description: '透過質押代幣提升搶票成功率，實現公平分配機制',
    icon: CurrencyDollarIcon,
  },
  {
    title: 'NFT票券',
    description: '區塊鏈加密技術，確保票券真實性與唯一性',
    icon: TagIcon,
  },
  {
    title: '智能合約分配',
    description: '公開透明的票券分配流程，杜絕黑箱操作',
    icon: ShieldCheckIcon,
  },
  {
    title: '二次交易市場',
    description: '安全可靠的票券轉售平台，告別黃牛亂象',
    icon: ChartBarIcon,
  },
  {
    title: '身份驗證',
    description: '嚴格的身份驗證機制，確保交易安全',
    icon: UserGroupIcon,
  },
  {
    title: '全球流通',
    description: '跨境票務交易，連結全球粉絲',
    icon: GlobeAltIcon,
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              平台特色
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            創新科技，重塑票務生態
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm"
            >
              <feature.icon className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;