import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useGetItemByIdQuery } from "../redux/features/items/itemSlice";
import { useLiveBidding } from "../routes/useLiveBidding";
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Clock, 
  DollarSign, 
  Award, 
  Target,
  Zap,
  Crown,
  Medal,
  Star,
  Activity,
  BarChart3,
  Timer,
  ChevronUp,
  ChevronDown,
  Eye,
  Flame
} from "lucide-react";
import { useSelector } from "react-redux";
import NavbarHome from "./NavbarHome";



const BidDetailPage = () => {
  const { id } = useParams();
  const username= useSelector((state) => state.auth.user.username);
  const { data: item, refetch, isLoading, error } = useGetItemByIdQuery(id, {
    pollingInterval: 5000, // More frequent polling for live updates
  });
  

 function formatToIST(utcDateStr) {
  const date = new Date(utcDateStr);

  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  const a=istDate.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  
  });
  return a
}
  const name= useSelector((state) => state.auth.user.name);

  const [showModal, setShowModal] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [countdown, setCountdown] = useState("");
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [showStats, setShowStats] = useState(true);

  const { currentBid, placeBid, error: bidError } = useLiveBidding(id);

  // Process bid history to create leaderboard
  const bidderStats = useMemo(() => {
    if (!item?.bid_history || !Array.isArray(item.bid_history)) return [];

    // Group bids by user_id
    const bidderMap = new Map();
    
    item.bid_history.forEach((bid, index) => {
      const userId = bid.user_id;
      if (!bidderMap.has(userId)) {
        bidderMap.set(userId, {
          user_id: userId,
          name: userId === 'anonymous_user' ? `Bidder ${userId.slice(-4)}` : userId,
          totalBids: 0,
          highestBid: 0,
          lowestBid: Infinity,
          bidHistory: [],
          lastBidTime: null,
          totalSpent: 0,
          isLeading: false,
          position: 0,
          bidTrend: 'up'
        });
      }

      const bidder = bidderMap.get(userId);
      bidder.totalBids++;
      bidder.bidHistory.push({
        amount: bid.bid_amount,
        timestamp: bid.timestamp,
        order: index
      });
      
      if (bid.bid_amount > bidder.highestBid) {
        bidder.highestBid = bid.bid_amount;
      }
      if (bid.bid_amount < bidder.lowestBid) {
        bidder.lowestBid = bid.bid_amount;
      }
      
      bidder.lastBidTime = bid.timestamp;
      bidder.totalSpent += bid.bid_amount;
    });

    // Convert to array and sort by highest bid
    const sortedBidders = Array.from(bidderMap.values())
      .sort((a, b) => b.highestBid - a.highestBid)
      .map((bidder, index) => ({
        ...bidder,
        position: index + 1,
        isLeading: index === 0,
        bidTrend: bidder.bidHistory.length > 1 ? 
          (bidder.bidHistory[bidder.bidHistory.length - 1].amount > 
           bidder.bidHistory[bidder.bidHistory.length - 2].amount ? 'up' : 'down') : 'neutral'
      }));

    return sortedBidders;
  }, [item?.bid_history]);

  // Auction statistics
  const auctionStats = useMemo(() => {
    if (!item) return {};

    const totalBids = item.bid_history?.length || 0;
    const uniqueBidders = bidderStats.length;
    const averageBid = totalBids > 0 ? 
      item.bid_history.reduce((sum, bid) => sum + bid.bid_amount, 0) / totalBids : 0;
    const priceIncrease = item.current_bid - item.starting_price;
    const increasePercentage = ((priceIncrease / item.starting_price) * 100).toFixed(1);

    return {
      totalBids,
      uniqueBidders,
      averageBid,
      priceIncrease,
      increasePercentage,
      currentLeader: bidderStats[0]?.name || 'No bids yet'
    };
  }, [item, bidderStats]);

  // Countdown timer effect
  useEffect(() => {
    //console.log(item?.end_time);
    //console.log(formatToIST(item?.end_time));
    const date = new Date(item?.end_time);
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(date.getTime() + istOffset);
    //console.log(istDate - new Date());


  if (!item?.end_time) return;


  const endTimeUTC = new Date(item.end_time);
  if (isNaN(endTimeUTC.getTime())) {
    //console.error("Invalid end_time:", item.end_time);
    return;
  }

  const interval = setInterval(() => {
    const nowUTC = new Date(); // Use UTC time directly
    const diff = istDate - new Date(); // ms
    const secondsLeft = Math.floor(diff / 1000);

    if ((istDate - new Date()) <= 0) {
      setCountdown("Auction Ended");
      setIsAuctionEnded(true);
      clearInterval(interval);
      return;
    }

    const days = Math.floor(secondsLeft / 86400);
    const hours = Math.floor((secondsLeft % 86400) / 3600);
    const minutes = Math.floor((secondsLeft % 3600) / 60);
    const seconds = secondsLeft % 60;

    if (days > 0) {
      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    } else {
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    }
  }, 1000);

  return () => clearInterval(interval);
}, [item?.end_time]);


  // Format UTC ISO string to IST for display
  //console.log(item)
  const user = useSelector((state) => state.auth.user);
  //console.log(user)

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const bidTime = new Date(timestamp);
    const diffMs = now - bidTime;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handlePlaceBid = () => {
    if (user.id===item.owner_id){
      alert("You cannot bid on your own item.");
      return;
    }
    const numericBid = parseFloat(bidAmount);
    const currentBidValue = currentBid ?? item.current_bid;

    if (isNaN(numericBid) || numericBid <= currentBidValue) {
      alert(`Your bid must be higher than the current bid of $${currentBidValue.toLocaleString()}`);
      return;
    }

    if (isAuctionEnded) {
      alert("This auction has ended. No more bids can be placed.");
      return;
    }
    placeBid(numericBid,username);
    setShowModal(false);
    setBidAmount("");
  };
useEffect(() => {
  window.scrollTo(0, 0);
}, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="bg-gray-200 h-64 rounded-2xl mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gray-200 h-96 rounded-2xl"></div>
            <div className="bg-gray-200 h-96 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-600 text-lg">Error loading auction details</p>
          <button 
            onClick={() => refetch()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <NavbarHome/>
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <span className="text-sm">ID: {item.id}</span>
                <span className="text-sm">•</span>
                <span className={`text-sm font-semibold flex items-center gap-1 ${
                  isAuctionEnded ? 'text-red-300' : 'text-green-300'
                }`}>
                  {isAuctionEnded ? '🔴 Ended' : '🟢 Live'}
                  {!isAuctionEnded && <Flame className="w-4 h-4 animate-pulse" />}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/80 mb-1">Time Remaining</div>
              <div className={`text-2xl font-bold font-mono ${
                isAuctionEnded ? 'text-red-300' : 'text-green-300'
              }`}>
                {countdown}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl p-4 shadow-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                ${(currentBid || item.current_bid).toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">Current Bid</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{auctionStats.totalBids}</div>
              <div className="text-sm text-gray-500">Total Bids</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{auctionStats.uniqueBidders}</div>
              <div className="text-sm text-gray-500">Bidders</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">+{auctionStats.increasePercentage}%</div>
              <div className="text-sm text-gray-500">Price Increase</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Item Details */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Image */}
              <div className="aspect-square w-full bg-gray-100 rounded-xl overflow-hidden">
<img
  src={item.image_url || "/fallback.png"}
  alt={item.name}
  onError={(e) => (e.target.src = "/fallback.png")}
  className="w-full h-full object-cover"
/>
              </div>

              {/* Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">📅 Timeline</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Started:</span>
                      <span className="text-blue-800 font-mono text-sm">
                        {formatToIST(item.created_at)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Ends:</span>
                      <span className="text-blue-800 font-mono text-sm">
                        {formatToIST(item.end_time)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-700">Starting Price:</span>
                    <span className="text-xl font-bold text-green-800">
                      ${item.starting_price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-700">Average Bid:</span>
                    <span className="text-lg font-semibold text-green-800">
                      ${Math.round(auctionStats.averageBid).toLocaleString()}
                    </span>
                  </div>
                </div>

                {bidError && (
                  <div className="bg-red-100 border border-red-300 rounded-lg p-3">
                    <p className="text-red-600 text-sm">⚠️ {bidError}</p>
                  </div>
                )}

                <button
                  onClick={() => setShowModal(true)}
                  disabled={isAuctionEnded}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                    isAuctionEnded
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isAuctionEnded ? 'Auction Ended' : 'Place Your Bid'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Statistics Sidebar */}
        <div className="space-y-6">
          {/* Current Leader */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <Crown className="w-8 h-8" />
              <h3 className="text-xl font-bold">Current Leader</h3>
            </div>
            {bidderStats[0] ? (
              <div className="space-y-3">
                <div className="text-2xl font-bold">{bidderStats[0].name}</div>
                <div className="text-3xl font-black">
                  ${bidderStats[0].highestBid.toLocaleString()}
                </div>
                <div className="text-yellow-100 text-sm">
                  {bidderStats[0].totalBids} bids • Last bid {formatTimeAgo(bidderStats[0].lastBidTime)}
                </div>
              </div>
            ) : (
              <div className="text-yellow-100">No bids yet</div>
            )}
          </motion.div>

          {/* Leaderboard */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <h3 className="font-bold">Leaderboard</h3>
                </div>
                <button 
                  onClick={() => setShowStats(!showStats)}
                  className="p-1 hover:bg-white/20 rounded"
                >
                  {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showStats && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="max-h-96 overflow-y-auto">
                    {bidderStats.length > 0 ? (
                      <div className="divide-y">
                        {bidderStats.slice(0, 10).map((bidder, index) => (
                          <motion.div 
                            key={bidder.user_id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 hover:bg-gray-50 transition-colors ${
                              bidder.isLeading ? 'bg-yellow-50 border-l-4 border-yellow-400' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                index === 1 ? 'bg-gray-100 text-gray-700' :
                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                                {index === 0 ? <Crown className="w-4 h-4" /> :
                                 index === 1 ? <Medal className="w-4 h-4" /> :
                                 index === 2 ? <Award className="w-4 h-4" /> :
                                 index + 1}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-gray-800 truncate">
                                    {bidder.name}
                                  </div>
                                  {bidder.bidTrend === 'up' && (
                                    <ChevronUp className="w-4 h-4 text-green-500" />
                                  )}
                                  {bidder.bidTrend === 'down' && (
                                    <ChevronDown className="w-4 h-4 text-red-500" />
                                  )}
                                </div>
                                <div className="text-lg font-bold text-gray-900">
                                  ${bidder.highestBid.toLocaleString()}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {bidder.totalBids} bids • {formatTimeAgo(bidder.lastBidTime)}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No bidders yet</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bid Activity */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-xl p-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-800">Recent Activity</h3>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {item.bid_history?.slice(-5).reverse().map((bid, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-semibold text-gray-800">
                      ${bid.bid_amount.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {bid.user_id === 'anonymous_user' ? 
                        `Bidder ${bid.user_id.slice(-4)}` : bid.user_id}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimeAgo(bid.timestamp)}
                  </div>
                </motion.div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  No bids yet
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Bid Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Place Your Bid</h2>
                <p className="text-gray-600">
                  Current highest bid: <span className="font-semibold text-green-600">
                    ${(currentBid || item.current_bid)?.toLocaleString()}
                  </span>
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your bid amount (USD)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full p-4 text-xl border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    min={(currentBid || item.current_bid) + 1}
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePlaceBid}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 font-medium"
                  >
                    Submit Bid
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BidDetailPage;