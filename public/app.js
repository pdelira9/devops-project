function showDashboard() {
  document.getElementById("authBox").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
}

function showAuth() {
  document.getElementById("authBox").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
}

async function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById("authMsg").innerText = data.message;
}

async function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    showDashboard();
  } else {
    document.getElementById("authMsg").innerText = data.msg;
  }
}

function logout() {
  localStorage.removeItem("token");
  showAuth();
}

async function checkHealth() {
  const res = await fetch('/api/health');
  const data = await res.json();

  document.getElementById('health').innerText =
    JSON.stringify(data, null, 2);
}

// Auto login
if (localStorage.getItem("token")) {
  showDashboard();
} else {
  showAuth();
}