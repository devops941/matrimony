import { Surface, Danger, Warning, Static, Composites } from '../theme';

export default function HelpPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-5xl mx-auto w-full">
      
      <div className={Composites.pageHeader}>
        <h2 className={`text-xl md:text-2xl font-bold ${Surface.text[900]} tracking-tight`}>Understanding Tamil Ten Porutham Astrological Rules</h2>
        <p className={`text-xs ${Surface.text[500]} mt-1`}>An overview of the South Indian matrimonial matchmaking system, defining Dina to Vedha rules.</p>
      </div>

      <div className={`${Static.white} p-6 rounded-2xl border ${Surface.opacity.bd_200_80} shadow-sm space-y-6`}>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>1. Dina Porutham (தினப் பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Evaluates the birth stars distance of bride and groom. Favorable distance indicates strong physical health, deep immunity, longevity, and general well-being.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>2. Gana Porutham (கணப் பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Compares temperament. Stars are classed into Deva (Divine), Manusha (Human), and Rakshasa (Demon) Ganas. Matching ganas aligns perspectives and prevents verbal friction.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>3. Mahendra Porutham (மகேந்திர பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Fosters family lineage and ensures healthy children. A positive Mahendra parameter guarantees healthy descendants and robust growth of the family tree.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>4. Stree Deerga Porutham (ஸ்திரீதீர்க்க பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Guarantees prolonged prosperity and luxury for the bride. It measures the absolute distance from the bride's star to the groom's star (should be &gt;13).
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>5. Yoni Porutham (யோனிப் பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Determines physical, instinctual, and sexual compatibility. It uses animal totems associated with each star to secure a mutually fulfilling intimate bond.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>6. Rasi Porutham (ராசிப் பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Secures zodiac sign alignment. Prevents heavy astrological frictions like "Shashtashtaga" (6-8 axis placement) which naturally invite sudden disputes.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>7. Rasi Athipathi Porutham (ராசி அதிபதி பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Friendship status between the planetary rulers of the bride and groom's moon signs. Aligns long-term familial warmth and mutual respect between in-laws.
            </p>
          </div>

          <div className={`p-4 ${Surface[50]} rounded-xl border ${Surface.opacity.bd_200_40}`}>
            <h4 className={`font-bold text-xs ${Surface.text[900]}`}>8. Vasya Porutham (வசியப் பொருத்தம்)</h4>
            <p className={`text-[11px] ${Surface.text[500]} mt-1 leading-relaxed`}>
              Vibrational attraction and romantic magnetism. Promotes deep affection, emotional compatibility, and protective feelings between the husband and wife.
            </p>
          </div>

          <div className={`p-4 ${Danger[50]} rounded-xl border ${Danger.border[100]}`}>
            <h4 className={`font-bold text-xs ${Danger.text[900]}`}>9. Rajju Porutham (ரஜ்ஜுப் பொருத்தம்) — CRITICAL</h4>
            <p className={`text-[11px] ${Danger.text[700]} mt-1 leading-relaxed`}>
              The single most vital check. Represents the marriage thread and safety. Same Rajju is inauspicious ("Rajju Dosham") and warns of high risk to marital stability.
            </p>
          </div>

          <div className={`p-4 ${Warning[50]} rounded-xl border ${Warning.border[100]}`}>
            <h4 className={`font-bold text-xs ${Warning.text[900]}`}>10. Vedha Porutham (வேதைப் பொருத்தம்) — CRITICAL</h4>
            <p className={`text-[11px] ${Warning.text[700]} mt-1 leading-relaxed`}>
              Affliction avoidance. Particular stars possess direct mutual hostile paths (Vedha). Fulfilling this ensures peaceful co-existence with minimal arguments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
