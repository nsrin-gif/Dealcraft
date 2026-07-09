export default function FrameworkNote() {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-xs leading-relaxed text-slate-500">
      <p>
        <span className="font-medium text-slate-300">This calculator implements the Slicing Pie model</span>, a
        dynamic equity framework developed by Mike Moyer for exactly this situation — a small team mixing cash and
        sweat equity before there's a priced valuation to split against. Every contribution is converted to a common
        "slice" unit (fair market value × a risk multiplier), so cash and unpaid labor land on one consistent scale
        instead of a negotiated guess.
      </p>
      <p className="mt-2">
        Read more at{' '}
        <a href="https://slicingpie.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">
          slicingpie.com
        </a>
        . This tool is an independent implementation of the public framework — not affiliated with or endorsed by its
        author.
      </p>
    </div>
  );
}
