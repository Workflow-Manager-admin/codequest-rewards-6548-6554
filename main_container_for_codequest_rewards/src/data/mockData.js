/**
 * Mock data for CodeQuest Rewards application
 * This file contains sample data for merge request reviews and bug claims
 */

// Mock merge requests with code diffs and potential bugs
export const mergeRequests = [
  {
    id: 'MR-1423',
    title: 'Add user authentication with JWT',
    author: 'DevTitan',
    authorAvatar: '🛡️',
    projectName: 'Auth Service',
    createdAt: '2023-05-18T09:43:22Z',
    updatedAt: '2023-05-19T14:12:05Z',
    status: 'open',
    description: 'This MR adds JWT authentication to the backend API with token refresh and proper error handling.',
    codeChanges: [
      {
        id: 'cc-1',
        filename: 'auth/controller.js',
        additions: 45,
        deletions: 12,
        diffContent: `
@@ -15,10 +15,43 @@ class AuthController {
   async login(req, res) {
-    const { email, password } = req.body;
+    try {
+      const { email, password } = req.body;
+      
+      // Validation
+      if (!email || !password) {
+        return res.status(400).json({ message: 'Email and password are required' });
+      }
+      
+      const user = await User.findOne({ email });
+      
+      if (!user) {
+        return res.status(401).json({ message: 'Invalid credentials' });
+      }
+      
+      const isMatch = await bcrypt.compare(password, user.password);
+      
+      if (!isMatch) {
+        return res.status(401).json({ message: 'Invalid credentials' });
+      }
+      
+      // Generate JWT
+      const token = jwt.sign(
+        { userId: user._id },
+        process.env.JWT_SECRET,
+        { expiresIn: '1h' }
+      );
+      
+      const refreshToken = jwt.sign(
+        { userId: user._id },
+        process.env.REFRESH_SECRET,
+        { expiresIn: '7d' }
+      );
-    // TODO: Implement login logic
-    res.status(200).json({ message: 'Login successful' });
+      res.status(200).json({
+        token,
+        refreshToken,
+        user: { id: user._id, name: user.name, email: user.email }
+      });
+    } catch (error) {
+      res.status(500).json({ message: 'Server error', error: error.message });
+    }
   }
 }`,
        bugs: [
          {
            id: 'bug-1',
            description: 'Missing token expiration handling on the client side',
            severity: 'medium',
            claimed: false,
            lineNumbers: [32, 38],
            points: 20
          },
          {
            id: 'bug-2',
            description: 'No validation for email format',
            severity: 'low',
            claimed: false,
            lineNumbers: [18, 19],
            points: 10
          }
        ]
      },
      {
        id: 'cc-2',
        filename: 'auth/middleware.js',
        additions: 28,
        deletions: 0,
        diffContent: `
@@ -0,0 +1,28 @@
+const jwt = require('jsonwebtoken');
+
+module.exports = (req, res, next) => {
+  // Get token from header
+  const token = req.header('x-auth-token');
+  
+  // Check if no token
+  if (!token) {
+    return res.status(401).json({ message: 'No token, authorization denied' });
+  }
+  
+  try {
+    // Verify token
+    const decoded = jwt.verify(token, process.env.JWT_SECRET);
+    
+    // Add user from payload
+    req.user = decoded;
+    next();
+  } catch (err) {
+    if (err.name === 'TokenExpiredError') {
+      return res.status(401).json({ message: 'Token expired' });
+    }
+    
+    res.status(401).json({ message: 'Token is not valid' });
+  }
+};`,
        bugs: [
          {
            id: 'bug-3',
            description: 'Should use a more specific header name than "x-auth-token"',
            severity: 'low',
            claimed: false,
            lineNumbers: [5],
            points: 5
          },
          {
            id: 'bug-4',
            description: 'Missing refresh token validation logic',
            severity: 'high',
            claimed: false,
            lineNumbers: [14, 27],
            points: 30
          }
        ]
      }
    ],
    reviewers: ['DragonSlayer', 'PixelWizard'],
    comments: [
      {
        id: 'comment-1',
        author: 'DragonSlayer',
        authorAvatar: '🔮',
        content: 'The implementation looks solid, but we need to consider token expiration on the client side as well.',
        createdAt: '2023-05-19T10:23:15Z',
        fileId: 'cc-1',
        lineNumber: 32
      }
    ],
    bugsClaimed: 0,
    bugsTotal: 4
  },
  {
    id: 'MR-1419',
    title: 'Refactor payment processing module',
    author: 'CodeNinja',
    authorAvatar: '⚔️',
    projectName: 'Payment Gateway',
    createdAt: '2023-05-16T11:22:47Z',
    updatedAt: '2023-05-18T09:15:33Z',
    status: 'open',
    description: 'This MR refactors the payment processing module to improve error handling and add support for new payment methods.',
    codeChanges: [
      {
        id: 'cc-3',
        filename: 'payment/processor.js',
        additions: 67,
        deletions: 34,
        diffContent: `
@@ -22,16 +55,35 @@ class PaymentProcessor {
   async processPayment(paymentDetails) {
-    // Process payment logic here
-    if (!paymentDetails.amount) {
-      throw new Error('Amount is required');
+    try {
+      // Validate payment details
+      this.validatePaymentDetails(paymentDetails);
+      
+      // Select provider based on payment method
+      const provider = this.getProviderForMethod(paymentDetails.method);
+      
+      // Process payment with selected provider
+      const result = await provider.process({
+        amount: paymentDetails.amount,
+        currency: paymentDetails.currency || 'USD',
+        source: paymentDetails.source,
+        description: paymentDetails.description,
+        customer: paymentDetails.customerId
+      });
+      
+      // Record transaction in database
+      await this.recordTransaction({
+        ...result,
+        status: 'completed',
+        methed: paymentDetails.method,
+        timestamp: new Date()
+      });
+      
+      return {
+        success: true,
+        transactionId: result.id
+      };
+    } catch (error) {
+      this.logError('Payment processing failed', error);
+      throw new PaymentError(error.message, error.code);
     }
-    
-    // Implement payment logic
-    return {
-      success: true,
-      transactionId: 'txn_' + Math.random().toString(36).substr(2, 9)
-    };
   }
 }`,
        bugs: [
          {
            id: 'bug-5',
            description: 'Typo in property name: "methed" instead of "method"',
            severity: 'low',
            claimed: false,
            lineNumbers: [78],
            points: 15
          },
          {
            id: 'bug-6',
            description: 'No error handling for provider.process() rejection',
            severity: 'high',
            claimed: false,
            lineNumbers: [65, 71],
            points: 25
          },
          {
            id: 'bug-7',
            description: 'Missing validation for currency code',
            severity: 'medium',
            claimed: false,
            lineNumbers: [66],
            points: 20
          }
        ]
      }
    ],
    reviewers: ['BugSlayer', 'AlgoAlchemist'],
    comments: [
      {
        id: 'comment-2',
        author: 'BugSlayer',
        authorAvatar: '🐞',
        content: 'We should add proper validation for the currency code instead of defaulting to USD.',
        createdAt: '2023-05-17T14:33:22Z',
        fileId: 'cc-3',
        lineNumber: 66
      }
    ],
    bugsClaimed: 0,
    bugsTotal: 3
  },
  {
    id: 'MR-1412',
    title: 'Implement real-time notification system',
    author: 'PixelWizard',
    authorAvatar: '🧙',
    projectName: 'User Dashboard',
    createdAt: '2023-05-10T08:17:32Z',
    updatedAt: '2023-05-15T16:42:11Z',
    status: 'merged',
    description: 'This MR adds WebSocket-based real-time notifications to the user dashboard.',
    codeChanges: [
      {
        id: 'cc-4',
        filename: 'notifications/websocket.js',
        additions: 89,
        deletions: 12,
        diffContent: `
@@ -5,18 +5,42 @@ class NotificationService {
   constructor() {
     this.clients = new Map();
     this.io = null;
+    this.messageQueue = [];
+    this.maxQueueSize = 1000;
   }
   
   initialize(server) {
-    this.io = require('socket.io')(server);
+    this.io = require('socket.io')(server, {
+      cors: {
+        origin: process.env.CLIENT_URL,
+        methods: ['GET', 'POST'],
+        credentials: true
+      }
+    });
     
     this.io.on('connection', (socket) => {
+      console.log('Client connected:', socket.id);
+      
       socket.on('authenticate', (token) => {
-        // TODO: Validate token
-        this.addClient(socket.id, { id: 'user123' });
+        try {
+          const user = this.validateToken(token);
+          this.addClient(socket.id, user);
+          
+          // Send any queued messages for this user
+          this.sendQueuedMessages(user.id, socket);
+        } catch (error) {
+          socket.emit('error', { message: 'Authentication failed' });
+          socket.disconnect();
+        }
       });
       
-      socket.on('disconnect', () => {
-        this.removeClient(socket.id);
+      socket.on('disconnect', (reason) => {
+        const clientData = this.getClientData(socket.id);
+        if (clientData) {
+          console.log('Client disconnected:', clientData.user.id, reason);
+          this.removeClient(socket.id);
+        } else {
+          console.log('Unknown client disconnected:', socket.id, reason);
+        }
       });
     });
   }`,
        bugs: [
          {
            id: 'bug-8',
            description: 'No rate limiting for socket connections',
            severity: 'medium',
            claimed: false,
            lineNumbers: [14, 16],
            points: 20
          },
          {
            id: 'bug-9',
            description: 'validateToken function is referenced but not implemented',
            severity: 'high',
            claimed: false,
            lineNumbers: [24],
            points: 25
          },
          {
            id: 'bug-10',
            description: 'messageQueue is initialized but never used or managed',
            severity: 'medium',
            claimed: false,
            lineNumbers: [7, 8],
            points: 20
          }
        ]
      }
    ],
    reviewers: ['SyntaxSamurai', 'LogicLegend'],
    comments: [
      {
        id: 'comment-3',
        author: 'SyntaxSamurai',
        authorAvatar: '🥷',
        content: 'The validateToken function needs to be implemented.',
        createdAt: '2023-05-12T11:17:42Z',
        fileId: 'cc-4',
        lineNumber: 24
      }
    ],
    bugsClaimed: 2,
    bugsTotal: 3
  }
];

// Mock rewards for claiming bugs
export const bugRewards = {
  low: {
    points: 10,
    xp: 5,
    description: 'Minor issues, simple fixes'
  },
  medium: {
    points: 20,
    xp: 15,
    description: 'Moderate issues, potential edge cases'
  },
  high: {
    points: 30,
    xp: 25,
    description: 'Critical issues, security vulnerabilities'
  }
};

// Mock rewards available for redemption
export const availableRewards = [
  {
    id: 'reward-1',
    name: 'Premium Mechanical Keyboard',
    description: 'High-performance mechanical gaming keyboard with customizable RGB lighting',
    points: 2500,
    category: 'hardware',
    image: '⌨️',
    stock: 3,
    popularity: 'high',
    featured: true
  },
  {
    id: 'reward-2',
    name: 'Conference Ticket',
    description: 'Ticket to the annual Developer Conference with workshops and networking',
    points: 3500,
    category: 'experience',
    image: '🎫',
    stock: 5,
    popularity: 'high',
    featured: true
  },
  {
    id: 'reward-3',
    name: 'Premium Headphones',
    description: 'Noise-cancelling studio quality headphones for distraction-free coding',
    points: 2000,
    category: 'hardware',
    image: '🎧',
    stock: 2,
    popularity: 'medium',
    featured: true
  },
  {
    id: 'reward-4',
    name: 'Extra Vacation Day',
    description: 'Earn an extra day off to recharge your coding powers',
    points: 5000,
    category: 'experience',
    image: '🏖️',
    stock: 10,
    popularity: 'very high',
    featured: true
  },
  {
    id: 'reward-5',
    name: 'Dev Team Lunch',
    description: 'Lunch with the development team of your choice',
    points: 1000,
    category: 'experience',
    image: '🍕',
    stock: 8,
    popularity: 'medium',
    featured: false
  },
  {
    id: 'reward-6',
    name: 'Technical Book Library',
    description: 'Digital library with access to premium technical books and resources',
    points: 1500,
    category: 'digital',
    image: '📚',
    stock: 15,
    popularity: 'low',
    featured: false
  },
  {
    id: 'reward-7',
    name: 'Premium IDE License',
    description: 'One-year license for the premium version of your favorite IDE',
    points: 2200,
    category: 'digital',
    image: '💻',
    stock: 7,
    popularity: 'medium',
    featured: false
  },
  {
    id: 'reward-8',
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with programmable buttons',
    points: 1800,
    category: 'hardware',
    image: '🖱️',
    stock: 4,
    popularity: 'medium',
    featured: false
  },
  {
    id: 'reward-9',
    name: 'Code Mentor Session',
    description: 'One-on-one session with a senior developer or architect',
    points: 1200,
    category: 'experience',
    image: '👨‍💻',
    stock: 6,
    popularity: 'medium',
    featured: false
  },
  {
    id: 'reward-10',
    name: 'Custom Desk Setup',
    description: 'Ergonomic desk accessories including monitor stand and keyboard rest',
    points: 2800,
    category: 'hardware',
    image: '🖥️',
    stock: 2,
    popularity: 'high',
    featured: true
  },
  {
    id: 'reward-11',
    name: 'Cloud Credits',
    description: 'Credits for your favorite cloud platform to experiment with personal projects',
    points: 1600,
    category: 'digital',
    image: '☁️',
    stock: 20,
    popularity: 'low',
    featured: false
  },
  {
    id: 'reward-12',
    name: 'Company Swag Pack',
    description: 'Premium pack with branded hoodie, water bottle, stickers and more',
    points: 800,
    category: 'merchandise',
    image: '👕',
    stock: 15,
    popularity: 'low',
    featured: false
  }
];

// Mock categories for rewards filtering
export const rewardCategories = [
  { id: 'all', name: 'All Rewards', icon: '🏆' },
  { id: 'hardware', name: 'Hardware', icon: '💻' },
  { id: 'digital', name: 'Digital', icon: '📱' },
  { id: 'experience', name: 'Experiences', icon: '🎭' },
  { id: 'merchandise', name: 'Merchandise', icon: '👕' }
];

// Mock user redemption history
export const redemptionHistory = [
  {
    id: 'rdm-1',
    rewardId: 'reward-6',
    rewardName: 'Technical Book Library',
    pointsCost: 1500,
    redeemDate: '2023-04-15T10:23:15Z',
    status: 'delivered'
  },
  {
    id: 'rdm-2',
    rewardId: 'reward-5',
    rewardName: 'Dev Team Lunch',
    pointsCost: 1000,
    redeemDate: '2023-05-02T14:45:30Z',
    status: 'scheduled',
    scheduledFor: '2023-05-20T12:00:00Z'
  }
];

// Mock badges related to code reviews
export const reviewBadges = [
  {
    id: 'badge-mr-1',
    name: 'Bug Hunter',
    description: 'Claimed 10 bugs in merge requests',
    icon: '🐞',
    requirement: 10,
    type: 'bugs_claimed'
  },
  {
    id: 'badge-mr-2',
    name: 'Code Guardian',
    description: 'Found critical security vulnerabilities',
    icon: '🛡️',
    requirement: 3,
    type: 'security_bugs'
  },
  {
    id: 'badge-mr-3',
    name: 'Nit Picker',
    description: 'Found 20 minor issues in code',
    icon: '🔍',
    requirement: 20,
    type: 'low_severity_bugs'
  },
  {
    id: 'badge-mr-4',
    name: 'Quality Assurance',
    description: 'Reviewed 50 merge requests',
    icon: '🏆',
    requirement: 50,
    type: 'reviews_completed'
  }
];
