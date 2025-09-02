# 🚀 Development Guide - Run Frontend & Backend Simultaneously

This guide shows you how to run both the frontend and backend simultaneously with real-time changes.

## 🎯 **Quick Start (Recommended)**

### **Option 1: PowerShell Script (Best for Windows)**

```powershell
# Run the development setup script
.\dev-setup.ps1
```

### **Option 2: Batch File**

```cmd
# Run the development setup batch file
dev-setup.bat
```

### **Option 3: Manual Setup**

```bash
# Terminal 1: Start backend with auto-restart
npm run dev:sqlite

# Terminal 2: Open frontend in browser
start http://localhost:5000/public/index.html
```

## 🔧 **What Each Option Does**

### **PowerShell Script (`dev-setup.ps1`)**

- ✅ Automatically closes any existing processes on port 5000
- ✅ Starts backend server with nodemon (auto-restart on changes)
- ✅ Waits for backend to be ready
- ✅ Opens frontend in your default browser
- ✅ Provides interactive development tips
- ✅ Clean shutdown when you're done

### **Batch File (`dev-setup.bat`)**

- ✅ Starts backend server in a new terminal window
- ✅ Opens frontend in browser
- ✅ Simple and straightforward

### **Manual Setup**

- ✅ Full control over each process
- ✅ See all logs in real-time
- ✅ Easy to debug

## 📱 **Real-Time Development Features**

### **Backend Auto-Restart**

- **nodemon** watches all `.js` files
- **Auto-restarts** server when you save changes
- **No manual restart needed**
- **See changes immediately**

### **Frontend Changes**

- **Edit `public/index.html`** to see UI changes
- **Refresh browser** to see updates
- **All changes are live**

### **Database Changes**

- **SQLite database** updates in real-time
- **See user data** as you create accounts
- **Test login/logout** immediately

## 🌐 **Access Points**

| Service          | URL                                       | Description              |
| ---------------- | ----------------------------------------- | ------------------------ |
| **Frontend**     | `http://localhost:5000/public/index.html` | Main application         |
| **Backend API**  | `http://localhost:5000/api/auth`          | Authentication endpoints |
| **Health Check** | `http://localhost:5000/health`            | Server status            |
| **Main Server**  | `http://localhost:5000/`                  | Server info              |

## 🔄 **Development Workflow**

### **1. Start Development Environment**

```powershell
.\dev-setup.ps1
```

### **2. Make Changes**

- **Backend**: Edit any `.js` file → Server auto-restarts
- **Frontend**: Edit `index.html` → Refresh browser
- **Database**: Changes are immediate

### **3. Test Changes**

- Create new user accounts
- Test login/logout
- Verify API responses
- Check database data

### **4. Stop Development**

- Press any key in PowerShell script
- Or `Ctrl+C` in terminal

## 📝 **File Structure for Development**

```
auth/
├── 📁 config/           # Database configuration
├── 📁 middleware/       # Authentication middleware
├── 📁 models/           # User models
├── 📁 routes/           # API routes
├── 📁 utils/            # JWT utilities
├── 📁 public/           # Frontend files
│   └── 📄 index.html    # Main frontend (edit here)
├── 📁 data/             # SQLite database files
├── 📄 server-sqlite.js  # Main server (edit here)
├── 📄 dev-setup.ps1     # Development script
└── 📄 dev-setup.bat     # Development batch file
```

## 🎨 **Frontend Development**

### **Edit `public/index.html`**

- **CSS**: Change styles, colors, layout
- **JavaScript**: Modify authentication logic
- **HTML**: Update forms, buttons, text
- **Refresh browser** to see changes

### **Example Changes**

```html
<!-- Change button color -->
<button class="btn" style="background: red;">Login</button>

<!-- Add new field -->
<input type="text" placeholder="Username" />

<!-- Modify text -->
<h1>My Custom Auth System</h1>
```

## ⚙️ **Backend Development**

### **Edit Server Files**

- **`server-sqlite.js`**: Main server logic
- **`routes/auth-sqlite.js`**: API endpoints
- **`models/User-sqlite.js`**: Database operations
- **`middleware/auth-sqlite.js`**: Authentication logic

### **Example Changes**

```javascript
// Add new route
app.get("/api/test", (req, res) => {
  res.json({ message: "New endpoint!" });
});

// Modify validation
if (password.length < 8) {
  // Change from 6 to 8
  return res.status(400).json({
    message: "Password must be at least 8 characters",
  });
}
```

## 🗄️ **Database Development**

### **SQLite Database**

- **Location**: `data/auth.db`
- **Tables**: `users`, `refresh_tokens`
- **Real-time**: Changes are immediate
- **No setup**: Automatically created

### **View Database**

```bash
# Install SQLite browser (optional)
# Or use VS Code SQLite extension
# Database file: data/auth.db
```

## 🚨 **Troubleshooting**

### **Port Already in Use**

```powershell
# PowerShell script automatically handles this
# Or manually:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### **Backend Not Starting**

- Check `.env` file exists
- Verify all dependencies installed
- Check console for error messages

### **Frontend Not Loading**

- Ensure backend is running
- Check browser console for errors
- Verify URL: `http://localhost:5000/public/index.html`

### **Database Issues**

- Check `data/` directory exists
- Verify SQLite dependencies installed
- Check server logs for database errors

## 🎉 **Ready to Develop!**

1. **Run**: `.\dev-setup.ps1`
2. **Edit**: Any file you want to change
3. **Test**: See changes immediately
4. **Enjoy**: Real-time development experience!

The system will automatically:

- ✅ Start backend with auto-restart
- ✅ Open frontend in browser
- ✅ Handle all port conflicts
- ✅ Provide development tips
- ✅ Clean shutdown when done
