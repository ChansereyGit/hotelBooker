# Admin Portal - Checkbox Casing Issue Fix

## 🔴 Problem

TypeScript is detecting two files with different casing:
- `Checkbox.jsx` (correct)
- `CheckBox.jsx` (incorrect - doesn't exist but git might have cached it)

This is a common issue on macOS where the file system is case-insensitive but git is case-sensitive.

## ✅ Solution

### Option 1: Git Cache Clear (Quick Fix)

```bash
cd admin-portal

# Remove the file from git cache
git rm --cached src/components/ui/CheckBox.jsx

# Add it back with correct casing
git add src/components/ui/Checkbox.jsx

# Commit the fix
git commit -m "Fix checkbox file casing"
```

### Option 2: Manual Fix (If not using git)

```bash
cd admin-portal

# Delete node_modules and build cache
rm -rf node_modules
rm -rf .next
rm -rf dist
rm -rf build

# Reinstall
npm install

# Try running again
npm run dev
```

### Option 3: Rename the File

```bash
cd admin-portal/src/components/ui

# Rename to temp name first
mv Checkbox.jsx checkbox-temp.jsx

# Then rename to final name
mv checkbox-temp.jsx Checkbox.jsx

# Commit if using git
git add Checkbox.jsx
git commit -m "Fix checkbox casing"
```

## 🚀 Quick Test

After applying the fix:

```bash
cd admin-portal
npm run dev
```

Should start without errors!

## 📝 Note

All imports in your code are already correct:
```javascript
import { Checkbox } from '../../components/ui/Checkbox';
```

The issue is just with git's file tracking or TypeScript's cache.
