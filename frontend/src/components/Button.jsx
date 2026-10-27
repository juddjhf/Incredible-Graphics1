import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Button({
  to,
  href,
  variant = "primary",
  className = "",
  children,
  icon,
  iconPosition = "end",
  iconOnly = false,
  onClick,
  showArrow = !icon,
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  const classes = `ig-button ig-button--${variant}${iconOnly ? " ig-button--icon-only" : ""}${className ? ` ${className}` : ""}`;
  const actionIcon = icon || (showArrow && <ArrowRight className="ig-button-arrow" size={16} aria-hidden="true" />);
  const handleDisabledClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  const accessibilityLabel = props["aria-label"] || (iconOnly && typeof children === "string" ? children : undefined);
  const content = (
    <>
      {actionIcon && iconPosition === "start" && actionIcon}
      <span className="ig-button-label" aria-hidden={iconOnly || undefined}>{children}</span>
      {actionIcon && iconPosition === "end" && actionIcon}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={handleDisabledClick}
        aria-busy={loading || undefined}
        aria-label={accessibilityLabel}
        {...props}
      >
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || loading || undefined}
        onClick={handleDisabledClick}
        aria-busy={loading || undefined}
        aria-label={accessibilityLabel}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={accessibilityLabel}
      onClick={onClick}
      {...props}
    >
      {content}
    </button>
  );
}

export default Button;
