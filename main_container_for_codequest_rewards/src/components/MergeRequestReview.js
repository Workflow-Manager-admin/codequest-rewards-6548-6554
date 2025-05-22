import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FireEffects from './FireEffects';
import { MergeRequestService } from '../services';

/**
 * MergeRequestReview component provides an interface for reviewing merge requests
 * and claiming bugs with gaming mechanics using the fire theme
 * 
 * @returns {JSX.Element} The MergeRequestReview component
 */
const MergeRequestReview = () => {
  // State management
  const [selectedMR, setSelectedMR] = useState(null);
  const [activeDiff, setActiveDiff] = useState(null);
  const [bugsFound, setBugsFound] = useState({});
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardInfo, setRewardInfo] = useState(null);
  const [userStats, setUserStats] = useState({
    bugsFound: 0,
    pointsEarned: 0,
    reviewsCompleted: 0
  });

  // State for storing all merge requests
  const [allMergeRequests, setAllMergeRequests] = useState([]);
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load merge requests on component mount
  useEffect(() => {
    const fetchMergeRequests = async () => {
      try {
        setIsLoading(true);
        const result = await MergeRequestService.getMergeRequests();
        setAllMergeRequests(result.data);
        
        // Select first merge request by default
        if (result.data.length > 0 && !selectedMR) {
          setSelectedMR(result.data[0]);
          if (result.data[0].codeChanges?.length > 0) {
            setActiveDiff(result.data[0].codeChanges[0]);
          }
        }
      } catch (error) {
        console.error("Failed to load merge requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMergeRequests();
  }, []);

  // Load the first MR by default (only if not already set and allMergeRequests changes)
  useEffect(() => {
    if (allMergeRequests.length > 0 && !selectedMR) {
      setSelectedMR(allMergeRequests[0]);
      if (allMergeRequests[0].codeChanges?.length > 0) {
        setActiveDiff(allMergeRequests[0].codeChanges[0]);
      }
    }
  }, [allMergeRequests, selectedMR]);

  // Initialize bugs found object
  useEffect(() => {
    if (selectedMR) {
      const initialBugs = {};
      selectedMR.codeChanges.forEach(change => {
        change.bugs.forEach(bug => {
          initialBugs[bug.id] = {
            ...bug,
            claimed: bug.claimed || false
          };
        });
      });
      setBugsFound(initialBugs);
    }
  }, [selectedMR]);

  // Handle MR selection
  const handleSelectMR = (mr) => {
    setSelectedMR(mr);
    if (mr.codeChanges.length > 0) {
      setActiveDiff(mr.codeChanges[0]);
    } else {
      setActiveDiff(null);
    }
  };

  // Handle file selection within the MR
  const handleSelectFile = (diff) => {
    setActiveDiff(diff);
  };

  // Handle bug claim
  const handleClaimBug = async (bugId) => {
    if (!selectedMR || !bugsFound[bugId] || bugsFound[bugId].claimed) return;

    try {
      // Call service to claim the bug
      const result = await MergeRequestService.claimBug(selectedMR.id, bugId);
      
      if (result.success) {
        // Clone the current bugs state
        const updatedBugs = { ...bugsFound };
        updatedBugs[bugId].claimed = true;
        
        // Update bugs state
        setBugsFound(updatedBugs);
        
        // Update user stats
        setUserStats(prev => ({
          bugsFound: prev.bugsFound + 1,
          pointsEarned: prev.pointsEarned + result.points,
          reviewsCompleted: prev.reviewsCompleted
        }));
        
        // Show reward modal
        setRewardInfo({
          bugId,
          description: result.description,
          points: result.points,
          xp: result.xp,
          severity: result.severity
        });
        setShowRewardModal(true);
      }
    } catch (error) {
      console.error("Failed to claim bug:", error);
      alert(`Failed to claim bug: ${error.message}`);
    }
  };

  // Close reward modal
  const handleCloseRewardModal = () => {
    setShowRewardModal(false);
  };

  // Mark review as completed
  const handleCompleteReview = async () => {
    if (!selectedMR) return;
    
    try {
      // Call service to submit the review
      const result = await MergeRequestService.submitReview(selectedMR.id, {
        status: 'completed',
        timestamp: new Date().toISOString()
      });
      
      if (result.success) {
        // Update user stats
        setUserStats(prev => ({
          ...prev,
          reviewsCompleted: prev.reviewsCompleted + 1
        }));
        
        // Show confirmation
        alert("Review completed successfully!");
      }
    } catch (error) {
      console.error("Failed to complete review:", error);
      alert(`Failed to complete review: ${error.message}`);
    }
  };

  // Format code with line numbers for better display
  const formatCodeWithLineNumbers = (diffContent) => {
    if (!diffContent) return [];

    return diffContent
      .split('\n')
      .map((line, index) => {
        // Extract the line type (addition, deletion, context)
        let type = 'context';
        if (line.startsWith('+')) type = 'addition';
        if (line.startsWith('-')) type = 'deletion';
        if (line.startsWith('@@')) type = 'chunk-header';

        return {
          number: index + 1,
          content: line,
          type
        };
      });
  };

  // Calculate claimed and total bugs
  const getBugCounts = () => {
    if (!selectedMR) return { claimed: 0, total: 0 };
    
    const bugValues = Object.values(bugsFound);
    const claimedCount = bugValues.filter(bug => bug.claimed).length;
    return {
      claimed: claimedCount,
      total: bugValues.length
    };
  };

  // Render reward modal
  const renderRewardModal = () => {
    if (!showRewardModal || !rewardInfo) return null;

    return (
      <div className="reward-modal-backdrop">
        <div className="reward-modal">
          <div className="reward-header">
            <div className="reward-title">🔥 Bug Claimed! 🔥</div>
            <div className="flame-border"></div>
          </div>
          
          <div className="reward-content">
            <div className="reward-icon">
              {rewardInfo.severity === 'high' ? '🚨' : 
               rewardInfo.severity === 'medium' ? '⚠️' : '📝'}
            </div>
            
            <h3>You found a {rewardInfo.severity} severity bug!</h3>
            <p className="reward-description">{rewardInfo.description}</p>
            
            <div className="reward-stats">
              <div className="reward-stat">
                <div className="reward-stat-value">+{rewardInfo.points}</div>
                <div className="reward-stat-label">POINTS</div>
              </div>
              <div className="reward-stat">
                <div className="reward-stat-value">+{rewardInfo.xp}</div>
                <div className="reward-stat-label">XP</div>
              </div>
            </div>
            
            <button className="btn btn-large" onClick={handleCloseRewardModal}>
              Continue Quest
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

  // Render bug indicators on code lines
  const renderBugIndicators = (lineNumber, fileId) => {
    if (!activeDiff) return null;
    
    // Find bugs for this line and file
    const lineBugs = Object.values(bugsFound).filter(bug => 
      bug.lineNumbers.includes(lineNumber) && activeDiff.id === fileId
    );
    
    if (lineBugs.length === 0) return null;

    return (
      <div className="bug-indicators">
        {lineBugs.map(bug => (
          <div 
            key={bug.id}
            className={`bug-indicator ${bug.claimed ? 'claimed' : 'unclaimed'} ${bug.severity}`}
            onClick={() => handleClaimBug(bug.id)}
            title={bug.claimed ? 'Already claimed' : `Claim this ${bug.severity} bug (${bug.points} pts)`}
          >
            {bug.claimed ? '✓' : '!'}
          </div>
        ))}
      </div>
    );
  };

  // Main render method
  return (
    <main>
      <div className="container">
        <div className="mr-review-container">
          <h1 className="title">Merge Request Review</h1>
          <div className="subtitle">🔥 Find bugs, claim rewards 🔥</div>
          
          {/* Quest stats at the top */}
          <div className="mr-quest-stats">
            <div className="stat-item">
              <div className="stat-value">{userStats.bugsFound}</div>
              <div className="stat-label">Bugs Found</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userStats.pointsEarned}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userStats.reviewsCompleted}</div>
              <div className="stat-label">Reviews</div>
            </div>
          </div>
          
          {/* MR Selection */}
          <div className="mr-selection">
            <h3>Select Merge Request</h3>
            <div className="mr-list">
              {isLoading ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  Loading merge requests...
                </div>
              ) : allMergeRequests.map(mr => (
                <div 
                  key={mr.id}
                  className={`mr-item ${selectedMR && mr.id === selectedMR.id ? 'active' : ''}`}
                  onClick={() => handleSelectMR(mr)}
                >
                  <div className="mr-item-header">
                    <div className="mr-item-id">{mr.id}</div>
                    <div className="mr-item-status" data-status={mr.status}>
                      {mr.status.toUpperCase()}
                    </div>
                  </div>
                  <div className="mr-item-title">{mr.title}</div>
                  <div className="mr-item-meta">
                    <div className="mr-item-author">
                      <span className="author-avatar">{mr.authorAvatar}</span>
                      {mr.author}
                    </div>
                    <div className="mr-item-project">{mr.projectName}</div>
                  </div>
                  <div className="mr-item-stats">
                    <div className="mr-item-bugs">
                      <span className="bug-icon">🐞</span>
                      {mr.bugsClaimed}/{mr.bugsTotal}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedMR && (
            <>
              {/* MR Details */}
              <div className="mr-detail-header">
                <div className="mr-detail-title">
                  <h2>{selectedMR.id}: {selectedMR.title}</h2>
                  <div className="mr-detail-meta">
                    <div className="mr-detail-author">
                      <span className="author-avatar">{selectedMR.authorAvatar}</span>
                      {selectedMR.author}
                    </div>
                    <div className="mr-detail-project">{selectedMR.projectName}</div>
                  </div>
                </div>
                
                <div className="mr-bugs-counter">
                  <div className="bugs-found">
                    <span className="bug-icon">🐞</span>
                    {getBugCounts().claimed}/{getBugCounts().total} Bugs Found
                  </div>
                </div>
              </div>
              
              {/* File tabs navigation */}
              <div className="file-tabs">
                {selectedMR.codeChanges.map(change => (
                  <button
                    key={change.id}
                    className={`file-tab ${activeDiff && activeDiff.id === change.id ? 'active' : ''}`}
                    onClick={() => handleSelectFile(change)}
                  >
                    <span className="file-icon">📄</span>
                    {change.filename}
                    <span className="file-changes">
                      <span className="additions">+{change.additions}</span>
                      <span className="deletions">-{change.deletions}</span>
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Code diff viewer */}
              {activeDiff && (
                <div className="code-diff-viewer">
                  <div className="code-header">
                    <div className="filename">{activeDiff.filename}</div>
                    <div className="file-changes">
                      <span className="additions">+{activeDiff.additions}</span>
                      <span className="deletions">-{activeDiff.deletions}</span>
                    </div>
                  </div>
                  <div className="code-content">
                    {formatCodeWithLineNumbers(activeDiff.diffContent).map((line) => (
                      <div
                        key={`line-${line.number}`}
                        className={`code-line ${line.type}`}
                      >
                        <div className="line-number">{line.number}</div>
                        <div className="line-content">
                          <pre>{line.content}</pre>
                        </div>
                        {renderBugIndicators(line.number, activeDiff.id)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Comments */}
              {selectedMR.comments.length > 0 && (
                <div className="mr-comments">
                  <h3>Comments</h3>
                  {selectedMR.comments.map(comment => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <div className="comment-author">
                          <span className="author-avatar">{comment.authorAvatar}</span>
                          {comment.author}
                        </div>
                        <div className="comment-date">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="comment-content">{comment.content}</div>
                      {comment.fileId && comment.lineNumber && (
                        <div className="comment-location">
                          {selectedMR.codeChanges.find(c => c.id === comment.fileId)?.filename}:L{comment.lineNumber}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Action buttons */}
              <div className="mr-actions">
                <button 
                  className="btn btn-large"
                  onClick={handleCompleteReview}
                >
                  Complete Review
                </button>
                <Link to="/" className="btn btn-secondary">Back to Dashboard</Link>
              </div>
            </>
          )}
          
          {/* Reward modal */}
          {renderRewardModal()}
          
          {/* Background fire effects */}
          <FireEffects />
        </div>
      </div>
    </main>
  );
};

export default MergeRequestReview;
