- Real-Time messaging system 
- Challenge: Managing messages queues, low-latency communication & maintaining uptime with failover mechanisms
- Concepts: Websockets, long polling and fault tolerence
- Great to: Handle reliable and concurrent real-time systems

* Functional Requirements
1. 1-1 chat
2. Group chat
3. Read receipt
4. Online status
5. Notifications
6. Share multimedia


* System Requirements
1. Low latency
2. Real-time
3. Highly available
4. Highly Reliable
5. Mobile & Desktop
6. Chat history
7. High Blob store
8. E2E encryption
9. Web sockets

* Capacity Planning
1. Total active users: 500M
2. 30 Messages per day
3. Total messages per day = 500M * 30 = 1500M = 1.5B messages per day
4. 18K messages/Second

* Storage Estimation
1. Total messages per day = 1.5B
2. Message = 50KB
3. Total storage = 1.5B * 50KB = 75PB


* API Endpoints
1. send_messages(sender_userId, receiver_userId, text)
2. get_messages (userId, screen_size, before_timestamp)


* DB Tables
1. T_Users => userId, username, contact
2. T_Groups => groupId, userId
3. T_LastSeen => userId, timestamp
4. T_UnseenMessages => messageId, sent_to_id, sent_from_id, content, media_url, timestamp
5. T_Sessions => userId, sessionId

