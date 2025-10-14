import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Search, 
  Gavel, 
  Heart, 
  Eye, 
  Loader2, 
  TrendingUp,
  Star,
  Users,
  Timer,
  DollarSign,
  Zap,
  Award,
  Filter,
  SortDesc,
  ChevronRight,
  Sparkles,
  Trophy,
  Activity,
  Flame,
  ArrowUp,
  Crown,
  Diamond,
  Gem
} from "lucide-react";
import {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useSearchItemsQuery
} from "../redux/features/items/itemSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import NavbarHome from "./NavbarHome";
import { useSelector } from "react-redux";
import { useLiveBidding } from "../routes/useLiveBidding";

function BiddingItem( item ) {
  const { currentBid, placeBidAmount, error } = useLiveBidding(item);
  const username = useSelector((state) => state.auth.user.username);
  const [bidAmount, setBidAmount] = useState(null);

  const navigate = useNavigate();

  const asynchandleBid = (item) => {
    if (bidAmount && bidAmount > (currentBid || 0)) {
      try {
         placeBidAmount(username, bidAmount);
      } catch (error) {
        //console.error('Failed to place bid:', error);
        alert('Failed to place bid. Please try again.');
      }
    } else {
      alert(`Bid must be higher than current bid of $${(bidAmount || 0).toLocaleString()}`);
    } // example
  };

  return (
    <div className="space-y-2">
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={14} />
                    <Input
                      type="number"
                      placeholder={`Min: $${((item.current_bid || 0) + 1).toLocaleString()}`}
                      className="pl-8 h-8 border-2 border-gray-200 focus:border-blue-400 rounded-lg text-sm font-semibold bg-gray-50/50 hover:bg-white transition-all duration-300 focus:shadow-lg focus:shadow-blue-500/20"
                      value={ bidAmount || ''}
                      onChange={(e) => setBidAmount(e.target.value)}
                      min={(item.current_bid || 0) + 1}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => asynchandleBid(item)}
                      disabled={!bidAmount || parseFloat(bidAmount) <= (currentBid || 0)}
                      className="flex-1 h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Gavel className="w-3 h-3 mr-1" />
                      Bid
                    </Button>
                    
                    <Button
                      onClick={(item) => navigate(`/bids/${item}`)}
                      variant="outline"
                      className="h-8 px-2 border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
  );
}


const
 BiddingItemsPage = () => {
  const [search, setSearch] = useState("");
  const [timers, setTimers] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [bidAmounts, setBidAmounts] = useState({});
  const [sortBy, setSortBy] = useState("ending");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  // Fetch items from Redux
  const { data: items = [], isLoading, error } = useGetItemsQuery();
  const [updateItem] = useUpdateItemMutation();

  const username= useSelector((state) => state.auth.user.username);


  const handlebidcard = (id) => {
    navigate(`/bids/${id}`); 
  };

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Extract categories from items
  const categories = ["all", ...new Set(items.map(item => item.category).filter(Boolean))];

  // Robust date parsing function
  const parseEndTime = (endTime) => {
    try {
      if (!endTime) {
        //console.warn('No end_time provided');
        return new Date();
      }

      if (endTime instanceof Date) {
        return endTime;
      }
      
      if (typeof endTime === 'number') {
        const timestamp = endTime < 10000000000 ? endTime * 1000 : endTime;
        return new Date(timestamp);
      }
      
      if (typeof endTime === 'string') {
        let date = new Date(endTime);
        if (isNaN(date.getTime())) {
          date = new Date(endTime.replace(' ', 'T'));
        }
        if (isNaN(date.getTime())) {
          const isoString = endTime.includes('T') ? endTime : endTime.replace(' ', 'T');
          date = new Date(isoString);
        }
        return date;
      }
      
      return new Date(endTime);
    } catch (error) {
      //console.error('Error parsing date:', endTime, error);
      return new Date();
    }
  };

  // Filter and sort items
  const filteredItems = items
    .filter((item) => {
      const matchesSearch = !search.trim() || 
        item.name?.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "ending":
          return (timers[a._id || a.id] || 0) - (timers[b._id || b.id] || 0);
        case "price":
          return (b.current_bid || 0) - (a.current_bid || 0);
        case "bids":
          return (b.bid_history?.length || 0) - (a.bid_history?.length || 0);
        default:
          return 0;
      }
    });

  // Update timers every second
  useEffect(() => {
    if (!items.length) return;

    const updateTimers = () => {
      const updatedTimers = {};
      items.forEach((item) => {
        try {
          const endTimeUtc = parseEndTime(item.end_time);
          const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in ms
          const endTime = new Date(endTimeUtc.getTime() + istOffsetMs);
          
          if (isNaN(endTime.getTime())) {
            //console.error(`Invalid end_time for item ${item._id || item.id}:`, item.end_time);
            updatedTimers[item._id || item.id] = 0;
            return;
          }
          
          const now = new Date();
          const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000));
          updatedTimers[item._id || item.id] = timeLeft;
          
        } catch (error) {
          //console.error(`Error processing timer for item ${item._id || item.id}:`, error);
          updatedTimers[item._id || item.id] = 0;
        }
      });
      setTimers(updatedTimers);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [items]);

  const pad = (num) => num.toString().padStart(2, "0");

  const formatTime = (seconds) => {
    if (seconds <= 0) return "Auction Ended";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (days > 0) return `${days}d ${pad(hours)}h ${pad(minutes)}m`;
    if (hours > 0) return `${pad(hours)}h ${pad(minutes)}m ${pad(secs)}s`;
    return `${pad(minutes)}m ${pad(secs)}s`;
  };

  const getTimeStatus = (seconds) => {
    if (seconds <= 0) return "ended";
    if (seconds <= 3600) return "urgent";
    if (seconds <= 86400) return "soon";
    return "normal";
  };

  const toggleFavorite = (itemId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(itemId)) {
      newFavorites.delete(itemId);
    } else {
      newFavorites.add(itemId);
    }
    setFavorites(newFavorites);
  };

  const handleBidChange = (itemId, value) => {
    setBidAmounts(prev => ({
      ...prev,
      [itemId]: value
    }));
    //console.log(bidAmounts)
  };

  const placeBid = async (item) => {
    const itemId = item._id || item.id;

  const { currentBid, placeBidAmount, error: bidError } = useLiveBidding(itemId);
    const bidAmount = parseFloat(bidAmounts[itemId]);
    if (bidAmount && bidAmount > (currentBid || 0)) {
      try {
        await placeBidAmount(username, bidAmount);
      } catch (error) {
        //console.error('Failed to place bid:', error);
        alert('Failed to place bid. Please try again.');
      }
    } else {
      alert(`Bid must be higher than current bid of $${(item.current_bid || 0).toLocaleString()}`);
    }
  };

  const liveAuctions = filteredItems.filter(item => (timers[item.id] || 0) > 0).length;
  const completedAuctions = filteredItems.filter(item => (timers[item.id] || 0) <= 0).length;
  const endingSoon = filteredItems.filter(item => (timers[item.id] || 0) <= 3600 && (timers[item.id] || 0) > 0).length;

  // Loading state with enhanced animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden">
        
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)] opacity-30"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_80%_100px,#8b5cf6,transparent)] opacity-20"></div>
        </div>
        
        <div className="text-center z-10">
          <div className="relative mb-12">
            {/* Outer spinning ring */}
            <div className="w-32 h-32 border-4 border-white/10 rounded-full animate-spin">
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin"></div>
            </div>
            
            {/* Inner pulsing circle */}
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
            
            {/* Center icon with float animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-bounce">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-2xl shadow-blue-500/25">
                <Gavel className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Loading Elite Auctions
            </h2>
            <div className="flex items-center justify-center gap-2 text-white/70">
              <Sparkles className="w-5 h-5 animate-pulse" />
              <p className="text-lg">Discovering exceptional treasures...</p>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            
            {/* Loading progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[0, 1, 2].map((i) => (
                <div 
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-red-500/25 animate-pulse">
              <Zap className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-sm font-bold">!</span>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Connection Failed</h3>
            <p className="text-gray-600 mb-6">Unable to connect to auction servers</p>
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-600 text-sm font-mono">{error.message || JSON.stringify(error)}</p>
            </div>
            <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <ArrowUp className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <NavbarHome/>
      {/* Enhanced Hero Header with Parallax */}
      

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Enhanced Search and Filters */}
        <div className="relative">
      {/* Main Container with Enhanced Glass Effect */}
      <div className="relative bg-gradient-to-br from-white/95 via-white/90 to-white/85 backdrop-blur-2xl rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] p-10 mb-12 border border-white/60 overflow-hidden">
        
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(99 102 241) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10">
          {/* Header Section */}
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Zap className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Premium Auction Search
              </h2>
              <p className="text-gray-600 text-sm font-medium">Discover exclusive collectibles and luxury items</p>
            </div>
          </div>

          {/* Search and Filters Row */}
          <div className="flex flex-col xl:flex-row gap-6 mb-8">
            {/* Enhanced Search Input */}
            <div className="relative flex-1 group">
              {/* Search glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                  <Search 
                    className="text-gray-400 group-hover:text-blue-500 group-focus-within:text-blue-600 transition-all duration-300 group-focus-within:scale-110" 
                    size={24} 
                  />
                </div>
                <input
                  type="text"
                  placeholder="Search rare artifacts, luxury items, exclusive collectibles..."
                  className="w-full pl-16 pr-6 h-16 border-2 border-gray-200/80 focus:border-blue-500 rounded-2xl text-lg bg-white/70 backdrop-blur-sm placeholder:text-gray-400 font-medium shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-300 focus:scale-[1.02] outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                
                {/* Search highlight border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 -z-10 blur-sm"></div>
              </div>
            </div>

            {/* Enhanced Filter Controls */}
            <div className="flex gap-4">
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none px-6 py-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 bg-white/80 backdrop-blur-sm min-w-[180px] text-gray-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === "all" ? "🌟 All Categories" : ` ${category}`}
                      </option>
                    ))}
                  </select>
                  <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>

                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-6 py-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-blue-500 bg-white/80 backdrop-blur-sm min-w-[180px] text-gray-700 font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <option value="ending">Ending Soon</option>
                    <option value="price">Highest Bid</option>
                    <option value="bids">Most Popular</option>
                  </select>
                  <SortDesc className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
              </div>
          </div>

          {/* Enhanced Stats Section */}
          <div className="relative">
            {/* Divider with gradient */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Stats Cards */}
              <div className="flex flex-wrap gap-6">
                {[
                  { 
                    count: liveAuctions,
                    label: "Live Auctions", 
                    bgColor: "from-emerald-500 to-green-600",
                    textColor: "text-emerald-600",
                    icon: Clock,
                    pulse: true
                  },
                  { 
                    count: endingSoon,
                    label: "Ending Soon", 
                    bgColor: "from-red-500 to-pink-600",
                    textColor: "text-red-600",
                    icon: TrendingUp,
                    pulse: false
                  },
                  { 
                    count: completedAuctions,
                    label: "Completed", 
                    bgColor: "from-slate-500 to-gray-600",
                    textColor: "text-slate-600",
                    icon: Zap,
                    pulse: false
                  }
                ].map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div 
                      key={index} 
                      className="group relative bg-white/60 backdrop-blur-sm rounded-2xl p-4 pr-6 border border-white/80 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                    >
                      {/* Background gradient on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${stat.bgColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                      
                      <div className="relative flex items-center gap-3">
                        {/* Icon with gradient background */}
                        <div className={`p-2 rounded-xl bg-gradient-to-r ${stat.bgColor} shadow-lg ${stat.pulse ? 'animate-pulse' : ''}`}>
                          <IconComponent className="text-white" size={18} />
                        </div>
                        
                        <div className="flex flex-col">
                          <span className={`font-bold text-2xl ${stat.textColor} group-hover:scale-110 transition-transform duration-300`}>
                            {stat.count}
                          </span>
                          <span className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                            {stat.label}
                          </span>
                        </div>
                      </div>
                      
                      {/* Subtle shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    </div>
                  );
                })}
              </div>
              
              {/* Results Counter */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl px-6 py-3 border border-blue-100/50 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {filteredItems.length} Premium Items Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        {/* Enhanced Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {filteredItems.map((item, index) => {
    const itemId = item._id || item.id;
    const timeLeft = (timers[itemId] || 0) !== 0 ? timers[itemId] :  0;
    const isEnded = timeLeft <= 0;
    const bidCount = item.bid_history?.length || 0;
    const isUrgent = timeLeft <= 3600000; // 1 hour
    const isSoon = timeLeft <= 14400000; // 4 hours
    
    return (
      <Card 
        key={itemId} 
        className=" group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border-0 hover:scale-102 transform-gpu min-h-76"
        style={{ 
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          animationDelay: `${index * 100}ms`
        }}
      >
        <div className="flex h-full">
          {/* Enhanced Image Section - Left Side */}
          <div className="relative w-2/4   bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
            <img
              src={item.image_url || "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop"}
              alt={item.name || 'Auction Item'}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=300&h=200&fit=crop";
              }}
            />
            
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Enhanced Status Badge with glow */}
            {!isEnded && (
              <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm transition-all duration-300 ${
                isUrgent 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                  : isSoon 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
              }`}>
                {isUrgent ? '🔥 FINAL HOUR' : isSoon ? '⚡ ENDING SOON' : '✨ LIVE'}
              </div>
            )}
            
            {/* Enhanced Favorite Button */}
            <button
              onClick={() => toggleFavorite(itemId)}
              className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
            >
              <Heart 
                size={14} 
                className={`transition-all duration-300 ${
                  favorites.has(itemId) 
                    ? "text-red-500 fill-red-500 animate-pulse" 
                    : "text-gray-400 hover:text-red-400"
                }`} 
              />
            </button>

            {/* Bid count floating badge */}
            {bidCount > 0 && (
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                <Activity size={10} />
                <span>{bidCount}</span>
              </div>
            )}
          </div>

          {/* Enhanced Content Section - Right Side */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            {/* Top Section - Title and Timer */}
            <div className="space-y-2">
              {/* Title and Category */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-gray-900 text-base leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                    {item.name || 'Premium Auction Item'}
                  </h3>
                  {item.category && (
                    <span className="text-xs text-blue-700 bg-gradient-to-r from-blue-100 to-indigo-100 px-2 py-0.5 rounded-full font-semibold whitespace-nowrap border border-blue-200/50">
                      {item.category}
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Timer with better styling */}
              <div className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-300 ${
                isEnded 
                  ? 'bg-gray-50 border border-gray-200' 
                  : isUrgent 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border border-red-200' 
                  : isSoon 
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200' 
                  : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'
              }`}>
                <div className={`p-1 rounded-md ${
                  isEnded 
                    ? 'bg-gray-200 text-gray-500' 
                    : isUrgent 
                    ? 'bg-red-500 text-white' 
                    : isSoon 
                    ? 'bg-amber-500 text-white' 
                    : 'bg-emerald-500 text-white'
                }`}>
                  <Timer size={12} />
                </div>
                <div>
                  <div className="text-xs text-gray-600 font-medium">
                    {isEnded ? 'Ended' : 'Time Left'}
                  </div>
                  <div className={`text-sm font-bold ${
                    isEnded 
                      ? 'text-gray-500' 
                      : isUrgent 
                      ? 'text-red-600' 
                      : isSoon 
                      ? 'text-amber-600' 
                      : 'text-emerald-600'
                  }`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Section - Bid Info */}
            <div className="space-y-3">
              {/* Enhanced Current Bid Display */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 font-medium mb-1">Current Bid</div>
                    <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                      <DollarSign size={16} className="text-green-500" />
                      {(item.current_bid || 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-medium mb-1">Starting</div>
                    <div className="text-sm font-semibold text-gray-400">
                      ${(item.starting_bid || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Bid Section */}
              {!isEnded ? (
                <div className="space-y-2">
                  
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlebidcard(itemId)}
                      className="flex-1 h-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Gavel className="w-3 h-3 mr-1" />
                      Bid
                    </Button>
                    

                  </div>
                </div>
              ) : (
                <Button
                  onClick={() => handlebidcard(itemId)}
                  className="w-full h-8 bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View Results
                </Button>
              )}
            </div>

            {/* Bottom Section - Stats */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users size={10} />
                  <span className="font-medium">{bidCount} bidders</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {isUrgent && <Flame className="w-3 h-3 text-red-500 animate-pulse" />}
                {isSoon && !isUrgent && <Zap className="w-3 h-3 text-amber-500" />}
                {bidCount > 10 && <Trophy className="w-3 h-3 text-yellow-500" />}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  })}
</div>

        {/* Enhanced Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="relative mb-12">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <Search className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <h3 className="text-3xl font-bold text-gray-800 mb-4">No Auctions Found</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We couldn't find any auctions matching your criteria. Try adjusting your search or filters to discover more exceptional items.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Reset Filters
                </Button>
                
                <Button
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Browse All
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Footer CTA */}
        
      </div>

      {/* Enhanced CSS Animations */}
      
    </div>
  );
};

export default BiddingItemsPage;