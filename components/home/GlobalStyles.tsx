"use client";
export default function GlobalStyles() {
  return (
    <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Work+Sans:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
.rr{
--ink:#1A1310;--paper:#FFFBF7;--peach:#FFF4EC;--peach2:#FFE8DA;--ember:#D81B54;--pink:#FF3D6E;--orange:#FF7A2E;--gold:#B8560E;--dim:#4A3F38;--muted:#7A6B60;--line:rgba(255,61,110,.22);--leaf:#1E8E5A;
background:var(--paper);color:var(--ink);font-family:'Work Sans','Noto Sans Devanagari',sans-serif;overflow-x:hidden;
*{box-sizing:border-box}
h1,h2,h3,.serif{font-family:'Fraunces','Noto Sans Devanagari',serif;margin:0;letter-spacing:-.01em}
p{line-height:1.7;color:var(--dim);margin:0 0 12px}
a{color:inherit}
:focus-visible{outline:3px solid var(--ember);outline-offset:2px}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.sec{padding:76px 0;text-align:center}
.sec.tint{background:var(--peach)}
.sec.warm{background:linear-gradient(180deg,var(--peach),var(--peach2))}
.sec.dark{background:var(--ink);color:#fff}
.sec.dark p,.sec.dark h2{color:#fff}
.sec.dark .sub{color:#e8cfc0}
.sec.full{min-height:100vh;display:flex;align-items:center}
.sec.full .wrap{width:100%}
h2{font-size:clamp(26px,4.2vw,42px);font-weight:600;line-height:1.15;margin-bottom:14px}
.sub{max-width:720px;margin:0 auto 32px;font-size:15.5px}
.grid{display:grid;gap:18px;text-align:left}
.g2{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(3,1fr)}.g4{grid-template-columns:repeat(4,1fr)}
.card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;text-decoration:none;display:block;transition:transform .2s,box-shadow .2s}
a.card:hover{transform:translateY(-4px);box-shadow:0 16px 34px rgba(216,27,84,.16)}
.card h3{font-size:20px;margin:10px 0 8px}.card p{font-size:14px;margin:0}
.ico{display:inline-flex;width:46px;height:46px;border-radius:14px;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--orange),var(--pink));color:#fff}
.dark .ico{background:rgba(255,255,255,.12)}
.lead{font-family:'Fraunces','Noto Sans Devanagari',serif;font-style:italic;font-size:clamp(18px,2.5vw,24px);color:var(--ember);margin:26px auto 0;max-width:820px}
.dark .lead{color:#FF9A5C}
.big{font-family:'Fraunces',serif;font-weight:700;color:var(--ember);line-height:1;font-size:clamp(54px,9vw,104px)}
.note{font-size:13px;color:var(--muted)}
.cta{display:inline-flex;gap:8px;align-items:center;margin-top:24px;padding:14px 30px;border-radius:100px;background:var(--ember);color:#fff;text-decoration:none;font-weight:600;box-shadow:0 8px 20px rgba(216,27,84,.3)}
.tw{overflow-x:auto;margin:18px auto;text-align:left}
.tbl{width:100%;min-width:340px;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:12px;overflow:hidden;font-size:14px}
.tbl th,.tbl td{padding:11px 16px;border-bottom:1px solid var(--line);text-align:left;color:var(--dim)}
.tbl th{background:var(--peach2);color:var(--ember);font-size:12.5px}
.tbl .tot td{font-weight:700;color:var(--ink);background:var(--peach2)}
.flow{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin:22px auto}
.flow span{padding:10px 18px;border-radius:100px;background:#fff;border:1px solid var(--line);font-weight:500;font-size:14.5px;color:var(--ink);opacity:0}
.flow span:not(:last-child)::after{content:' →';color:var(--ember)}
.in .flow span{animation:rr-pop .5s forwards}
.dark .flow span{background:transparent;border-color:rgba(255,255,255,.35);color:#fff}
.rv{opacity:0;transform:translateY(12px);transition:opacity .6s,transform .6s}.rv.in{opacity:1;transform:none}
.tabs{display:flex;justify-content:center;gap:8px;margin:0 auto 18px}
.tabs button{font:600 14px 'Work Sans',sans-serif;padding:10px 24px;border-radius:100px;border:1px solid var(--ember);background:#fff;color:var(--ember);cursor:pointer}
.tabs button.on{background:var(--ember);color:#fff}
@media(max-width:900px){.g2,.g3,.g4{grid-template-columns:1fr}.sec{padding:52px 0}}
@media(min-width:901px) and (max-width:1100px){.g4{grid-template-columns:repeat(2,1fr)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}.flow span,.rv{opacity:1;transform:none}}
}
@keyframes rr-pop{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
`}</style>
  );
}