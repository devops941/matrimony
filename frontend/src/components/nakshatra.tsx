import React, { useMemo } from 'react';
import { Surface } from '../theme';

const RASHIS = [
  { name: 'மேஷம்', stars: ['அசுவினி', 'பரணி', 'கார்த்திகை 1'] },
  { name: 'ரிஷபம்', stars: ['கார்த்திகை 2,3,4', 'ரோகிணி', 'மிருகசீரிடம் 1,2'] },
  { name: 'மிதுனம்', stars: ['மிருகசீரிடம் 3,4', 'திருவாதிரை', 'புனர்பூசம் 1,2,3'] },
  { name: 'கடகம்', stars: ['புனர்பூசம் 4', 'பூசம்', 'ஆயில்யம்'] },
  { name: 'சிம்மம்', stars: ['மகம்', 'பூரம்', 'உத்திரம் 1'] },
  { name: 'கன்னி', stars: ['உத்திரம் 2,3,4', 'அஸ்தம்', 'சித்திரை 1,2'] },
  { name: 'துலாம்', stars: ['சித்திரை 3,4', 'சுவாதி', 'விசாகம் 1,2,3'] },
  { name: 'விருச்சிகம்', stars: ['விசாகம் 4', 'அனுஷம்', 'கேட்டை'] },
  { name: 'தனுசு', stars: ['மூலம்', 'பூராடம்', 'உத்திராடம் 1'] },
  { name: 'மகரம்', stars: ['உத்திராடம் 2,3,4', 'திருவோணம்', 'அவிட்டம் 1,2'] },
  { name: 'கும்பம்', stars: ['அவிட்டம் 3,4', 'சதயம்', 'பூரட்டாதி 1,2,3'] },
  { name: 'மீனம்', stars: ['பூரட்டாதி 4', 'உத்திரட்டாதி', 'ரேவதி'] },
];

const STAR_ROWS = RASHIS.flatMap((r, ri) =>
  r.stars.map((s, si) => ({ rashi: r.name, rashiIndex: ri, star: s, isFirstOfGroup: si === 0 }))
);

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildMatrix(): number[][] {
  const rand = mulberry32(42);
  const n = STAR_ROWS.length;
  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(i === j ? 36 : Math.floor(rand() * 34) + 1);
    }
    matrix.push(row);
  }
  return matrix;
}

const COL_W = 44;
const ROW_LABEL1_W = 90;
const ROW_LABEL2_W = 130;
const HEAD_ROW1_H = 32;
const HEAD_ROW2_H = 50;

export default function NakshatraPage() {
  const matrix = useMemo(buildMatrix, []);
  const n = STAR_ROWS.length;

  const cellBg = (val: number, r: number, c: number) => {
    if (r === c) return '#eef6ee';
    if (val >= 30) return '#eaf6ec';
    if (val <= 10) return '#fdecec';
    return '#ffffff';
  };

  return (
    <div style={{ fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif", background: '#f6f7f8', padding: 16 }}>
      <style>{`
        .npt-table-wrap {
          overflow: auto;
          max-height: 82vh;
          border: 1px solid #8c8c8c;
          background: #fff;
        }
        .npt-table {
          border-collapse: collapse;
          table-layout: fixed;
        }
        .npt-table th, .npt-table td {
          border: 1px solid #b7b7b7;
          box-sizing: border-box;
          text-align: center;
          font-size: 11px;
          padding: 2px 3px;
          line-height: 1.15;
          white-space: normal;
          word-break: keep-all;
          overflow: hidden;
        }
        .npt-corner {
          position: sticky;
          left: 0;
          top: 0;
          z-index: 50;
          background: #fbfbfb;
          font-weight: 700;
          font-size: 11px;
          height: ${HEAD_ROW1_H + HEAD_ROW2_H}px;
        }
        .npt-col-rashi-head {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #ffffff;
          font-weight: 700;
          font-size: 12.5px;
          height: ${HEAD_ROW1_H}px;
          display: table-cell;
          vertical-align: middle;
        }
        .npt-col-star-head {
          position: sticky;
          top: ${HEAD_ROW1_H}px;
          z-index: 30;
          background: #ffffff;
          font-weight: 600;
          color: #333;
          height: ${HEAD_ROW2_H}px;
          vertical-align: middle;
        }
        .npt-row-rashi-label {
          position: sticky;
          left: 0;
          z-index: 20;
          background: #fbfbfb;
          font-weight: 700;
          color: #1a1a1a;
        }
        .npt-row-star-label {
          position: sticky;
          left: ${ROW_LABEL1_W}px;
          z-index: 20;
          background: #ffffff;
          font-weight: 600;
          color: #333;
          text-align: left !important;
          padding-left: 6px !important;
        }
        .npt-data-cell {
          cursor: default;
          color: #1a1a1a;
        }
        .npt-data-cell:hover {
          background: #ffe7b3 !important;
        }
        .npt-band-right {
          border-right: 2px solid #6f6f6f !important;
        }
        .npt-band-bottom {
          border-bottom: 2px solid #6f6f6f !important;
        }
      `}</style>

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 10px 2px', color: '#222' }}>
        நட்சத்திர பொருத்தம் அட்டவணை (Dummy Data)
      </h2>

      <div className="npt-table-wrap">
        <table className="npt-table">
          <colgroup>
            <col style={{ width: ROW_LABEL1_W }} />
            <col style={{ width: ROW_LABEL2_W }} />
            {STAR_ROWS.map((_, i) => (
              <col key={i} style={{ width: COL_W }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="npt-corner npt-band-right npt-band-bottom" rowSpan={2} colSpan={2}>
                நட்சத்திரம்<br />பொருத்தம் (*/36)
              </th>
              {RASHIS.map((r, ri) => (
                <th key={r.name} colSpan={3} className={`npt-col-rashi-head${ri < RASHIS.length - 1 ? ' npt-band-right' : ''}`}>
                  {r.name}
                </th>
              ))}
            </tr>
            <tr>
              {STAR_ROWS.map((s, ci) => (
                <th key={ci} className={`npt-col-star-head${ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup ? ' npt-band-right' : ''}`}>
                  {s.star}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {STAR_ROWS.map((rowMeta, ri) => {
              const rashiObj = RASHIS[rowMeta.rashiIndex];
              const bottomBand = ri < n - 1 && STAR_ROWS[ri + 1].isFirstOfGroup;
              return (
                <tr key={ri}>
                  {rowMeta.isFirstOfGroup && (
                    <td className="npt-row-rashi-label" rowSpan={rashiObj.stars.length}>
                      {rashiObj.name}
                    </td>
                  )}
                  <td className={`npt-row-star-label${bottomBand ? ' npt-band-bottom' : ''}`}>
                    {rowMeta.star}
                  </td>
                  {matrix[ri].map((val, ci) => (
                    <td
                      key={ci}
                      className={`npt-data-cell${ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup ? ' npt-band-right' : ''}${bottomBand ? ' npt-band-bottom' : ''}`}
                      style={{ background: cellBg(val, ri, ci) }}
                    >
                      {val}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: '#777', marginTop: 8 }}>
        * Values shown are randomly generated placeholder data for layout purposes only — not real porutham scores.
      </p>
    </div>
  );
}
