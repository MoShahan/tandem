import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/app/hooks";
import { registerSessionExpiredHandler } from "@/lib/api-client";

import { logout } from "../authSlice";

const PUBLIC_PATHS = ["/", "/login", "/privacy", "/terms", "/guide", "/upcoming"];

const isPublicPath = (pathname: string) =>
  PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

export const SessionExpiredHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    registerSessionExpiredHandler(async () => {
      await dispatch(logout());

      if (isPublicPath(window.location.pathname)) {
        return;
      }

      navigate("/login", {
        replace: true,
        state: { from: window.location.pathname },
      });
    });
  }, [dispatch, navigate]);

  return null;
};
