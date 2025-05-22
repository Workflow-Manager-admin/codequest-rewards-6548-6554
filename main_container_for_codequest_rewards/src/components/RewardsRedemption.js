import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FireEffects from './FireEffects';
import { RewardsService } from '../services';

/**
 * RewardsRedemption component displays available rewards that users can redeem with their points
 * Styled with the fire/gaming theme and includes interactive elements
 * 
 * @returns {JSX.Element} The RewardsRedemption component
 */
const RewardsRedemption = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock user data (in a real app, this would come from context/state management)
  const userData = {
    points: 3000,
    level: 5,
    name: 'DragonSlayer'
  };
  
  // State for storing category data
  const [categories, setCategories] = useState([]);
  // State for storing redemption history
  const [history, setHistory] = useState([]);
  // Loading states
  const [isLoading, setIsLoading] = useState({
    rewards: false,
    categories: false,
    history: false
  });
  
  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(prev => ({ ...prev, categories: true }));
        const categories = await RewardsService.getRewardCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, categories: false }));
      }
    };
    
    fetchCategories();
  }, []);
  
  // Load redemption history on mount
  useEffect(() => {
    const fetchRedemptionHistory = async () => {
      try {
        setIsLoading(prev => ({ ...prev, history: true }));
        const history = await RewardsService.getRedemptionHistory();
        setHistory(history);
      } catch (error) {
        console.error("Failed to load redemption history:", error);
      } finally {
        setIsLoading(prev => ({ ...prev, history: false }));
      }
    };
    
    fetchRedemptionHistory();
  }, []);
  
  // Filter and fetch rewards based on selected category and search query
  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setIsLoading(prev => ({ ...prev, rewards: true }));
        
        const filters = {
          category: selectedCategory,
          searchQuery: searchQuery.trim(),
          sortBy: sortOption
        };
        
        const result = await RewardsService.getAvailableRewards(filters);
        setFilteredRewards(result.data);
      } catch (error) {
        console.error("Failed to load rewards:", error);
        setFilteredRewards([]);
      } finally {
        setIsLoading(prev => ({ ...prev, rewards: false }));
      }
    };
    
    fetchRewards();
  }, [selectedCategory, sortOption, searchQuery]);
  
  // Handle reward selection and modal display
  const handleSelectReward = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };
  
  // Handle reward redemption
  const handleRedeemReward = async () => {
    if (!selectedReward) return;
    
    try {
      // Call the service to redeem the reward
      const result = await RewardsService.redeemReward(selectedReward.id, userData);
      
      if (result.success) {
        setShowModal(false);
        
        // Refresh redemption history after successful redemption
        const updatedHistory = await RewardsService.getRedemptionHistory();
        setHistory(updatedHistory);
        
        // Show confirmation message (could be enhanced with a toast notification)
        setTimeout(() => {
          alert(`Successfully redeemed ${selectedReward.name}!`);
        }, 300);
      }
    } catch (error) {
      console.error("Failed to redeem reward:", error);
      alert(`Failed to redeem reward: ${error.message}`);
    }
  };
  
  // Check if user has enough points for a reward
  const canAfford = (reward) => {
    return userData.points >= reward.points;
  };

  // Render the reward modal
  const renderRewardModal = () => {
    if (!showModal || !selectedReward) return null;
    
    const affordable = canAfford(selectedReward);
    
    return (
      <div className="reward-modal-backdrop" onClick={() => setShowModal(false)}>
        <div className="reward-modal" onClick={e => e.stopPropagation()}>
          <div className="reward-header">
            <div className="reward-title">🔥 Redeem Reward 🔥</div>
            <div className="flame-border"></div>
          </div>
          
          <div className="reward-content">
            <div className="reward-icon" style={{ fontSize: '4rem' }}>
              {selectedReward.image}
            </div>
            
            <h3>{selectedReward.name}</h3>
            <p className="reward-description">{selectedReward.description}</p>
            
            <div className="reward-stats">
              <div className="reward-stat">
                <div className="reward-stat-value">{selectedReward.points}</div>
                <div className="reward-stat-label">POINTS</div>
              </div>
              <div className="reward-stat">
                <div className="reward-stat-value">{selectedReward.stock}</div>
                <div className="reward-stat-label">IN STOCK</div>
              </div>
            </div>
            
            {affordable ? (
              <button 
                className="btn btn-large" 
                onClick={handleRedeemReward}
                style={{ marginBottom: '10px' }}
              >
                Confirm Redemption
              </button>
            ) : (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: 'var(--fire-red)', marginBottom: '10px', fontWeight: 'bold' }}>
                  You need {selectedReward.points - userData.points} more points
                </div>
                <Link to="/merge-requests">
                  <button className="btn btn-secondary">Earn More Points</button>
                </Link>
              </div>
            )}
            
            <button 
              className="btn btn-secondary" 
              onClick={() => setShowModal(false)}
              style={{ marginLeft: affordable ? '10px' : '0' }}
            >
              Cancel
            </button>
          </div>
          
          {/* Ember animations for reward modal */}
          <div className="modal-embers">
            {[...Array(10)].map((_, i) => (
              <div
                key={`ember-${i}`}
                className={`ember ${i % 2 === 0 ? 'red' : i % 3 === 0 ? 'yellow' : ''}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main>
      <div className="container">
        <div className="rewards-container" style={{
          position: 'relative',
          padding: '40px 20px',
          borderRadius: '12px',
          background: 'rgba(26, 26, 26, 0.7)',
          boxShadow: '0 0 20px var(--fire-glow)',
          border: '1px solid var(--fire-orange)',
          marginTop: '80px',
          minHeight: '600px',
          overflow: 'hidden',
          animation: 'border-pulse 4s infinite alternate'
        }}>
          <h1 className="title">Rewards Redemption</h1>
          <div className="subtitle">🔥 Claim Your Epic Rewards 🔥</div>
          
          {/* User points display */}
          <div className="user-points-display" style={{
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: '8px',
            padding: '15px',
            margin: '20px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid var(--fire-orange)',
            boxShadow: '0 0 10px var(--fire-glow)'
          }}>
            <div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Available Points</span>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold',
                color: 'var(--fire-yellow)',
                textShadow: '0 0 10px var(--fire-glow)'
              }}>
                {userData.points}
              </div>
            </div>
            
            <Link to="/merge-requests">
              <button className="btn">Earn More Points</button>
            </Link>
          </div>
          
          {/* Search and filter controls */}
          <div className="rewards-controls" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px 0',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div className="search-box" style={{
              position: 'relative',
              minWidth: '250px'
            }}>
              <input
                type="text"
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  padding: '10px 15px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-color)',
                  width: '100%'
                }}
              />
              <span style={{
                position: 'absolute',
                right: '15px',
                top: '50%',
                transform: 'translateY(-50%)'
              }}>🔍</span>
            </div>
            
            <div className="sort-control">
              <select 
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                style={{
                  padding: '10px 15px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  color: 'var(--text-color)'
                }}
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
            </div>
          </div>
          
          {/* Category filters */}
          <div className="category-filters" style={{
            display: 'flex',
            gap: '10px',
            margin: '20px 0',
            overflowX: 'auto',
            padding: '5px 0'
          }}>
            {isLoading.categories ? (
              <div>Loading categories...</div>
            ) : (
              categories.map(category => (
              <button
                key={category.id}
                className={`tab-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span style={{ marginRight: '5px' }}>{category.icon}</span>
                {category.name}
              </button>
            ))
            )}
          </div>
          
          {/* Rewards grid */}
          <div className="rewards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '20px',
            marginTop: '20px'
          }}>
            {isLoading.rewards ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 0',
                color: 'var(--text-secondary)'
              }}>
                Loading rewards...
              </div>
            ) : filteredRewards.length > 0 ? (
              filteredRewards.map(reward => {
                const affordable = canAfford(reward);
                return (
                  <div 
                    key={reward.id} 
                    className={`reward-card ${affordable ? '' : 'unaffordable'}`}
                    onClick={() => handleSelectReward(reward)}
                    style={{
                      background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.8))',
                      border: `1px solid ${affordable ? 'var(--fire-orange)' : 'var(--border-color)'}`,
                      borderRadius: '8px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      opacity: affordable ? 1 : 0.7
                    }}
                    onMouseOver={e => {
                      if (affordable) {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 10px 20px var(--fire-glow)';
                      }
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {reward.featured && (
                      <div className="featured-badge" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'linear-gradient(135deg, var(--fire-red), var(--fire-orange))',
                        color: 'white',
                        padding: '5px 10px',
                        fontSize: '0.8rem',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        textTransform: 'uppercase',
                        boxShadow: '0 0 10px var(--fire-glow)'
                      }}>
                        Featured
                      </div>
                    )}
                    
                    <div className="reward-image" style={{
                      fontSize: '4rem',
                      textAlign: 'center',
                      marginBottom: '10px',
                      padding: '10px'
                    }}>
                      {reward.image}
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.2rem',
                      margin: '10px 0',
                      color: affordable ? 'var(--text-color)' : 'var(--text-secondary)'
                    }}>
                      {reward.name}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.9rem',
                      color: 'var(--text-secondary)',
                      marginBottom: '15px',
                      flexGrow: 1
                    }}>
                      {reward.description}
                    </p>
                    
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '10px'
                    }}>
                      <div className="reward-points" style={{
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: affordable ? 'var(--fire-yellow)' : 'var(--text-secondary)',
                        textShadow: affordable ? '0 0 5px var(--fire-glow)' : 'none'
                      }}>
                        {reward.points} pts
                      </div>
                      
                      <div className="reward-stock" style={{
                        fontSize: '0.8rem',
                        color: reward.stock < 3 ? 'var(--fire-red)' : 'var(--text-secondary)'
                      }}>
                        {reward.stock < 3 ? 'Low stock!' : `${reward.stock} available`}
                      </div>
                    </div>
                    
                    {!affordable && (
                      <div className="points-needed" style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '10px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: 'var(--fire-red)',
                        textAlign: 'center',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        Need {reward.points - userData.points} more points
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '40px 0',
                color: 'var(--text-secondary)'
              }}>
                No rewards found matching your criteria
              </div>
            )}
          </div>
          
          {/* Redemption history */}
          {history.length > 0 && (
            <div className="redemption-history" style={{ marginTop: '40px' }}>
              <h3 className="section-title">Redemption History</h3>
              
              <div className="history-table" style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                overflow: 'hidden',
                marginTop: '15px'
              }}>
                {isLoading.history ? (
                  <div style={{ padding: '20px', textAlign: 'center' }}>Loading history...</div>
                ) : (
                  history.map(item => (
                  <div key={item.id} className="history-item" style={{
                    padding: '15px',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold' }}>{item.rewardName}</div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--text-secondary)',
                        marginTop: '5px'
                      }}>
                        Redeemed on {new Date(item.redeemDate).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{ color: 'var(--fire-yellow)', fontWeight: 'bold' }}>
                      {item.pointsCost} pts
                    </div>
                    
                    <div style={{
                      marginLeft: '20px',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      background: item.status === 'delivered' 
                        ? 'rgba(76, 175, 80, 0.2)' 
                        : 'rgba(255, 235, 59, 0.2)',
                      color: item.status === 'delivered'
                        ? '#4CAF50'
                        : '#FFEB3B'
                    }}>
                      {item.status}
                    </div>
                  </div>
                ))
                )}
              </div>
            </div>
          )}
          
          {/* Render modal */}
          {renderRewardModal()}
          
          {/* Fire effects for background */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default RewardsRedemption;
