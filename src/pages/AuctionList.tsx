import React, { useState } from 'react';
import { Clock, DollarSign, Heart, X } from 'lucide-react';

interface Auction {
  id: number;
  title: string;
  description: string;
  currentBid: number;
  timeLeft: string;
  imageUrl: string;
  createdAt: Date;
}

const initialAuctions: Auction[] = [
  {
    id: 1,
    title: "Vintage Leather Watch",
    description: "A beautiful vintage leather watch from the 1950s in excellent condition.",
    currentBid: 12500,
    timeLeft: "2d 5h",
    imageUrl: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date('2024-03-15')
  },
  {
    id: 2,
    title: "Antique Bronze Statue",
    description: "Rare bronze statue from the early 19th century depicting a Greek goddess.",
    currentBid: 45000,
    timeLeft: "1d 12h",
    imageUrl: "https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date('2024-03-14')
  },
  {
    id: 3,
    title: "Modern Art Painting",
    description: "Original abstract painting by contemporary artist Jane Smith.",
    currentBid: 25000,
    timeLeft: "3d 8h",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80",
    createdAt: new Date('2024-03-13')
  }
];

// Format number to Indian Rupees
const formatIndianPrice = (price: number) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  return formatter.format(price);
};

function AuctionList() {
  const [auctions, setAuctions] = useState<Auction[]>(initialAuctions);
  const [sortBy, setSortBy] = useState('latest');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [newBidAmount, setNewBidAmount] = useState('');

  // New auction form state
  const [newAuction, setNewAuction] = useState({
    title: '',
    description: '',
    currentBid: '',
    imageUrl: '',
    timeLeft: ''
  });

  // Sort auctions
  const sortedAuctions = [...auctions].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'price-low':
        return a.currentBid - b.currentBid;
      case 'price-high':
        return b.currentBid - a.currentBid;
      case 'ending-soon':
        return a.timeLeft.localeCompare(b.timeLeft);
      default:
        return 0;
    }
  });

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    const newAuctionItem: Auction = {
      id: auctions.length + 1,
      title: newAuction.title,
      description: newAuction.description,
      currentBid: parseInt(newAuction.currentBid),
      timeLeft: newAuction.timeLeft,
      imageUrl: newAuction.imageUrl,
      createdAt: new Date()
    };
    setAuctions([...auctions, newAuctionItem]);
    setIsCreateModalOpen(false);
    setNewAuction({ title: '', description: '', currentBid: '', imageUrl: '', timeLeft: '' });
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAuction && parseFloat(newBidAmount) > selectedAuction.currentBid) {
      const updatedAuctions = auctions.map(auction =>
        auction.id === selectedAuction.id
          ? { ...auction, currentBid: parseFloat(newBidAmount) }
          : auction
      );
      setAuctions(updatedAuctions);
      setIsBidModalOpen(false);
      setNewBidAmount('');
      setSelectedAuction(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Active Auctions</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <select 
            className="input-field"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Sort by: Latest</option>
            <option value="price-low">Sort by: Price Low to High</option>
            <option value="price-high">Sort by: Price High to Low</option>
            <option value="ending-soon">Sort by: Ending Soon</option>
          </select>
          <button 
            className="btn-primary"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Auction
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAuctions.map((auction) => (
          <div key={auction.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="relative h-48">
              <img
                src={auction.imageUrl}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{auction.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{auction.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center text-gray-700">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="font-semibold">{formatIndianPrice(auction.currentBid)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{auction.timeLeft}</span>
                </div>
              </div>
              <button 
                className="btn-primary w-full mt-4"
                onClick={() => {
                  setSelectedAuction(auction);
                  setIsBidModalOpen(true);
                }}
              >
                Place Bid
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Auction Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Create New Auction</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleCreateAuction}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="input-field"
                    value={newAuction.title}
                    onChange={(e) => setNewAuction({ ...newAuction, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    className="input-field"
                    value={newAuction.description}
                    onChange={(e) => setNewAuction({ ...newAuction, description: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Starting Bid (₹)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newAuction.currentBid}
                    onChange={(e) => setNewAuction({ ...newAuction, currentBid: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    className="input-field"
                    value={newAuction.imageUrl}
                    onChange={(e) => setNewAuction({ ...newAuction, imageUrl: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g., 2d 5h"
                    value={newAuction.timeLeft}
                    onChange={(e) => setNewAuction({ ...newAuction, timeLeft: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <button type="submit" className="btn-primary w-full">
                  Create Auction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Place Bid Modal */}
      {isBidModalOpen && selectedAuction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Place Bid</h3>
              <button onClick={() => setIsBidModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handlePlaceBid}>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">Current Bid: {formatIndianPrice(selectedAuction.currentBid)}</p>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount (₹)</label>
                <input
                  type="number"
                  className="input-field"
                  value={newBidAmount}
                  onChange={(e) => setNewBidAmount(e.target.value)}
                  min={selectedAuction.currentBid + 1}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum bid: {formatIndianPrice(selectedAuction.currentBid + 1)}
                </p>
              </div>
              <button type="submit" className="btn-primary w-full">
                Place Bid
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuctionList;