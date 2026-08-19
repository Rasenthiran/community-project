import { CircleAlert, Inbox } from "lucide-react";
import "./common.css";

export function Button({ variant="primary", size="md", className="", type="button", children, ...props }) {
  return <button type={type} className={`ui-button ui-button--${variant} ui-button--${size} ${className}`} {...props}>{children}</button>;
}

export function Input({ label, error, id, ...props }) {
  const inputId = id || props.name;
  return <label className="field" htmlFor={inputId}><span className="field__label">{label}</span><input id={inputId} className={`field__control ${error ? "field__control--error" : ""}`} {...props}/>{error && <span className="field__error">{error}</span>}</label>;
}

export function Select({ label, error, id, children, ...props }) {
  const inputId = id || props.name;
  return <label className="field" htmlFor={inputId}><span className="field__label">{label}</span><select id={inputId} className={`field__control ${error ? "field__control--error" : ""}`} {...props}>{children}</select>{error && <span className="field__error">{error}</span>}</label>;
}

export function Textarea({ label, error, id, ...props }) {
  const inputId = id || props.name;
  return <label className="field" htmlFor={inputId}><span className="field__label">{label}</span><textarea id={inputId} className={`field__control field__textarea ${error ? "field__control--error" : ""}`} {...props}/>{error && <span className="field__error">{error}</span>}</label>;
}

export function Badge({ children, tone }) {
  const t = tone || String(children).toLowerCase();
  return <span className={`badge badge--${t}`}>{children}</span>;
}

export function LoadingState({ rows=4 }) {
  return <div className="loading-list" aria-label="Loading">{Array.from({length:rows}).map((_,i)=><div key={i} className="skeleton loading-row"/>)}</div>;
}

export function EmptyState({ title="Nothing here yet", message="There is no data to display." }) {
  return <div className="state-message"><Inbox/><h3>{title}</h3><p>{message}</p></div>;
}

export function ErrorState({ message="Unable to load this information.", onRetry }) {
  return <div className="state-message"><CircleAlert/><h3>Something went wrong</h3><p>{message}</p>{onRetry && <Button variant="secondary" onClick={onRetry}>Try again</Button>}</div>;
}

export function Pagination({ pagination, page, onPage }) {
  if (!pagination) return null;
  const totalPages = pagination.totalPages || pagination.pages || 1;
  return <div className="pagination"><Button variant="secondary" disabled={page<=1} onClick={()=>onPage(page-1)}>Previous</Button><span>Page {page} of {totalPages}</span><Button variant="secondary" disabled={page>=totalPages} onClick={()=>onPage(page+1)}>Next</Button></div>;
}
