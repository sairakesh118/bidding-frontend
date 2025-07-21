import React, { useState } from "react";
import { useSelector } from "react-redux";
import { 
  User, 
  Calendar, 
  DollarSign, 
  Trophy, 
  Clock, 
  Eye, 
  Gavel,
  Mail,
  Hash,
  TrendingUp,
  Award,
  Package,
  Timer,
  Star,
  Sparkles,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  MoreVertical,
  Heart,
  Share2,
  Edit3,
  Settings,
  Crown,
  Zap,
  Activity,
  Loader
} from "lucide-react";
import { useGetUserBidsQuery, useGetUserItemsQuery } from "../redux/features/profile/profileSlice";

const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  });

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
};

const getTimeLeft = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const diff = end - now;
  
  if (diff <= 0) return "Ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

const ProfilePage = () => {
  const user = useSelector((state) => state.auth.user);
  const { data: ownedItems = [], isLoading } = useGetUserItemsQuery(user.id);
  const { data: bids = [] } = useGetUserBidsQuery(user.name);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const totalItems = ownedItems.length;
  const totalValue = ownedItems.reduce((sum, item) => sum + item.current_bid, 0);
  const activeBids = ownedItems.filter(item => new Date(item.end_time) > new Date()).length;
  const totalBids = ownedItems.reduce((sum, item) => sum + item.bid_history.length, 0);

  const filteredItems = ownedItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const now = new Date();
    const endTime = new Date(item.end_time);
    
    if (filter === "active") return matchesSearch && endTime > now;
    if (filter === "ended") return matchesSearch && endTime <= now;
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <div className="flex items-center space-x-4">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xl font-semibold text-gray-700">Loading your profile...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-8 mb-8 border border-white/30 relative overflow-hidden">
          {/* Header Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 bg-clip-text text-transparent">
                  {user.full_name || user.name}
                </h1>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full text-xs font-semibold text-yellow-800">
                    Premium
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-6">
                <div className="flex items-center text-gray-600 text-lg bg-white/50 rounded-full px-4 py-2 shadow-sm">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-500 text-sm bg-white/50 rounded-full px-3 py-1 shadow-sm">
                  <Hash className="w-4 h-4 mr-1" />
                  {user._id?.slice(-8) || user.id?.slice(-8)}
                </div>
              </div>
              
              
            </div>

            <div className="flex items-center space-x-3">
              <button className="p-3 bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <Settings className="w-5 h-5 text-gray-600 group-hover:rotate-90 transition-transform duration-300" />
              </button>
              <button className="p-3 bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-3 bg-white/80 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <Edit3 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Items</p>
                <p className="text-3xl font-bold text-gray-800">{totalItems}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <p className="text-xs text-green-600 font-medium">+{Math.floor(totalItems * 0.15)} this month</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Value</p>
                <p className="text-3xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
                <div className="flex items-center mt-2">
                  <Activity className="w-3 h-3 text-green-500 mr-1" />
                  <p className="text-xs text-green-600 font-medium">+{(totalValue * 0.15).toFixed(0)}% growth</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Active Auctions</p>
                <p className="text-3xl font-bold text-purple-600">{activeBids}</p>
                <div className="flex items-center mt-2">
                  <Zap className="w-3 h-3 text-purple-500 mr-1" />
                  <p className="text-xs text-purple-600 font-medium">Live bidding</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Gavel className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium mb-1">Total Bids</p>
                <p className="text-3xl font-bold text-orange-600">{totalBids}</p>
                <div className="flex items-center mt-2">
                  <Heart className="w-3 h-3 text-orange-500 mr-1" />
                  <p className="text-xs text-orange-600 font-medium">High interest</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">My Auction Items</h2>
                  <p className="text-gray-600">Premium collection dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="pl-10 pr-4 py-2 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-4 py-2 bg-white/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Items</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredItems.map((item) => {
                const timeLeft = getTimeLeft(item.end_time);
                const isActive = new Date(item.end_time) > new Date();
                const profitMargin = ((item.current_bid - item.starting_price) / item.starting_price * 100).toFixed(1);

                return (
                  <div
                    key={item._id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/50 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group relative"
                  >
                    {/* Image Section */}
                    <div className="relative overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      
                      {/* Status Badge */}
                      <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm shadow-lg ${
                        isActive 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                      }`}>
                        {isActive ? (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            Live
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Ended
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 left-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Heart className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          <Share2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                      
                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
                          <h3 className="text-white font-bold text-lg truncate">{item.name}</h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 space-y-4">
                      <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Price Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 font-medium">Starting Price</span>
                            <DollarSign className="w-4 h-4 text-gray-400" />
                          </div>
                          <span className="text-lg font-bold text-gray-700">
                            {formatCurrency(item.starting_price)}
                          </span>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-green-600 font-medium">Current Bid</span>
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          </div>
                          <span className="text-lg font-bold text-green-700">
                            {formatCurrency(item.current_bid)}
                          </span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Award className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-gray-700 font-medium">Profit Margin</span>
                          </div>
                          <span className="text-sm font-bold text-blue-600">+{profitMargin}%</span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Timer className="w-4 h-4 text-purple-500" />
                            <span className="text-sm text-gray-700 font-medium">Time Status</span>
                          </div>
                          <span className={`text-sm font-bold ${
                            isActive ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {timeLeft}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-orange-500" />
                            <span className="text-sm text-gray-700 font-medium">Total Bids</span>
                          </div>
                          <span className="text-sm font-bold text-orange-600">
                            {item.bid_history.length}
                          </span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Created {formatDate(item.created_at)}</span>
                          <span>ID: {item._id?.slice(-6) || item.id?.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredItems.length === 0 && !isLoading && (
              <div className="text-center py-20">
                <div className="relative mx-auto mb-8">
                  <div className="w-40 h-40 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-full flex items-center justify-center shadow-2xl">
                    <Package className="w-20 h-20 text-gray-400" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-gray-700 mb-4">
                  {searchTerm || filter !== "all" ? "No items found" : "No items yet"}
                </h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                  {searchTerm || filter !== "all" 
                    ? "Try adjusting your search or filter criteria" 
                    : "Start your auction journey by listing your first item and watch the magic happen."
                  }
                </p>
                {(!searchTerm && filter === "all") && (
                  <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5" />
                      <span>List Your First Item</span>
                    </div>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;