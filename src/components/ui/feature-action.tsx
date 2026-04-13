import Link from "next/link";

type FeatureActionProps = {
  label: string;
  icon?: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
};

export function FeatureAction({
  label,
  icon,
  href,
  variant = "primary",
}: FeatureActionProps) {
  const className = ["feature-action", `feature-action--${variant}`].join(" ");

  if (href) {
    return (
      <Link className={className} href={href}>
        {icon ? <span className="material-symbols-outlined feature-action__icon">{icon}</span> : null}
        <span>{label}</span>
      </Link>
    );
  }

  return (
    <button className={className} type="button">
      {icon ? <span className="material-symbols-outlined feature-action__icon">{icon}</span> : null}
      <span>{label}</span>
    </button>
  );
}
