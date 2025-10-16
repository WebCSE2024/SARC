import React, { useState } from "react";
import "./SIGNav.scss";

const items = [
  { key: "mlai", label: "AI / ML" },
  { key: "systems", label: "Computing Systems" },
  { key: "infosec", label: "Information Security" },
  { key: "theory", label: "Theoretical CS" },
];

export default function SIGNav({ defaultActive = "mlai", onChange }) {
  const [active, setActive] = useState(defaultActive);

  const handleClick = (key) => {
    setActive(key);
    onChange && onChange(key);
  };

  return (
    <div className="sig-subnav" role="navigation" aria-label="SIG sections">
      <div className="sig-subnav__container">
        {items.map((it) => (
          <button
            key={it.key}
            className={`sig-subnav__item ${active === it.key ? "is-active" : ""}`}
            onClick={() => handleClick(it.key)}
            aria-current={active === it.key ? "page" : undefined}
          >
            {it.label}
          </button>
        ))}
      </div>
    </div>
  );
}
