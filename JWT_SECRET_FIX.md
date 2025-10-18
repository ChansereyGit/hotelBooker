# JWT Secret Key Fix

## ✅ Issue Resolved

The error `Illegal base64 character: '-'` has been fixed!

## 🔧 What Was Wrong

The JWT secret key in `application.yml` contained hyphens and plain text:
```yaml
secret: your-secret-key-change-this-in-production-min-256-bits-long
```

This caused the Base64 decoder to fail because hyphens aren't valid Base64 characters.

## ✅ What Was Fixed

Updated the secret key to a proper Base64-encoded string:
```yaml
secret: 404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
```

This is a 256-bit key encoded in hexadecimal (which is Base64 compatible).

## 🚀 Next Steps

1. **Restart your backend** (if it's still running):
   - Press `Ctrl + C` to stop
   - Run `mvn spring-boot:run` again

2. **Test registration again** in Postman:
   ```json
   POST http://localhost:8080/api/v1/auth/register
   {
     "fullName": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "phoneNumber": "+1234567890"
   }
   ```

3. **You should now get a successful response** with a JWT token!

## 🔒 Security Note

For production, you should:
1. Generate a new random secret key
2. Store it in environment variables
3. Never commit it to version control

### Generate a New Secret Key (Optional)

You can generate a new secure key using:

```bash
# Using OpenSSL
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then update `application.yml` with the new key.

## ✅ Verification

After restarting, you should see:
- ✅ Backend starts without errors
- ✅ Registration returns 200 OK with token
- ✅ Login returns 200 OK with token
- ✅ No more Base64 decoding errors

## 📝 Files Updated

- ✅ `backend/src/main/resources/application.yml` - JWT secret fixed

---

**You're ready to test again!** 🚀
