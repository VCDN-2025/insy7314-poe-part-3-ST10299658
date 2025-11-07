// src/components/ProtectedRoute.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getProtected } from "../services/api"; // optional fallback if you want inline auth check

/**
 * Props:
 * - loggedIn (boolean) - from App state
 * - children - protected page
 * - checkAuthStatus (fn) - optional function from App that validates token and sets user state
 */
export default function ProtectedRoute({ loggedIn, checkAuthStatus, children }) {
  const location = useLocation();
  const hasToken = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem("token"));
  }, []);

  const [checking, setChecking] = useState(!loggedIn && hasToken);
  const [ok, setOk] = useState(Boolean(loggedIn)); // initial ok if loggedIn true

  useEffect(() => {
    let mounted = true;

    // If already loggedIn, nothing to do
    if (loggedIn) {
      setOk(true);
      setChecking(false);
      return;
    }

    // If no token, skip server check
    const token = localStorage.getItem("token");
    if (!token) {
      setOk(false);
      setChecking(false);
      return;
    }

    // If token exists, run a single check (do not run on every render)
    async function verify() {
      setChecking(true);
      try {
        // Prefer using a provided checkAuthStatus so App updates central state
        if (typeof checkAuthStatus === "function") {
          await checkAuthStatus(); // this should set loggedIn and user in App
          // read the result from localStorage or assume checkAuthStatus updated parent state:
          if (mounted) setOk(true);
        } else {
          // fallback: call protected endpoint directly
          const res = await getProtected();
          if (res?.data?.user && mounted) setOk(true);
        }
      } catch (err) {
        if (mounted) setOk(false);
      } finally {
        if (mounted) setChecking(false);
      }
    }

    verify();

    return () => { mounted = false; };
    // IMPORTANT: we only want this effect to run once on mount or when `loggedIn` changes.
    // Do NOT include `checkAuthStatus` if it's not stable (wrap it in useCallback in parent).
  }, [loggedIn, checkAuthStatus]);

  if (checking) {
    return <div style={{ padding: 40, textAlign: "center" }}>Checking authentication...</div>;
  }

  if (!checking && !ok) {
    // send user to login, keep `state` so you can redirect after login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
