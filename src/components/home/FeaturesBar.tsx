import { FEATURES_BAR } from "@/lib/constants";

export function FeaturesBar() {
  return (
    <section className="section-below-fold py-8 md:py-10">
      <div className="container-site">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-6 md:gap-x-10 lg:gap-x-14">
          {FEATURES_BAR.map((item) => (
            <li
              key={item.id}
              className="flex flex-col items-center gap-2 text-center"
            >
              <span className="text-secondary">
                <FeatureIcon name={item.icon} />
              </span>
              <span className="text-sm font-bold text-primary md:text-[15px]">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FeatureIcon({ name }: { name: (typeof FEATURES_BAR)[number]["icon"] }) {
  const props = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  } as const;

  switch (name) {
    case "globe":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </svg>
      );
    case "cpu":
      return (
        <svg {...props}>
          <rect x="6" y="6" width="12" height="12" rx="2" />
          <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
        </svg>
      );
    case "folder":
      return (
        <svg {...props}>
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
          <path d="M12 11v4M10 13h4" />
        </svg>
      );
    case "home":
      return (
        <svg {...props}>
          <path d="m4 11 8-7 8 7" />
          <path d="M6 10v9h12v-9" />
        </svg>
      );
    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 5 6v5c0 4.5 3 8 7 9 4-1 7-4.5 7-9V6l-7-3Z" />
          <path d="M9.5 12.5c.8-1.2 1.7-1.8 2.5-1.8s1.7.6 2.5 1.8" />
        </svg>
      );
    default:
      return null;
  }
}
