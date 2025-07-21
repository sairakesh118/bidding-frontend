'use client';

import AppJsonLd from '../components/AppJsonLd';
import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Clock, 
  Send, 
  ChevronDown,
  CheckCircle,
  Star,
  ArrowRight,
  Video,
  MessageCircle,
  FileText,
  Shield,
  BarChart2,
  CheckCheck,
  Sparkles,
  BarChart3,
  Zap,
  ChevronRight,
  Check,
  Play,
  Bell,
  Settings,
  Building2,
  HeadphonesIcon,
  Gavel,
  TrendingUp,
  Headphones,
  Upload,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../components/navigationmenu"
import Navbar from './navbar';

const ParallaxBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-30">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/5 w-72 h-72 rounded-full bg-blue-300 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-blue-300 blur-3xl"></div>
      </div>
    </div>
  );
};


const StepCard = ({ step, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ["start end", "end start"]
    });
  
    const opacity = useTransform(
      scrollYProgress, 
      [0, 0.2, 0.8, 1], 
      [0.3, 1, 1, 0.3]
    );
  
    const scale = useTransform(
      scrollYProgress, 
      [0, 0.2, 0.8, 1], 
      [0.9, 1, 1, 0.9]
    );
  
    const translateX = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [index % 2 === 0 ? -70 : 70, 0, 0, index % 2 === 0 ? 70 : -70]
    );
  
    const rotate = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [index % 2 === 0 ? -3 : 3, 0, 0, index % 2 === 0 ? 3 : -3]
    );
  
    return (
      <motion.div 
        ref={ref}
        style={{ 
          opacity, 
          scale, 
          translateX,
          rotate
        }}
        className={`
          relative flex items-center w-full my-20
          ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}
        `}
      >
        <motion.div 
          className="absolute -left-16 md:-left-24 top-1/2 transform -translate-y-1/2 z-10"
          whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0], transition: { duration: 0.5 } }}
        >
          <div className="
            w-14 h-14 rounded-full 
            bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 
            flex items-center justify-center 
            text-xl font-bold 
            border-4 border-white 
            shadow-xl
          ">
            {step.number}
          </div>
        </motion.div>
        <div className="
          w-full md:w-4/6 
          bg-white 
          rounded-2xl 
          shadow-xl 
          p-4
          border-l-4 
          border-blue-500
          hover:shadow-2xl
          transition-all
          duration-300
          backdrop-blur-sm
          bg-opacity-90
        gap-2 flex flex-col">
          <div className="flex items-center gap-1">
            <div className="p-3 rounded-full bg-blue-50 mr-4">
              {step.icon}
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-600 text-transparent bg-clip-text">
              {step.title}
            </h3>
          </div>
          <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
          <div className="flex items-center text-blue-600 font-semibold">
            <CheckCircle className="mr-2" />
            <span className="bg-blue-50 px-3 py-1 rounded-full">{step.benefit}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  const FeatureCard = ({ feature, index, isActive, setActiveFeature }) => {
    const colors = {
      green: { light: 'bg-green-50', border: 'border-green-300', shadow: 'shadow-green-200/50' },
      emerald: { light: 'bg-emerald-50', border: 'border-emerald-300', shadow: 'shadow-emerald-200/50' },
      teal: { light: 'bg-teal-50', border: 'border-teal-300', shadow: 'shadow-teal-200/50' },
      lime: { light: 'bg-lime-50', border: 'border-lime-300', shadow: 'shadow-lime-200/50' },
      yellow: { light: 'bg-yellow-50', border: 'border-yellow-300', shadow: 'shadow-yellow-200/50' },
      cyan: { light: 'bg-cyan-50', border: 'border-cyan-300', shadow: 'shadow-cyan-200/50' },
      blue: { light: 'bg-blue-50', border: 'border-blue-300', shadow: 'shadow-blue-200/50' }
    };
    
    return (
      <motion.div 
        className={`
          p-3 rounded-2xl border-2 transition-all duration-300
          ${isActive 
            ? `bg-white shadow-2xl ${colors[feature.color].border} ${colors[feature.color].shadow}` 
            : 'bg-gray-50 border-transparent'}
          hover:bg-white hover:shadow-2xl
        `}
        onMouseEnter={() => setActiveFeature(index)}
        onMouseLeave={() => setActiveFeature(null)}
        whileHover={{ y: -10 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <div className={`flex items-center mb-6`}>
          <div className={`p-4 rounded-xl ${colors[feature.color].light} mr-4`}>
            {feature.icon}
          </div>
          <h3 className="text-xl font-bold">{feature.title}</h3>
        </div>
        <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
        <div className="mt-4 flex items-center text-green-600">
          <div className="bg-green-50 p-1 rounded-full mr-2">
            <CheckCheck className="w-5 h-5" />
          </div>
          <span className="font-medium">Verified Feature</span>
        </div>
      </motion.div>
    );
  };
  
  const TestimonialCard = ({ testimonial, index }) => {
    return (
      <motion.div
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.5 }}
        whileHover={{ 
          scale: 1.02, 
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
      >

        <div className={`h-1.5 ${testimonial.rating >= 5 ? 'bg-gradient-to-r from-blue-400 to-blue-500' : 'bg-gradient-to-r from-blue-400 to-blue-400'}`} />
        
        <div className="p-6">
          <div className="flex mb-5">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 + i * 0.1 }}
              >
                <Star 
                  className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-200'}`} 
                  fill={i < testimonial.rating ? '#facc15' : '#e5e7eb'} 
                />
              </motion.div>
            ))}
            
            {testimonial.rating === 5 && (
              <motion.div 
                className="ml-2 flex items-center text-blue-600 text-xs font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.6 }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </motion.div>
            )}
          </div>
          
          <div className="relative mb-8">
            <div className="absolute -top-4 -left-2 text-blue-100 text-5xl font-serif">"</div>
            <p className="text-gray-700 text-lg leading-relaxed pt-2 pl-4 relative z-10">
              {testimonial.quote}
            </p>
            <div className="absolute -bottom-4 -right-2 text-blue-100 text-5xl font-serif">"</div>
          </div>
          <div className="flex items-center">
            <div className="relative mr-4">
              {testimonial.avatar ? (
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow">
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div className="absolute -right-1 bottom-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
              <div className="flex items-center text-gray-500 text-sm">
                <span>{testimonial.role}</span>
                {testimonial.company && (
                  <>
                    <div className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                    <span>{testimonial.company}</span>
                  </>
                )}
              </div>
            </div>
            {testimonial.date && (
              <div className="ml-auto text-xs text-gray-400">
                {testimonial.date}
              </div>
            )}
          </div>
        </div>
        
        {testimonial.tags && testimonial.tags.length > 0 && (
          <div className="px-6 pb-4 flex flex-wrap gap-2">
            {testimonial.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
      </motion.div>
    );
  };
  

  const ScrollIndicator = () => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    
    useEffect(() => {
      const handleScroll = () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        setScrollPercentage(scrolled);
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return (
      <div className="fixed top-0 left-0 w-full h-1 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"
          style={{ width: `${scrollPercentage}%` }}
        ></div>
      </div>
    );
  };
  
const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(null);
  const [openFAQ, setOpenFAQ] = useState(null);
  const navigate=useNavigate();

  const features = [
  {
    icon: <FileText className="w-10 h-10 text-green-600" />,
    title: "Easy Item Listings",
    description: "Upload and manage auction items with bulk CSV imports, simplifying setup for sellers and admins.",
    color: "green"
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-emerald-600" />,
    title: "Real-Time Notifications",
    description: "Instantly alert bidders of outbids, auction starts, and results via email or in-app messaging.",
    color: "emerald"
  },
  {
    icon: <Calendar className="w-10 h-10 text-teal-600" />,
    title: "Scheduled Auctions",
    description: "Set start and end times for auctions to automate launches and ensure timely closings.",
    color: "teal"
  },
  {
    icon: <Clock className="w-10 h-10 text-lime-600" />,
    title: "Auto-Bid & Smart Extensions",
    description: "Enable proxy bidding and extend auctions automatically when last-minute bids occur.",
    color: "lime"
  },
  {
    icon: <Send className="w-10 h-10 text-yellow-600" />,
    title: "Secure Payment Integration",
    description: "Seamlessly process transactions with trusted gateways, ensuring secure and smooth checkouts.",
    color: "yellow"
  },
  {
    icon: <Users className="w-10 h-10 text-cyan-600" />,
    title: "Multi-Role User Access",
    description: "Support admins, bidders, and sellers with custom permissions and dashboard controls.",
    color: "cyan"
  },
  {
    icon: <BarChart2 className="w-10 h-10 text-blue-600" />,
    title: "Advanced Bid Analytics",
    description: "Gain insights into bidding trends, top users, and item performance with real-time reporting.",
    color: "blue"
  },
  {
    icon: <Shield className="w-10 h-10 text-green-600" />,
    title: "Robust Security & Compliance",
    description: "Protect bidder data with encryption, 2FA, and secure access that meets industry regulations.",
    color: "green"
  }
];


  const steps = [
  {
    number: "1",
    title: "List Your Product",
    description: "Upload your item details, set a starting bid, and schedule the auction time with ease.",
    benefit: "Easy & Fast Listing",
    icon: <Upload className="w-6 h-6 text-green-600" />
  },
  {
    number: "2",
    title: "Bidders Join the Auction",
    description: "Buyers browse live listings and place bids in real-time with live updates and notifications.",
    benefit: "Real-Time Competition",
    icon: <Users className="w-6 h-6 text-emerald-600" />
  },
  {
    number: "3",
    title: "Highest Bid Wins",
    description: "At auction close, the highest bidder secures the product and is notified instantly.",
    benefit: "Fair & Transparent",
    icon: <TrendingUp className="w-6 h-6 text-yellow-600" />
  },
  {
    number: "4",
    title: "Secure Checkout & Delivery",
    description: "Winner completes secure payment and coordinates delivery — tracked through your dashboard.",
    benefit: "Safe Transactions",
    icon: <ShieldCheck className="w-6 h-6 text-blue-600" />
  },
  {
    number: "5",
    title: "Leaderboard & Insights",
    description: "View top bidders, most active items, and your auction performance on the dynamic leaderboard.",
    benefit: "Engagement & Recognition",
    icon: <BarChart2 className="w-6 h-6 text-purple-600" />
  }
];


  const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Small Business Owner",
    quote: "This bidding platform is a game-changer! Listing products is super simple, and I got 3x more visibility compared to other platforms.",
    rating: 5
  },
  {
    name: "Rajeev Menon",
    role: "Frequent Bidder",
    quote: "I love the real-time updates and clean UI. Placing bids is quick, and the leaderboard adds a fun competitive twist!",
    rating: 5
  },
  {
    name: "Divya Kapoor",
    role: "Art Seller",
    quote: "The auction scheduling and secure payments make selling high-value art stress-free. I’ve seen a 60% increase in conversions!",
    rating: 4
  },
  {
    name: "Amit Joshi",
    role: "Collector",
    quote: "The platform’s transparency and auto-bid feature are excellent. I won 4 auctions last month — smooth experience end to end.",
    rating: 5
  }
];


  const heroRef = useRef(null);
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroOpacity = useTransform(
    heroScrollProgress, 
    [0, 1], 
    [1, 0]
  );
  
  const heroTranslateY = useTransform(
    heroScrollProgress, 
    [0, 1], 
    [0, 100]
  );

  const faqs = [
  {
    question: "How do I list a product for auction?",
    answer: "You can list a product by filling out a simple form with item details, setting a starting bid, and choosing the auction duration. Bulk upload via CSV is also supported for power sellers."
  },
  {
    question: "Is bidding in real-time?",
    answer: "Yes, all auctions are conducted in real-time. You'll see live bid updates, and notifications are sent for each outbid, win, or major event."
  },
  {
    question: "What happens when I win an auction?",
    answer: "When you win, you’ll receive a confirmation and be redirected to a secure checkout page to complete your payment. The seller will then prepare your item for delivery."
  },
  {
    question: "Is my payment and personal data secure?",
    answer: "Absolutely. Our platform uses bank-level encryption, secure payment gateways, and two-factor authentication to keep your data safe and compliant with regulations."
  },
  {
    question: "Can I track the performance of my listings?",
    answer: "Yes, our dashboard offers detailed analytics on bids, views, and conversions so you can optimize your listings and maximize results."
  },
  {
    question: "What if someone places a last-second bid?",
    answer: "We use smart auction extensions to prevent sniping. If a bid is placed near the end, the auction time is automatically extended to ensure fairness."
  },
  {
    question: "Can multiple users manage the same seller account?",
    answer: "Yes, we support multi-user access with role-based permissions, making it easy for teams to collaborate on auction management."
  }
];

  const FAQItem = ({ faq, isOpen, toggleFAQ }) => {
    return (
      <motion.div 
        className="border-b border-gray-200 py-5 w-full flex flex-col justify-center"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <button 
          className="flex justify-between items-center w-full text-left focus:outline-none"
          onClick={toggleFAQ}
        >
          <h4 className="text-xl font-medium text-gray-900">{faq.question}</h4>
          <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            <ChevronDown className="text-blue-500" />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="pt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <>
      <AppJsonLd 
        app={{
            name: "QFLOO WhatsApp Manager",
            description: "Effortless bulk messaging and customer engagement platform for WhatsApp Business users.",
            rating: 4.8,
            users: 3500
          }} 
      />
      <div className='relative mb-10'>
        <Navbar />
       </div>
      <div className="bg-gradient-to-b from-gray-50 to-white">
       
        <ScrollIndicator />
        <ParallaxBackground />
         <div className="bg-gradient-to-br from-white via-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <div className="bg-blue-600 rounded-xl p-4 mb-10 flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-white text-blue-600 p-1 rounded mr-3">
              <Zap className="w-4 h-4" />
            </span>
            <p className="text-white text-sm font-medium">
              Special launch offer: Get 30% off your first 3 months!
            </p>
          </div>
          <button className="text-white text-sm hover:underline flex items-center">
            Learn more <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1.5 rounded-full">
                <span className="bg-blue-600 rounded-full p-1">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-blue-800 text-sm font-medium">
                  #1 Smart Bidding Platform
                </span>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight">
                <span className="block">Win More Bids with</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
                  BidMaster Pro
                </span>
              </h1>
              
              <p className="text-gray-600 text-lg max-w-lg">
                Advanced bidding platform with real-time analytics, automated strategies, and intelligent market insights to maximize your winning potential across all auctions.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => navigate("/auth")} className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-100/50">
                Start Bidding <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
            
          </div>
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-full h-full">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70" />
                <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-100 rounded-full blur-2xl opacity-70" />
              </div>
              <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
                <img src="./landingpageimage.jpg" alt="BidMaster Pro" className="w-full h-full object-cover" />
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6"
              >
                <div className="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Smart Bidding</p>
                    <p className="text-xs text-gray-500">AI-powered strategies</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute -top-6 -right-6"
              >
                <div className="bg-white shadow-lg rounded-xl p-3 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Real-time Analytics</p>
                    <p className="text-xs text-gray-500">Live market insights</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16"
        >
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "5,200+", label: "Active Bidders", icon: <Users className="w-5 h-5 text-blue-600" /> },
                { value: "2.3M+", label: "Successful Bids", icon: <Gavel className="w-5 h-5 text-indigo-600" /> },
                { value: "87.3%", label: "Average Win Rate", icon: <TrendingUp className="w-5 h-5 text-green-600" /> },
                { value: "24/7", label: "Market Monitoring", icon: <Headphones className="w-5 h-5 text-purple-600" /> }
              ].map((stat, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
        <div className="container mx-auto px-4 py-14">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-semibold mb-4 text-sm">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
            Effortless Customer Messaging, <span className="bg-gradient-to-r from-indigo-600 to-blue-600 text-transparent bg-clip-text"> Automated for Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
             Reach your customers instantly with AI-powered WhatsApp automation. Send bulk messages, schedule promotions, and engage customers effortlessly—all in one powerful tool. 🚀
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                feature={feature}
                index={index}
                isActive={activeFeature === index}
                setActiveFeature={setActiveFeature}
              />
            ))}
          </div>
        </div>

        <div className=" bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 -z-10 opacity-20"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.2"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            }}
          />
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center "
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold  text-sm">
                SIMPLIFIED PROCESS
              </span>
              <h2 className="text-4xl md:text-4xl font-bold text-gray-900 ">
                How <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">QFLOO WhatsApp Manager Works</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A Simple, Intuitive Process That Transforms Messaging into a Seamless Experience.
              </p>
            </motion.div>
            <div className="relative max-w-5xl mx-auto pl-16 md:pl-24">
      
              <motion.div 
                className="absolute top-0 bottom-0 left-0 md:left-8 w-1 bg-gradient-to-b from-blue-300 to-blue-600"
                initial={{ height: "0%" }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5 }}
              />

              {steps.map((step, index) => (
                <StepCard 
                  key={index} 
                  step={step} 
                  index={index} 
                />
              ))}
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-4 text-sm">
              SUCCESS STORIES
            </span>
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Customers Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses and professionals who have revolutionized customer engagement with Qfloo WhatsApp Manager. 🚀
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard 
                key={index}
                testimonial={testimonial}
                index={index}
              />
            ))}
          </div>
        </div>

        <div className=" ">
          <motion.div 
            className="text-center py-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Find answers to common questions about Qfloo WhatsApp Manager and discover how it can streamline your customer messaging and engagement.
            </p>
          </motion.div>
          <div className="max-w-6xl mx-auto">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                faq={faq}
                isOpen={openFAQ === index}
                toggleFAQ={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        
        </div>
      </div>
    </>
  );
};

export default LandingPage;

     