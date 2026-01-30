# MongoDB Production Database Setup Guide

This guide covers setting up MongoDB for production use with the Vibe Holidays application.

## Table of Contents

1. [MongoDB Atlas Setup (Recommended)](#mongodb-atlas-setup-recommended)
2. [Self-Hosted MongoDB Setup](#self-hosted-mongodb-setup)
3. [Database Configuration](#database-configuration)
4. [Performance Optimization](#performance-optimization)
5. [Backup and Recovery](#backup-and-recovery)
6. [Security Best Practices](#security-best-practices)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

---

## MongoDB Atlas Setup (Recommended)

MongoDB Atlas is a fully managed cloud database service. It's the easiest and most reliable option for production.

### Step 1: Create Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In"
3. Create account or sign in with Google/GitHub

### Step 2: Create Organization and Project

1. Create new organization: "Vibe Holidays"
2. Create new project: "Vibe Holidays Production"

### Step 3: Build Database Cluster

1. Click "Build a Database"
2. Choose deployment option:
   - **Shared (M0)**: Free tier, good for development/small production
   - **Dedicated (M10+)**: Recommended for production, starts at $0.08/hour
   - **Serverless**: Pay per operation, good for variable workloads

3. Select cloud provider and region:
   - **Provider**: AWS, Google Cloud, or Azure
   - **Region**: Choose closest to your backend server
   - Example: AWS us-east-1 (if backend is in US East)

4. Configure cluster:
   - **Cluster Name**: `vibe-holidays-prod`
   - **Cluster Tier**: M10 or higher for production
   - **Additional Settings**: Leave defaults or customize as needed

5. Click "Create Cluster" (takes 3-7 minutes)

### Step 4: Configure Database Access

1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Configure user:
   - **Authentication Method**: Password
   - **Username**: `vibe-holidays-admin`
   - **Password**: Click "Autogenerate Secure Password" (save this!)
   - **Database User Privileges**: "Read and write to any database"
   - **Temporary User**: No
4. Click "Add User"

**Important:** Save the password securely! You'll need it for the connection string.

### Step 5: Configure Network Access

1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose option:
   - **Add Current IP Address**: For testing from your location
   - **Allow Access from Anywhere**: `0.0.0.0/0` (less secure but works with dynamic IPs)
   - **Add Specific IP**: Enter your backend server's IP address (most secure)

4. For production, add your backend server's IP:
   ```
   IP Address: 123.456.789.012
   Comment: Production Backend Server
   ```

5. Click "Confirm"

**Security Note:** Restricting to specific IPs is more secure. If using cloud hosting with dynamic IPs, you may need to use "Allow Access from Anywhere" but ensure strong authentication.

### Step 6: Get Connection String

1. Go to "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select:
   - **Driver**: Node.js
   - **Version**: 4.1 or later
5. Copy connection string:
   ```
   mongodb+srv://vibe-holidays-admin:<password>@vibe-holidays-prod.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. Replace `<password>` with your actual password
7. Add database name:
   ```
   mongodb+srv://vibe-holidays-admin:YOUR_PASSWORD@vibe-holidays-prod.xxxxx.mongodb.net/vibe-holidays-prod?retryWrites=true&w=majority
   ```

### Step 7: Create Database and Collections

Collections are created automatically by Mongoose, but you can create them manually:

1. Go to "Database" → "Browse Collections"
2. Click "Create Database"
3. Database name: `vibe-holidays-prod`
4. Collection name: `packages` (others will be created automatically)

### Step 8: Create Indexes

Indexes improve query performance. Create these indexes:

1. Go to "Database" → "Browse Collections"
2. Select collection → "Indexes" tab
3. Click "Create Index"

**Packages Collection:**
```javascript
// Single field indexes
{ destination: 1 }
{ price: 1 }
{ featured: 1 }
{ active: 1 }

// Compound indexes
{ featured: 1, active: 1 }
{ active: 1, price: 1 }

// Text index for search
{ name: "text", description: "text", destination: "text" }
```

**Bookings Collection:**
```javascript
{ email: 1 }
{ status: 1 }
{ createdAt: -1 }
{ packageId: 1 }
{ travelDate: 1 }

// Compound indexes
{ status: 1, createdAt: -1 }
```

**Inquiries Collection:**
```javascript
{ status: 1 }
{ createdAt: -1 }
{ email: 1 }

// Compound index
{ status: 1, createdAt: -1 }
```

**Gallery Collection:**
```javascript
{ category: 1 }
{ destination: 1 }
{ order: 1 }
```

**Users Collection:**
```javascript
{ username: 1 }  // unique
{ email: 1 }     // unique
```

### Step 9: Configure Backup

1. Go to "Backup" in left sidebar
2. Enable "Continuous Backup" (available on M10+ clusters)
3. Configure:
   - **Snapshot Schedule**: Daily at 2 AM
   - **Retention**: 7 days (or longer for compliance)
   - **Point-in-Time Restore**: Enable (allows restore to any point)

### Step 10: Test Connection

Test the connection from your backend:

```javascript
// test-connection.js
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://vibe-holidays-admin:YOUR_PASSWORD@vibe-holidays-prod.xxxxx.mongodb.net/vibe-holidays-prod?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });
```

Run:
```bash
node test-connection.js
```

---

## Self-Hosted MongoDB Setup

For self-hosted MongoDB on your own server (Ubuntu/Debian):

### Step 1: Install MongoDB

```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update package database
sudo apt update

# Install MongoDB
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify installation
sudo systemctl status mongod
```

### Step 2: Configure MongoDB

Edit configuration file:
```bash
sudo nano /etc/mongod.conf
```

Update configuration:
```yaml
# Network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1,YOUR_SERVER_IP

# Security
security:
  authorization: enabled

# Storage
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true

# Logging
systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true

# Replication (optional, for high availability)
# replication:
#   replSetName: "rs0"
```

Restart MongoDB:
```bash
sudo systemctl restart mongod
```

### Step 3: Create Admin User

```bash
# Connect to MongoDB
mongosh

# Switch to admin database
use admin

# Create admin user
db.createUser({
  user: "admin",
  pwd: "STRONG_PASSWORD_HERE",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

# Exit
exit
```

### Step 4: Create Application User

```bash
# Connect with admin user
mongosh -u admin -p --authenticationDatabase admin

# Switch to application database
use vibe-holidays-prod

# Create application user
db.createUser({
  user: "vibe-holidays-admin",
  pwd: "STRONG_PASSWORD_HERE",
  roles: [ { role: "readWrite", db: "vibe-holidays-prod" } ]
})

# Exit
exit
```

### Step 5: Configure Firewall

```bash
# Allow MongoDB port from your backend server IP only
sudo ufw allow from YOUR_BACKEND_IP to any port 27017

# Enable firewall
sudo ufw enable
```

### Step 6: Connection String

```
mongodb://vibe-holidays-admin:YOUR_PASSWORD@YOUR_SERVER_IP:27017/vibe-holidays-prod?authSource=vibe-holidays-prod
```

---

## Database Configuration

### Environment Variables

Add to backend `.env`:

```bash
# MongoDB Atlas
MONGODB_URI=mongodb+srv://vibe-holidays-admin:YOUR_PASSWORD@vibe-holidays-prod.xxxxx.mongodb.net/vibe-holidays-prod?retryWrites=true&w=majority

# Self-Hosted
# MONGODB_URI=mongodb://vibe-holidays-admin:YOUR_PASSWORD@YOUR_SERVER_IP:27017/vibe-holidays-prod?authSource=vibe-holidays-prod
```

### Connection Options

Update `backend/src/config/database.ts` for production:

```typescript
import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vibe-holidays';
    
    await mongoose.connect(mongoURI, {
      // Connection pool size
      maxPoolSize: 10,
      minPoolSize: 2,
      
      // Timeout settings
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      
      // Retry settings
      retryWrites: true,
      retryReads: true,
      
      // Write concern
      w: 'majority',
      
      // Read preference
      readPreference: 'primaryPreferred',
    });
    
    console.log('MongoDB connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};
```

---

## Performance Optimization

### 1. Create Indexes

Already covered above. Verify indexes are created:

```javascript
// In MongoDB shell
use vibe-holidays-prod
db.packages.getIndexes()
db.bookings.getIndexes()
```

### 2. Connection Pooling

Already configured in connection options above. Adjust based on load:
- **Low traffic**: maxPoolSize: 10
- **Medium traffic**: maxPoolSize: 50
- **High traffic**: maxPoolSize: 100

### 3. Query Optimization

Use `.explain()` to analyze queries:

```javascript
db.packages.find({ destination: "Bali" }).explain("executionStats")
```

Look for:
- `IXSCAN` (good - using index)
- `COLLSCAN` (bad - full collection scan)

### 4. Projection

Only fetch needed fields:

```javascript
// Bad - fetches all fields
Package.find({ active: true })

// Good - only fetches needed fields
Package.find({ active: true }).select('name destination price thumbnail')
```

### 5. Pagination

Always paginate large result sets:

```javascript
const page = 1;
const limit = 20;
const skip = (page - 1) * limit;

Package.find({ active: true })
  .limit(limit)
  .skip(skip)
  .sort({ createdAt: -1 })
```

---

## Backup and Recovery

### MongoDB Atlas Backups

Automatic backups are configured in Atlas. To restore:

1. Go to "Backup" tab
2. Select snapshot or point-in-time
3. Click "Restore"
4. Choose restore option:
   - Download snapshot
   - Restore to new cluster
   - Restore to existing cluster

### Self-Hosted Backups

#### Automated Backup Script

```bash
#!/bin/bash
# backup-mongodb.sh

BACKUP_DIR="/backups/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
MONGODB_URI="mongodb://vibe-holidays-admin:PASSWORD@localhost:27017/vibe-holidays-prod?authSource=vibe-holidays-prod"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

Make executable and add to crontab:
```bash
chmod +x backup-mongodb.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /path/to/backup-mongodb.sh >> /var/log/mongodb-backup.log 2>&1
```

#### Restore from Backup

```bash
# Extract backup
tar -xzf /backups/mongodb/20240115_020000.tar.gz -C /tmp

# Restore database
mongorestore --uri="mongodb://vibe-holidays-admin:PASSWORD@localhost:27017/vibe-holidays-prod?authSource=vibe-holidays-prod" /tmp/20240115_020000/vibe-holidays-prod

# Clean up
rm -rf /tmp/20240115_020000
```

---

## Security Best Practices

### 1. Strong Passwords

Generate strong passwords:
```bash
openssl rand -base64 32
```

### 2. Restrict Network Access

- Use IP whitelisting
- Use VPN for database access
- Never expose MongoDB directly to internet

### 3. Enable Authentication

Always enable authentication in production.

### 4. Use SSL/TLS

For self-hosted MongoDB, enable SSL:

```yaml
# /etc/mongod.conf
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
```

### 5. Regular Updates

Keep MongoDB updated:
```bash
sudo apt update
sudo apt upgrade mongodb-org
```

### 6. Audit Logging

Enable audit logging (Enterprise feature):
```yaml
auditLog:
  destination: file
  format: JSON
  path: /var/log/mongodb/audit.json
```

---

## Monitoring

### MongoDB Atlas Monitoring

Built-in monitoring available in Atlas dashboard:
- Real-time metrics
- Query performance
- Index usage
- Connection statistics
- Alerts

Configure alerts:
1. Go to "Alerts" in Atlas
2. Create alert for:
   - High CPU usage (> 80%)
   - High memory usage (> 80%)
   - Slow queries (> 100ms)
   - Connection spikes

### Self-Hosted Monitoring

#### MongoDB Monitoring Tools

1. **MongoDB Compass** (GUI)
   - Download from mongodb.com
   - Connect to your database
   - View performance metrics

2. **mongostat** (CLI)
   ```bash
   mongostat --uri="mongodb://admin:password@localhost:27017" --authenticationDatabase admin
   ```

3. **mongotop** (CLI)
   ```bash
   mongotop --uri="mongodb://admin:password@localhost:27017" --authenticationDatabase admin
   ```

#### Custom Monitoring Script

```javascript
// monitor-db.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

setInterval(async () => {
  const stats = await mongoose.connection.db.stats();
  console.log({
    database: stats.db,
    collections: stats.collections,
    dataSize: (stats.dataSize / 1024 / 1024).toFixed(2) + ' MB',
    indexSize: (stats.indexSize / 1024 / 1024).toFixed(2) + ' MB',
    connections: mongoose.connection.client.topology.s.pool.totalConnectionCount
  });
}, 60000); // Every minute
```

---

## Troubleshooting

### Connection Timeout

**Problem:** `MongoServerSelectionError: connection timed out`

**Solutions:**
- Check network access whitelist in Atlas
- Verify connection string is correct
- Check firewall rules
- Verify MongoDB is running: `sudo systemctl status mongod`

### Authentication Failed

**Problem:** `MongoServerError: Authentication failed`

**Solutions:**
- Verify username and password
- Check authentication database
- Ensure user has correct permissions
- Try connecting with MongoDB Compass to verify credentials

### High Memory Usage

**Problem:** MongoDB using too much memory

**Solutions:**
- MongoDB uses available RAM for caching (normal behavior)
- Adjust WiredTiger cache size:
  ```yaml
  storage:
    wiredTiger:
      engineConfig:
        cacheSizeGB: 2
  ```
- Add more RAM to server
- Optimize queries and indexes

### Slow Queries

**Problem:** Queries taking too long

**Solutions:**
- Check if indexes exist: `db.collection.getIndexes()`
- Use `.explain()` to analyze queries
- Create missing indexes
- Use projection to limit returned fields
- Implement pagination

### Disk Space Full

**Problem:** MongoDB running out of disk space

**Solutions:**
- Check disk usage: `df -h`
- Compact collections: `db.runCommand({ compact: 'collection_name' })`
- Delete old data
- Increase disk size
- Set up log rotation

---

## Quick Reference

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

### Common Commands

```javascript
// Show databases
show dbs

// Use database
use vibe-holidays-prod

// Show collections
show collections

// Count documents
db.packages.countDocuments()

// Find documents
db.packages.find({ active: true })

// Create index
db.packages.createIndex({ destination: 1 })

// Show indexes
db.packages.getIndexes()

// Database stats
db.stats()

// Collection stats
db.packages.stats()
```

### Backup Commands

```bash
# Backup
mongodump --uri="mongodb://..." --out=/backup

# Restore
mongorestore --uri="mongodb://..." /backup

# Backup specific database
mongodump --uri="mongodb://..." --db=vibe-holidays-prod --out=/backup

# Restore specific database
mongorestore --uri="mongodb://..." --db=vibe-holidays-prod /backup/vibe-holidays-prod
```

---

**Recommendation:** Use MongoDB Atlas for production. It's managed, reliable, and includes automatic backups, monitoring, and scaling.
