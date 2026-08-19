import { SearchX, ShieldX } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../../components/common";
import "../auth/auth.css";

export function Unauthorized() {
  return <div className="auth-page"><div className="auth-card text-center"><ShieldX size={54} color="var(--color-error)"/><h1>Access denied</h1><p>You do not have permission to view this workspace.</p><Link to="/"><Button>Return Home</Button></Link></div></div>;
}

export function NotFound() {
  return <div className="auth-page"><div className="auth-card text-center"><SearchX size={54} color="var(--color-primary-dark)"/><h1>Page not found</h1><p>The page you requested does not exist or may have moved.</p><Link to="/"><Button>Go Home</Button></Link></div></div>;
}
