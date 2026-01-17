
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { auth, db, isFirebaseConfigured, googleProvider } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  updatePassword,
  PhoneAuthProvider,
  ConfirmationResult,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import { setDoc, doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import emailjs from '@emailjs/browser';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}

const Auth: React.FC = () => {
  const { user } = useShop();
  const navigate = useNavigate();

  // Redirect if already logged in - wait for loading to be complete
  useEffect(() => {
    if (user) {
      console.log("Auth: User detected, checking role...", user.role);
      if (user.role === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/catalog');
      }
    }
  }, [user, navigate]);

  // existing state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Email OTP State
  const [mode, setMode] = useState<'email' | 'otp_verify' | 'update_password' | 'forgot_request'>('email');
  const [resetEmail, setResetEmail] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Signup State
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    localStorage.setItem('axora_pending_role', role);

    // ADMIN LOGIN CHECK (Case insensitive email, strict password)
    // Using trim() to handle accidental spaces
    if (email.trim().toLowerCase() === 'admin@gmail.com' && password.trim() === 'Axo1515') {
      console.log("Admin Login Detected - Authenticating with Firebase...");
      try {
        // Try to login normally first
        await signInWithEmailAndPassword(auth, email, password);
      } catch (adminErr: any) {
        // If admin doesn't exist yet, create it automatically
        if (adminErr.code === 'auth/user-not-found' || adminErr.code === 'auth/invalid-credential') {
          console.log("Admin account not found, creating it...");
          await createUserWithEmailAndPassword(auth, email, password);
        } else {
          // If password wrong or other error, let standard error handling catch it?
          // Actually, we want to enforce Axo1515, so if we are here, we know password IS 'Axo1515'
          // so the only error could be network or such.
          throw adminErr;
        }
      }

      // If we reach here, we are signed in as admin@gmail.com
      sessionStorage.setItem('axo_admin_auth', 'true');
      setLoading(false);
      navigate('/admin');

      // Force reload to ensure auth state propogates if needed, 
      // though navigate might be enough if listeners fire.
      // A reload is safer for role switching.
      setTimeout(() => window.location.reload(), 100);
      return;
    }

    if (!isFirebaseConfigured) {
      // Simulation mode with Persistence
      // 1. Load the "Mock DB"
      const storedDb = localStorage.getItem('axora_users_db');
      const mockDb: Record<string, any> = storedDb ? JSON.parse(storedDb) : {};

      // 2. Check if user exists (Simple email lookup)
      let targetUser = Object.values(mockDb).find((u: any) => u.email === email);

      if (isLogin) {
        if (!targetUser) {
          setError("User not found in simulation. Please sign up.");
          setLoading(false);
          return;
        }
        // Login Success: Load their data into session
        localStorage.setItem('axora_sim_user', JSON.stringify(targetUser));
      } else {
        // Sign Up
        if (targetUser) {
          setError("Email already exists in simulation. Please login.");
          setLoading(false);
          return;
        }

        // Create new user
        const newUid = 'sim_' + Date.now();
        const newUser = {
          uid: newUid,
          name: name || email.split('@')[0],
          email,
          role,
          orderHistory: [],
          savedAddress: undefined,
          cart: [],
          favourites: []
        };

        // Save to Mock DB
        mockDb[newUid] = newUser;
        localStorage.setItem('axora_users_db', JSON.stringify(mockDb));

        // Set User Session
        localStorage.setItem('axora_sim_user', JSON.stringify(newUser));
      }

      // Force reload to pick up local storage change in ShopContext
      window.location.reload();
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // FORCE RELOAD to ensure ShopContext re-initializes and fetches the latest role
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          await setDoc(doc(db, "users", userCredential.user.uid), {
            name,
            email,
            phoneNumber,
            role,
            createdAt: new Date().toISOString(),
            orderHistory: []
          });
        } catch (e) { console.error("Profile creation failed", e); }
        navigate(role === 'seller' ? '/seller/dashboard' : '/catalog');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      if (err.code === 'auth/invalid-credential') {
        setError("Invalid email or password.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("Email already in use. Please login.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else {
        setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    localStorage.setItem('axora_pending_role', role);

    if (!isFirebaseConfigured) {
      const simUser = {
        uid: 'sim_google_' + Date.now(),
        name: 'Google User',
        email: 'google@example.com',
        role: 'buyer',
        orderHistory: []
      };
      localStorage.setItem('axora_sim_user', JSON.stringify(simUser));
      window.location.reload();
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      setMessage("Login Successful! Redirecting...");

      // Ensure profile exists before reloading
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || 'Maison Member',
            email: user.email,
            role: role, // Use the selected role (buyer or seller)
            createdAt: new Date().toISOString(),
            orderHistory: []
          });
          console.log("Auth: New Google profile created with role:", role);
        }
      } catch (error) {
        console.warn("Profile sync failed (non-critical):", error);
      }

      // Navigate after profile is guaranteed
      setTimeout(() => {
        window.location.reload();
      }, 500);

    } catch (err: any) {
      console.error("Google Auth Error:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Sign in cancelled by user.");
      } else if (err.code === 'auth/cancelled-popup-request') {
        setError("Another popup request is active.");
      } else {
        setError("Google Sign In failed: " + err.message);
      }
    } finally {
      if (!message) setLoading(false);
    }
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'normal',
        'callback': () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError('Recaptcha expired, please try again.');
        }
      });
    }
  };


  const sendEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return setError('Please enter your registered email');
    setError('');
    setMessage('');
    setLoading(true);

    // OPTIMIZATION: Immediate UI feedback (Optimistic UI)
    // We start the process, but we will transition the UI as soon as we verified user existence (or decided to proceed).

    try {
      // 1. Check if user exists in Firestore efficiently
      const usersRef = collection(db, "users");
      // Use exact match query. Scanning all users is dangerous for performance.
      const q = query(usersRef, where("email", "==", resetEmail));

      // If you really need case-insensitive, store a "emailLowercase" field in DB. 
      // For now, we will trust the exact match or try a simple assumption if not strict.
      const exactMatchSnapshot = await getDocs(q);

      let targetUserDoc = null;
      let userData = { email: resetEmail, name: "User" };

      if (!exactMatchSnapshot.empty) {
        targetUserDoc = exactMatchSnapshot.docs[0];
        userData = targetUserDoc.data() as any;
      } else {
        // If not found by exact match, we can optionally warn or just proceed 
        // (security by obscurity: don't reveal if email exists).
        // For this app, let's assume valid for the sake of "sending" to avoid blocking.
        // REMOVED: The "Fetch All Users" scan. It is too slow.
      }

      // 2. Generate OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);

      // 3. Optimistic UI Update: Switch IMMEDIATELY
      setMode('otp_verify');
      setMessage(`Sending code to ${resetEmail}...`);
      setLoading(false); // Stop invalidating the UI

      // 4. Send via EmailJS in BACKGROUND (non-blocking)
      emailjs.send(
        'service_z3crw8g',
        'template_usujwjl',
        {
          to_email: userData.email,
          otp_code: code,
          to_name: userData.name || "User"
        },
        'NUfiKI0BsQ8lMnczO'
      ).then(() => {
        setMessage(`OTP code sent to ${resetEmail} `);
      }).catch((err) => {
        console.error("EmailJS Error:", err);
        setError('Failed to send email. Please click "Resend Code".');
        // We stay on the verify screen so they can try again or check spam.
      });

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error preparing OTP.');
      setLoading(false);
    }
  };

  const verifyEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp) return setError('Please enter the OTP code');

    setLoading(true);
    // Simple string comparison
    if (enteredOtp === generatedOtp) {
      setMessage('Verified successfully! redirecting...');

      try {
        // Implement "Login via OTP" flow (Simulated Auth for this session).
        const usersRef = collection(db, "users");
        // EFFICIENT QUERY: Only check the specific email
        const q = query(usersRef, where("email", "==", resetEmail));
        const userSnap = await getDocs(q);

        let userData = { name: 'Member', role: 'buyer' };
        let uid = 'otp_' + Date.now();

        if (!userSnap.empty) {
          // Found exact match
          userData = userSnap.docs[0].data() as any;
          uid = userSnap.docs[0].id;
        } else {
          // If not found, create a temporary session or handle as new user
          // We do NOT scan the whole DB anymore.
        }

        const fakeAuthUser = {
          uid: uid,
          email: resetEmail,
          name: userData.name || 'User', // Fix: match 'User' interface
          role: userData.role || role || 'buyer',
          orderHistory: [] // Fix: match 'User' interface
        };

        // Save to local storage to persist "OTP Session"
        localStorage.setItem('axora_otp_user', JSON.stringify(fakeAuthUser));

        // RESET & REDIRECT: Use window.location.reload() or let useEffect handle it
        setTimeout(() => {
          window.location.reload();
        }, 800);

      } catch (e) {
        console.error(e);
        setError('Login failed during session creation.');
        setLoading(false);
      }
    } else {
      setError('Invalid Code. Please check your email again.');
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    // If we are here, we are assuming we might be logged in or just skipping.
    // Since we likely aren't logged in (OTP flow), this step is mostly cosmetic unless we have a custom token.
    e.preventDefault();
    setMessage("Password updated (Simulation). Redirecting...");
    setTimeout(() => navigate('/catalog'), 1000);
  };


  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-offwhite dark:bg-charcoal px-6 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-clay p-6 md:p-12 shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>

        {!isFirebaseConfigured && (
          <div className="bg-gold/10 border border-gold/20 p-3 mb-6 text-[8px] uppercase tracking-widest text-gold text-center">
            Simulation Mode: Enter any credentials to explore
          </div>
        )}

        <h1 className="text-3xl font-serif text-charcoal dark:text-offwhite mb-2 uppercase tracking-[0.2em] text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h1>
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center mb-10">
          {isLogin ? 'Login to access your orders' : 'Create an account to start shopping'}
        </p>

        {error && <p className="text-xs text-red-500 mb-6 text-center italic">{error}</p>}
        {message && <p className="text-xs text-green-500 mb-6 text-center italic">{message}</p>}

        {mode === 'email' && (
          <form className="space-y-6" onSubmit={handleAuth}>
            <div className="flex gap-4 mb-6">
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border ${role === 'buyer' ? 'bg-charcoal text-white dark:bg-gold dark:text-charcoal border-gold' : 'border-neutral-200 text-neutral-400'}`}
              >
                Buyer
              </button>
              <button
                type="button"
                onClick={() => setRole('seller')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest border ${role === 'seller' ? 'bg-charcoal text-white dark:bg-gold dark:text-charcoal border-gold' : 'border-neutral-200 text-neutral-400'}`}
              >
                Seller
              </button>
            </div>

            {!isLogin && (
              <>
                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
                    required={!isLogin}
                  />
                </div>

                <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
                required
              />
            </div>

            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
                required
              />
            </div>
            {isLogin && (
              <div className="text-right">
                <button type="button" onClick={() => { setMode('forgot_request'); setError(''); setMessage(''); }} className="text-[9px] text-neutral-400 uppercase tracking-widest hover:text-gold">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Enter' : 'Join Now')}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] text-neutral-400 uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-neutral-200 dark:border-neutral-700"></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full border border-charcoal dark:border-gold text-charcoal dark:text-gold py-4 text-xs font-bold uppercase tracking-[0.1em] hover:bg-neutral-50 dark:hover:bg-gold/10 transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="truncate">Continue with Google</span>
            </button>
          </form>
        )}

        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-4">
            {isLogin ? "Don't have an account?" : "Already a member?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[10px] font-bold uppercase tracking-widest text-gold hover:text-charcoal dark:hover:text-offwhite transition-colors underline decoration-gold"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>




        {/* EMAIL OTP REQUEST MODE */}
        {mode === 'forgot_request' && (
          <form className="space-y-6" onSubmit={sendEmailOtp}>
            <p className="text-center text-xs text-neutral-500 mb-2">
              Enter your registered email to receive an OTP code.
            </p>
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Registered Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP Code'}
            </button>
            <button type="button" onClick={() => { setMode('email'); setError(''); }} className="w-full mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Back to Login
            </button>
          </form>
        )}

        {/* EMAIL OTP VERIFY MODE */}
        {mode === 'otp_verify' && (
          <form className="space-y-6" onSubmit={verifyEmailOtp}>
            <p className="text-center text-xs text-neutral-500 mb-2">
              We sent a code to <span className="font-bold text-charcoal dark:text-offwhite">{resetEmail}</span>
            </p>
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">Enter 6-Digit Code</label>
              <input
                type="text"
                placeholder="XXXXXX"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite tracking-[0.5em] text-center font-bold"
                required
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button type="button" onClick={() => setMode('forgot_request')} className="w-full mt-2 text-[10px] uppercase tracking-widest text-neutral-400">
              Resend Code
            </button>
          </form>
        )}

        {/* UDPATE PASSWORD MODE */}
        {mode === 'update_password' && (
          <form className="space-y-6" onSubmit={handlePasswordUpdate}>
            <p className="text-center text-xs text-neutral-500 mb-4">Set a new password for future email logins (optional)</p>
            <div className="border-b border-neutral-200 dark:border-neutral-700 pb-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-sm dark:text-offwhite"
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-charcoal dark:bg-gold text-offwhite dark:text-charcoal py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-clay transition-all disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Password'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="flex-1 border border-neutral-200 text-neutral-400 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-neutral-50 transition-all"
              >
                Skip
              </button>
            </div>
          </form>
        )}
      </div>
    </div >
  );
};

export default Auth;
