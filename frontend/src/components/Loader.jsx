const Loader = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "320px", gap: "32px" }}>
      
      {/* Orbit Wrapper */}
      <div style={{ position: "relative", width: "140px", height: "140px" }}>
        
        {/* Rings */}
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#D4537E", borderRightColor: "#D4537E", animation: "spin 1s linear infinite" }} />
        <div style={{ position: "absolute", inset: "14px", borderRadius: "50%", border: "3px solid transparent", borderBottomColor: "#ED93B1", borderLeftColor: "#ED93B1", animation: "spin 0.75s linear infinite reverse" }} />
        <div style={{ position: "absolute", inset: "28px", borderRadius: "50%", border: "3px solid transparent", borderTopColor: "#F4C0D1", borderRightColor: "#F4C0D1", animation: "spin 0.5s linear infinite" }} />

        {/* Orbiting Dots */}
        <div style={{ position: "absolute", width: "11px", height: "11px", borderRadius: "50%", top: "50%", left: "50%", margin: "-5.5px 0 0 -5.5px", background: "#D4537E", animation: "orbit1 1s linear infinite" }} />
        <div style={{ position: "absolute", width: "9px", height: "9px", borderRadius: "50%", top: "50%", left: "50%", margin: "-4.5px 0 0 -4.5px", background: "#ED93B1", animation: "orbit2 0.75s linear infinite reverse" }} />
        <div style={{ position: "absolute", width: "7px", height: "7px", borderRadius: "50%", top: "50%", left: "50%", margin: "-3.5px 0 0 -3.5px", background: "#F4C0D1", animation: "orbit3 0.5s linear infinite" }} />

        {/* Core */}
        <div style={{ position: "absolute", inset: "50%", transform: "translate(-50%, -50%)", width: "28px", height: "28px", borderRadius: "50%", background: "#D4537E", animation: "pulseCore 1.4s ease-in-out infinite" }} />
      </div>

      {/* Bouncing Bars */}
      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end", height: "40px" }}>
        {[
          { color: "#FBEAF0", delay: "0s" },
          { color: "#F4C0D1", delay: "0.1s" },
          { color: "#ED93B1", delay: "0.2s" },
          { color: "#D4537E", delay: "0.3s" },
          { color: "#993556", delay: "0.4s" },
          { color: "#D4537E", delay: "0.5s" },
          { color: "#993556", delay: "0.6s" },
          { color: "#D4537E", delay: "0.7s" },
          { color: "#ED93B1", delay: "0.8s" },
          { color: "#F4C0D1", delay: "0.9s" },
          { color: "#FBEAF0", delay: "1.0s" },
        ].map((bar, i) => (
          <div key={i} style={{ width: "6px", borderRadius: "3px", background: bar.color, animation: `barBounce 1.1s ease-in-out ${bar.delay} infinite` }} />
        ))}
      </div>

      {/* Label */}
      <p style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "0.14em", color: "#D4537E", animation: "fadeText 1.4s ease-in-out infinite", margin: 0 }}>
        LOADING...
      </p>

      {/* Keyframes */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulseCore {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.35); opacity: 0.6; }
        }
        @keyframes orbit1 {
          from { transform: rotate(0deg) translateX(63px); }
          to   { transform: rotate(360deg) translateX(63px); }
        }
        @keyframes orbit2 {
          from { transform: rotate(90deg) translateX(49px); }
          to   { transform: rotate(450deg) translateX(49px); }
        }
        @keyframes orbit3 {
          from { transform: rotate(180deg) translateX(35px); }
          to   { transform: rotate(540deg) translateX(35px); }
        }
        @keyframes barBounce {
          0%, 100% { height: 8px; }
          50% { height: 36px; }
        }
        @keyframes fadeText {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Loader;