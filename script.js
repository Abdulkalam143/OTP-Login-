/* =============================================
   VERIFI — OTP LOGIN SYSTEM
   script.js
   =============================================
   HOW THE OTP LOGIC WORKS (Step-by-Step):
   ─────────────────────────────────────────
   1. User enters a valid email address.
   2. On "Send OTP":
      a. Validate the email using a regex pattern.
      b. Generate a cryptographically random 6-digit OTP
         using Math.random() — always 6 digits (100000–999999).
      c. Store the OTP in memory (variable `currentOTP`).
      d. Log OTP to the DevTools console (simulates email delivery).
      e. Transition to Step 2 (OTP entry screen).
      f. Start a 30-second resend countdown timer.
   3. User enters 6 digits across 6 separate input boxes.
      a. Each digit auto-advances focus to the next box.
      b. Backspace moves focus back to the previous box.
      c. Only numeric input is accepted.
   4. On "Verify OTP":
      a. Collect all 6 box values and join into a string.
      b. Compare with stored `currentOTP`.
      c. Match → show Step 3 (success screen).
      d. No match → shake animation + error message.
   5. Resend OTP resets the flow for a fresh OTP + new timer.
   ============================================= */

"use strict";

/* ── State ── */
let currentOTP   = "";    // The generated OTP stored in memory
let resendTimer  = null;  // Interval reference for countdown
let timerSeconds = 30;    // Countdown duration

/* ── DOM References ── */
const stepMobile  = document.getElementById("step-mobile");
const stepOTP     = document.getElementById("step-otp");
const stepSuccess = document.getElementById("step-success");

const mobileInput  = document.getElementById("mobile-input");
const mobileGroup  = document.getElementById("mobile-group");
const mobileError  = document.getElementById("mobile-error");
const sendBtn      = document.getElementById("send-otp-btn");

const otpBoxes     = document.querySelectorAll(".otp-box");
const otpError     = document.getElementById("otp-error");
const verifyBtn    = document.getElementById("verify-btn");
const displayNum   = document.getElementById("display-number");

const resendText   = document.getElementById("resend-text");
const resendBtn    = document.getElementById("resend-btn");
const timerCount   = document.getElementById("timer-count");

/* ═══════════════════════════════════════════
   STEP 1 — EMAIL VALIDATION & OTP SEND
   ═══════════════════════════════════════════ */

/**
 * Validates email address input.
 * Accepts standard email format: user@domain.tld
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Generates a 6-digit OTP.
 * Math.random() with Math.floor ensures always 6 digits: 100000–999999.
 *
 * In a real app, OTP generation & validation happen server-side.
 */
function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return String(otp);
}

/**
 * Main handler for "Send OTP" button.
 * Validates email → generates OTP → transitions to step 2.
 */
function sendOTP() {
  const email = mobileInput.value.trim();

  // Validate email
  if (!validateEmail(email)) {
    setMobileError("Please enter a valid email address.");
    mobileGroup.classList.add("error");
    mobileInput.focus();
    return;
  }

  clearMobileError();
  showLoading(true);

  // Simulate network delay (350ms) for UX realism
  setTimeout(() => {
    // ── Generate & store OTP ──
    currentOTP = generateOTP();

    // ── Log OTP to console (replaces email delivery in this demo) ──
    console.log(
      `%c🔐 OTP for ${email}: ${currentOTP}`,
      "background:#6C63FF; color:#fff; padding:6px 14px; border-radius:8px; font-size:15px; font-weight:bold;"
    );

    // ── Update UI ──
    displayNum.textContent = email;
    showLoading(false);
    showStep(stepOTP);
    clearOTPBoxes();

    // ── Start 30s resend timer ──
    startResendTimer();

    // ── Focus first OTP box ──
    otpBoxes[0].focus();

  }, 350);
}

/** Show/hide loading spinner on Send OTP button */
function showLoading(isLoading) {
  const label   = sendBtn.querySelector(".btn-label");
  const spinner = sendBtn.querySelector(".btn-spinner");

  if (isLoading) {
    label.hidden     = true;
    spinner.hidden   = false;
    sendBtn.disabled = true;
  } else {
    label.hidden     = false;
    spinner.hidden   = true;
    sendBtn.disabled = false;
  }
}

/* ═══════════════════════════════════════════
   STEP 2 — OTP BOX INTERACTIONS
   ═══════════════════════════════════════════ */

/**
 * Attach event listeners to each OTP input box.
 * Handles: input, keydown (backspace), paste, focus.
 */
otpBoxes.forEach((box, index) => {

  /* Allow only single digits */
  box.addEventListener("input", (e) => {
    const val = e.target.value;

    // Strip non-numeric characters immediately
    box.value = val.replace(/\D/g, "").slice(-1); // keep last digit if >1 char

    if (box.value) {
      box.classList.add("filled");
      clearOTPError();
      // Auto-advance to next box
      if (index < otpBoxes.length - 1) {
        otpBoxes[index + 1].focus();
      }
    } else {
      box.classList.remove("filled");
    }
  });

  /* Backspace: clear current or move to previous */
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace") {
      if (box.value) {
        // Clear current box
        box.value = "";
        box.classList.remove("filled");
      } else if (index > 0) {
        // Move to previous box and clear it
        const prev = otpBoxes[index - 1];
        prev.value = "";
        prev.classList.remove("filled");
        prev.focus();
      }
    }

    // Arrow key navigation
    if (e.key === "ArrowLeft"  && index > 0)                    otpBoxes[index - 1].focus();
    if (e.key === "ArrowRight" && index < otpBoxes.length - 1) otpBoxes[index + 1].focus();
  });

  /* Handle paste: spread 6 digits across boxes */
  box.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData)
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pasted.length === 6) {
      pasted.split("").forEach((digit, i) => {
        otpBoxes[i].value = digit;
        otpBoxes[i].classList.add("filled");
      });
      otpBoxes[5].focus(); // Focus last box
      clearOTPError();
    }
  });

  /* Select text on focus (for easy overwrite) */
  box.addEventListener("focus", () => box.select());
});

/* ═══════════════════════════════════════════
   STEP 2 — OTP VERIFICATION
   ═══════════════════════════════════════════ */

/**
 * Collects digits from all 6 boxes and compares with stored OTP.
 * Shows success or triggers shake + error.
 */
function verifyOTP() {
  const entered = Array.from(otpBoxes)
    .map(box => box.value)
    .join("");

  // Ensure all boxes are filled
  if (entered.length < 6) {
    setOTPError("Please enter all 6 digits.");
    shakeBoxes();
    return;
  }

  if (entered === currentOTP) {
    // ✅ Correct OTP
    stopResendTimer();
    showStep(stepSuccess);
    console.log("%c✅ OTP Verified Successfully!", "color:#29d699; font-weight:bold; font-size:14px;");
  } else {
    // ❌ Wrong OTP
    setOTPError("Incorrect code. Please try again.");
    shakeBoxes();
    console.warn("❌ OTP mismatch. Expected:", currentOTP, "Got:", entered);
  }
}

/** Animate all OTP boxes with a shake */
function shakeBoxes() {
  otpBoxes.forEach(box => {
    box.classList.remove("shake");
    // Force reflow to restart animation
    void box.offsetWidth;
    box.classList.add("shake");
  });

  // Remove class after animation ends
  setTimeout(() => {
    otpBoxes.forEach(box => box.classList.remove("shake"));
  }, 450);
}

/* ═══════════════════════════════════════════
   RESEND TIMER
   ═══════════════════════════════════════════ */

/**
 * Starts a 30-second countdown.
 * While counting: hides "Resend" button, shows timer text.
 * After countdown: shows "Resend" button, hides timer text.
 */
function startResendTimer() {
  timerSeconds = 30;
  timerCount.textContent = timerSeconds;

  resendText.hidden = false;
  resendBtn.classList.add("hidden");

  stopResendTimer(); // Clear any existing interval

  resendTimer = setInterval(() => {
    timerSeconds--;
    timerCount.textContent = timerSeconds;

    if (timerSeconds <= 0) {
      stopResendTimer();
      resendText.hidden = true;
      resendBtn.classList.remove("hidden");
    }
  }, 1000);
}

function stopResendTimer() {
  if (resendTimer) {
    clearInterval(resendTimer);
    resendTimer = null;
  }
}

/**
 * Resend OTP: generate a fresh OTP and restart the timer.
 */
function resendOTP() {
  currentOTP = generateOTP();

  const email = mobileInput.value.trim();
  console.log(
    `%c🔄 Resent OTP for ${email}: ${currentOTP}`,
    "background:#FF6584; color:#fff; padding:6px 14px; border-radius:8px; font-size:15px; font-weight:bold;"
  );

  clearOTPBoxes();
  clearOTPError();
  startResendTimer();
  otpBoxes[0].focus();
}

/* ═══════════════════════════════════════════
   NAVIGATION HELPERS
   ═══════════════════════════════════════════ */

/** Navigate back to Step 1 */
function goBack() {
  stopResendTimer();
  clearOTPBoxes();
  clearOTPError();
  clearMobileError();
  showStep(stepMobile);
  mobileInput.focus();
}

/** Restart the entire flow */
function restart() {
  stopResendTimer();
  currentOTP = "";
  mobileInput.value = "";
  clearOTPBoxes();
  clearOTPError();
  clearMobileError();
  showStep(stepMobile);
  mobileInput.focus();
}

/**
 * Show a specific step by hiding others and revealing the target.
 */
function showStep(targetStep) {
  [stepMobile, stepOTP, stepSuccess].forEach(step => {
    step.classList.add("hidden");
  });
  targetStep.classList.remove("hidden");
}

/* ═══════════════════════════════════════════
   INPUT GUARDS
   ═══════════════════════════════════════════ */

/**
 * Clear error as user types a valid-looking email.
 * NOTE: We do NOT strip characters here — the browser handles
 * email input natively. We only clear the error state.
 */
mobileInput.addEventListener("input", () => {
  if (mobileInput.value.length > 0) {
    clearMobileError();
    mobileGroup.classList.remove("error");
  }
});

/** Allow "Send OTP" via Enter key on email input */
mobileInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendOTP();
});

/** Allow "Verify" via Enter key when on OTP step */
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !stepOTP.classList.contains("hidden")) {
    verifyOTP();
  }
});

/* ── Error Helpers ── */
function setMobileError(msg) {
  mobileError.textContent = "⚠ " + msg;
  mobileGroup.classList.add("error");
}

function clearMobileError() {
  mobileError.textContent = "";
  mobileGroup.classList.remove("error");
}

function setOTPError(msg) {
  otpError.textContent = "⚠ " + msg;
}

function clearOTPError() {
  otpError.textContent = "";
}

function clearOTPBoxes() {
  otpBoxes.forEach(box => {
    box.value = "";
    box.classList.remove("filled", "shake");
  });
}