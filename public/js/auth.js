const API_BASE_URL = "http://localhost:5000/api/auth";
let currentUser = null;
let accessToken = localStorage.getItem("accessToken");
let refreshToken = localStorage.getItem("refreshToken");

// Check if user is already logged in
if (accessToken && refreshToken) {
  console.log("Existing tokens found. Checking auth status...");
  checkAuthStatus();
}

function toggleForms() {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  const showingLogin = loginForm.classList.contains("hidden");
  if (showingLogin) {
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
  } else {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  }
  console.log(
    `Form toggled. Now showing: ${showingLogin ? "login" : "signup"}`
  );

  // Clear alerts
  document.getElementById("loginAlert").innerHTML = "";
  document.getElementById("signupAlert").innerHTML = "";
}

function showAlert(formId, message, type) {
  const alertDiv = document.getElementById(formId + "Alert");
  alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
  console.log(`Alert shown [${formId}] (${type}):`, message);
}

function setLoading(formId, isLoading) {
  const form = document.getElementById(formId);
  const btn = form.querySelector(".btn");

  if (isLoading) {
    form.classList.add("loading");
    btn.textContent = "Loading...";
  } else {
    form.classList.remove("loading");
    btn.textContent = formId === "loginForm" ? "Login" : "Sign Up";
  }
  console.log(`Loading state for ${formId}:`, isLoading);
}

async function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (!email || !password) {
    showAlert("signup", "Please fill in all fields", "error");
    return;
  }

  if (password.length < 6) {
    showAlert("signup", "Password must be at least 6 characters long", "error");
    return;
  }

  setLoading("signupForm", true);
  console.log("Signup attempt for:", email);

  try {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showAlert("signup", data.message, "success");

      // Store tokens
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Update global variables
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      currentUser = data.data.user;

      console.log("Signup success. User:", currentUser);

      // Show profile after 1 second
      setTimeout(() => {
        showProfile();
      }, 1000);
    } else {
      console.warn("Signup failed:", data.message);
      showAlert("signup", data.message, "error");
    }
  } catch (error) {
    console.error("Signup error:", error);
    showAlert("signup", "An error occurred. Please try again.", "error");
  } finally {
    setLoading("signupForm", false);
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showAlert("login", "Please fill in all fields", "error");
    return;
  }

  setLoading("loginForm", true);
  console.log("Login attempt for:", email);

  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      showAlert("login", data.message, "success");

      // Store tokens
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Update global variables
      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;
      currentUser = data.data.user;

      console.log("Login success. User:", currentUser);

      // Show profile after 1 second
      setTimeout(() => {
        showProfile();
      }, 1000);
    } else {
      console.warn("Login failed:", data.message);
      showAlert("login", data.message, "error");
    }
  } catch (error) {
    console.error("Login error:", error);
    showAlert("login", "An error occurred. Please try again.", "error");
  } finally {
    setLoading("loginForm", false);
  }
}

async function checkAuthStatus() {
  console.log("Checking auth status with existing access token...");
  try {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      currentUser = data.data.user;
      console.log("Auth check OK. User:", currentUser);
      showProfile();
    } else {
      console.warn("Access token might be expired. Attempting refresh...");
      // Token might be expired, try to refresh
      await refreshAccessToken();
    }
  } catch (error) {
    console.error("Auth check failed:", error);
    logout();
  }
}

async function refreshAccessToken() {
  console.log("Refreshing access token...");
  try {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (data.success) {
      // Update tokens
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      accessToken = data.data.accessToken;
      refreshToken = data.data.refreshToken;

      console.log("Token refresh successful.");

      // Retry the original request
      await checkAuthStatus();
    } else {
      console.warn("Token refresh failed. Logging out.");
      logout();
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    logout();
  }
}

function showProfile() {
  document.getElementById("loginForm").classList.add("hidden");
  document.getElementById("signupForm").classList.add("hidden");
  document.getElementById("profileSection").classList.remove("hidden");

  const profileInfo = document.getElementById("profileInfo");
  profileInfo.innerHTML = `
        <p><strong>Email:</strong> ${currentUser.email}</p>
        <p><strong>User ID:</strong> ${currentUser.id}</p>
        <p><strong>Member since:</strong> ${new Date(
          currentUser.created_at
        ).toLocaleDateString()}</p>
    `;
  console.log("Profile displayed for:", currentUser?.email);
}

async function logout() {
  console.log("Logging out...");
  try {
    if (accessToken) {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear everything
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    accessToken = null;
    refreshToken = null;
    currentUser = null;

    // Show login form
    document.getElementById("profileSection").classList.add("hidden");
    document.getElementById("loginForm").classList.remove("hidden");

    // Clear forms
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginPassword").value = "";
    document.getElementById("signupEmail").value = "";
    document.getElementById("signupPassword").value = "";

    // Clear alerts
    document.getElementById("loginAlert").innerHTML = "";
    document.getElementById("signupAlert").innerHTML = "";

    console.log("Logged out and UI reset.");
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Login form submit
  const loginBtn = document.getElementById("loginBtn");
  if (loginBtn) {
    loginBtn.addEventListener("click", login);
  }

  // Signup form submit
  const signupBtn = document.getElementById("signupBtn");
  if (signupBtn) {
    signupBtn.addEventListener("click", signup);
  }

  // Toggle buttons
  const toggleToSignupBtn = document.getElementById("toggleToSignup");
  const toggleToLoginBtn = document.getElementById("toggleToLogin");

  if (toggleToSignupBtn) {
    toggleToSignupBtn.addEventListener("click", toggleForms);
  }

  if (toggleToLoginBtn) {
    toggleToLoginBtn.addEventListener("click", toggleForms);
  }

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }

  console.log("Auth UI initialized.");
});
