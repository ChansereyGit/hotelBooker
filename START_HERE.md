# 🎯 START HERE - Complete Setup Guide

## 📋 What You Need to Do

Follow these steps in order to get your hotel booking system running.

---

## Step 1: Install Dependencies (5 minutes)

```bash
# macOS
brew install postgresql@14 redis maven

# Start services
brew services start postgresql@14
brew services start redis
```

**Verify installation:**
```bash
psql --version        # Should show PostgreSQL 14.x
redis-cli --version   # Should show Redis 6.x or higher
mvn --version         # Should show Maven 3.8.x or higher
```

---

## Step 2: Setup Database (2 minutes)

```bash
# Create database
createdb hotelbooker

# Verify it was created
psql -U root -l | grep hotelbooker
```

**Note**: Your PostgreSQL credentials are:
- Username: `root`
- Password: `Admin`

These are already configured in `backend/src/main/resources/application.yml`

---

## Step 3: Start Backend (2 minutes)

```bash
cd backend
mvn spring-boot:run
```

**Wait for this message:**
```
Started HotelBookingApplication in X.XXX seconds
```

**Backend is now running on:** `http://localhost:8080/api/v1`

---

## Step 4: Add Sample Data (3 minutes)

1. **Open your PostgreSQL client** (pgAdmin, DBeaver, or psql)

2. **Connect to database:**
   - Host: `localhost`
   - Port: `5432`
   - Database: `hotelbooker`
   - Username: `root`
   - Password: `Admin`

3. **Run the SQL from:** `POSTMAN_TESTING_GUIDE.md` (Step 4)
   - Or copy from `QUICK_TEST_COMMANDS.md`

This will create:
- 2 sample hotels
- 1 sample room
- Hotel amenities

---

## Step 5: Test with Postman (15 minutes)

### Quick Setup

1. **Download Postman** (if not installed)
   - https://www.postman.com/downloads/

2. **Create Collection**
   - Name: "Hotel Booking API"
   - Add variable: `baseUrl` = `http://localhost:8080/api/v1`

3. **Follow the guide**
   - Open: `POSTMAN_TESTING_GUIDE.md`
   - Complete all 15 test cases

### Quick Test Sequence

1. ✅ Register User
2. ✅ Login User (save token)
3. ✅ Search Hotels
4. ✅ Get Hotel Details
5. ✅ Get Hotel Rooms
6. ✅ Create Booking (with token)
7. ✅ View Bookings (with token)
8. ✅ Cancel Booking (with token)

---

## Step 6: Integrate with Flutter (30 minutes)

Once backend tests pass:

1. **Read:** `backend/FLUTTER_INTEGRATION.md`
2. **Create:** Flutter API services
3. **Update:** Login screen
4. **Test:** End-to-end flow

---

## 📚 Documentation Map

### Getting Started
- **START_HERE.md** ← You are here
- **QUICK_START.md** - Quick overview
- **backend/SETUP.md** - Detailed setup

### Testing
- **POSTMAN_TESTING_GUIDE.md** ← Complete Postman guide (15 tests)
- **QUICK_TEST_COMMANDS.md** - Quick reference

### Development
- **backend/FLUTTER_INTEGRATION.md** - Flutter integration
- **IMPLEMENTATION_CHECKLIST.md** - Track progress

### Architecture
- **PROJECT_OVERVIEW.md** - Complete overview
- **ARCHITECTURE_DIAGRAM.md** - Visual diagrams
- **WHAT_WE_BUILT.md** - Features summary

---

## ✅ Success Checklist

### Backend Setup
- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Maven installed
- [ ] Database `hotelbooker` created
- [ ] Backend starts without errors
- [ ] Can access http://localhost:8080/api/v1

### Testing
- [ ] Can register a user
- [ ] Can login and get JWT token
- [ ] Sample data inserted
- [ ] Can search hotels
- [ ] Can get hotel details
- [ ] Can create booking with token
- [ ] Can view bookings with token
- [ ] Can cancel booking with token

### Ready for Flutter
- [ ] All backend tests pass
- [ ] Understand API endpoints
- [ ] Have sample data in database
- [ ] Backend running smoothly

---

## 🎯 Your Current Status

```
✅ Backend Code      - COMPLETE (33 Java files)
✅ Documentation     - COMPLETE (10+ guides)
✅ Database Config   - COMPLETE (root/Admin)
🔄 Backend Testing   - IN PROGRESS (follow POSTMAN_TESTING_GUIDE.md)
⏳ Flutter Integration - NEXT STEP
⏳ Deployment        - FUTURE
```

---

## 🚀 Quick Commands Reference

### Start Backend
```bash
cd backend
mvn spring-boot:run
```

### Stop Backend
```
Ctrl + C
```

### Check Services
```bash
brew services list
```

### Restart PostgreSQL
```bash
brew services restart postgresql@14
```

### Restart Redis
```bash
brew services restart redis
```

### View Database
```bash
psql -U root -d hotelbooker
```

---

## 🐛 Common Issues

### "Port 8080 already in use"
```bash
lsof -ti:8080 | xargs kill -9
```

### "Database does not exist"
```bash
createdb hotelbooker
```

### "Connection refused to PostgreSQL"
```bash
brew services start postgresql@14
```

### "Redis connection failed"
```bash
brew services start redis
```

### "401 Unauthorized in Postman"
- Token expired (24 hours)
- Login again to get new token
- Make sure to add `Bearer ` prefix

---

## 💡 Pro Tips

1. **Keep backend running** while testing
2. **Save your Postman collection** for reuse
3. **Check backend console** for error messages
4. **Use Postman variables** for tokens and IDs
5. **Test one endpoint at a time** before moving to next

---

## 📞 Need Help?

| Issue | Check This File |
|-------|----------------|
| Setup problems | `backend/SETUP.md` |
| Testing with Postman | `POSTMAN_TESTING_GUIDE.md` |
| Quick commands | `QUICK_TEST_COMMANDS.md` |
| Flutter integration | `backend/FLUTTER_INTEGRATION.md` |
| Architecture questions | `ARCHITECTURE_DIAGRAM.md` |
| Track progress | `IMPLEMENTATION_CHECKLIST.md` |

---

## 🎉 Next Steps

1. **Right now**: Follow `POSTMAN_TESTING_GUIDE.md`
2. **After testing**: Follow `backend/FLUTTER_INTEGRATION.md`
3. **Track progress**: Use `IMPLEMENTATION_CHECKLIST.md`

---

## 🎯 Your Goal Today

✅ Get backend running
✅ Complete all Postman tests
✅ Understand how the API works

**Tomorrow**: Start Flutter integration

---

**You're ready to start! Open `POSTMAN_TESTING_GUIDE.md` and begin testing!** 🚀

Good luck! 🎉
