import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";

// ---- Data: 12 Rashis, each split into 3 nakshatra-pada segments (36 columns/rows total) ----
const RASHIS = [
  { name: "மேஷம்", stars: ["அசுவினி", "பரணி", "கார்த்திகை 1"] },
  { name: "ரிஷபம்", stars: ["கார்த்திகை 2,3,4", "ரோகிணி", "மிருகசீரிடம் 1,2"] },
  { name: "மிதுனம்", stars: ["மிருகசீரிடம் 3,4", "திருவாதிரை", "புனர்பூசம் 1,2,3"] },
  { name: "கடகம்", stars: ["புனர்பூசம் 4", "பூசம்", "ஆயில்யம்"] },
  { name: "சிம்மம்", stars: ["மகம்", "பூரம்", "உத்திரம் 1"] },
  { name: "கன்னி", stars: ["உத்திரம் 2,3,4", "அஸ்தம்", "சித்திரை 1,2"] },
  { name: "துலாம்", stars: ["சித்திரை 3,4", "சுவாதி", "விசாகம் 1,2,3"] },
  { name: "விருச்சிகம்", stars: ["விசாகம் 4", "அனுஷம்", "கேட்டை"] },
  { name: "தனுசு", stars: ["மூலம்", "பூராடம்", "உத்திராடம் 1"] },
  { name: "மகரம்", stars: ["உத்திராடம் 2,3,4", "திருவோணம்", "அவிட்டம் 1,2"] },
  { name: "கும்பம்", stars: ["அவிட்டம் 3,4", "சதயம்", "பூரட்டாதி 1,2,3"] },
  { name: "மீனம்", stars: ["பூரட்டாதி 4", "உத்திரட்டாதி", "ரேவதி"] },
];

// Flatten into 36 (rashiIndex, starIndex, label) entries
const STAR_ROWS = RASHIS.flatMap((r, ri) =>
  r.stars.map((s, si) => ({ rashi: r.name, rashiIndex: ri, star: s, isFirstOfGroup: si === 0 }))
);

// ---- Real porutham matrix, transcribed exactly from the source Excel sheet ----
// Row i / Col j follow the same order as STAR_ROWS above (36 x 36).
const REAL_MATRIX = [
  [24,21,32,20,20,20,18,11,11,15,14,19,19,26,25,16,16,10,22,25,22,24,32,19,15,30,29,23,26,18,19,16,15,20,31,31],
  [23,24,28,16,20,13,12,18,21,24,15,18,21,16,26,27,25,11,14,28,22,24,23,26,25,20,31,26,24,10,11,19,25,29,23,33],
  [28,28,24,12,7,14,12,14,13,17,19,15,19,21,18,18,21,23,27,16,19,21,26,31,31,23,14,9,10,23,24,28,18,23,26,17],
  [24,24,20,24,19,26,17,18,18,15,18,13,12,14,11,16,19,22,31,20,23,19,24,29,27,19,10,14,9,29,29,32,23,18,21,12],
  [28,29,15,19,24,35,26,23,23,21,22,6,3,18,19,24,21,18,27,24,19,15,28,23,19,26,17,21,19,25,25,24,31,27,25,19],
  [30,19,24,28,34,24,15,23,22,19,13,14,13,9,18,23,24,24,8,17,33,27,21,23,22,14,24,28,30,15,15,26,29,24,18,25],
  [27,16,22,25,31,21,24,32,31,18,12,13,17,13,22,24,25,9,8,24,18,20,19,20,22,14,24,26,28,13,14,25,28,25,18,25],
  [17,18,19,23,30,30,33,24,24,11,19,13,16,23,14,16,17,19,18,21,18,21,23,11,13,27,25,28,29,23,24,13,28,19,25,28],
  [20,28,23,26,27,29,32,23,24,11,21,16,16,19,15,17,15,20,19,25,26,19,28,13,13,23,26,28,28,24,25,18,18,15,27,27],
  [22,26,25,22,21,25,16,27,24,24,34,29,16,17,15,11,11,14,14,20,11,17,26,12,17,27,30,25,25,21,21,16,14,18,30,30],
  [29,21,25,22,25,17,17,25,22,34,24,29,18,15,22,18,20,4,3,20,13,19,15,21,25,20,29,23,24,10,10,22,24,28,18,31],
  [24,23,22,19,9,19,19,18,20,29,28,24,13,14,18,14,13,19,19,4,11,17,20,23,30,24,17,12,10,26,26,25,20,24,25,14],
  [22,24,22,17,10,17,21,23,27,22,26,21,24,29,27,16,17,21,20,8,12,15,19,25,21,16,8,9,19,23,23,26,17,23,26,17],
  [29,19,25,20,23,16,20,18,21,29,23,23,29,24,34,23,22,8,7,21,15,18,16,19,18,13,23,24,24,10,10,19,24,30,23,31],
  [23,31,22,17,25,24,28,21,20,23,32,25,26,34,24,13,13,15,13,12,22,12,15,25,10,10,24,21,22,25,17,17,12,15,21,33],
  [20,28,19,23,31,30,32,25,26,19,28,21,25,31,21,24,26,24,15,25,15,10,21,5,6,20,17,20,23,15,22,17,20,18,31,25],
  [15,17,23,27,27,31,33,23,26,20,27,23,25,30,22,25,24,27,18,25,18,14,19,8,8,19,19,22,20,19,26,14,22,21,27,30],
  [20,12,25,30,25,14,16,27,23,20,12,26,30,15,22,25,26,24,15,17,25,20,5,17,20,3,14,17,17,13,20,29,24,22,13,25],
  [21,14,27,29,24,13,13,24,31,19,12,25,26,11,18,24,25,23,24,26,34,23,7,20,20,3,14,19,19,15,13,22,17,20,11,20],
  [21,28,15,17,21,30,30,26,21,28,26,14,13,26,25,31,34,28,27,24,19,8,22,18,13,19,9,15,17,28,19,13,23,27,25,18],
  [21,22,19,21,13,24,24,24,17,18,20,17,18,17,18,24,24,24,35,18,24,13,15,20,20,11,6,16,10,26,24,22,22,15,19,19],
  [23,24,21,19,11,22,20,20,27,23,25,23,21,21,22,18,18,28,30,13,19,24,26,31,23,14,9,5,3,20,20,18,11,16,16,10],
  [30,22,25,23,27,19,17,21,13,33,22,28,24,21,29,25,27,10,13,29,22,27,24,30,15,14,21,16,19,3,3,15,17,23,23,25],
  [17,24,31,29,19,22,20,8,9,19,27,30,30,23,17,13,11,25,27,22,27,32,29,34,13,16,17,13,11,18,18,10,4,9,19,16],
  [6,18,19,22,24,20,18,18,14,26,14,24,29,28,25,16,16,12,24,25,21,25,30,23,21,24,27,26,14,15,20,20,13,6,11,20],
  [23,12,15,18,23,17,17,24,24,30,19,24,25,20,31,26,26,11,13,25,21,25,22,25,27,24,33,21,22,7,7,14,21,26,17,26],
  [23,23,6,9,11,22,17,26,29,29,30,15,16,30,28,23,26,18,19,19,11,16,31,24,27,33,24,12,13,14,14,15,20,25,26,17],
  [22,22,5,7,14,21,27,30,30,25,27,11,11,25,23,27,30,23,24,23,16,11,27,19,23,29,20,24,25,26,19,20,25,21,22,13],
  [20,21,7,9,11,23,29,28,23,27,23,14,11,25,25,29,27,15,26,22,18,14,25,22,23,30,20,24,24,28,21,20,24,21,20,14],
  [15,4,21,23,15,7,13,24,16,19,12,25,26,11,19,23,23,20,26,24,31,26,12,24,29,12,23,27,27,24,17,25,11,17,7,13],
  [15,4,21,22,17,6,6,17,10,19,12,25,26,21,12,15,13,28,30,20,26,20,20,20,23,22,21,24,29,32,24,18,7,16,16,19],
  [8,16,21,23,17,17,6,12,14,20,19,26,21,12,15,13,18,30,20,30,26,20,23,22,21,24,29,26,21,32,24,18,7,16,16,13],
  [13,18,15,16,20,23,23,15,8,16,26,19,20,21,23,17,20,19,24,26,30,23,19,26,10,15,26,29,26,29,18,24,13,21,19,21],
  [14,20,16,12,16,19,19,11,20,12,22,16,24,27,21,17,15,21,25,25,18,23,30,15,16,27,30,30,29,26,24,13,19,24,32,30],
  [23,16,17,12,19,9,9,19,20,24,13,18,24,23,31,26,27,8,8,27,18,23,21,26,23,22,29,29,30,14,12,23,27,22,24,34],
  [23,23,11,7,7,19,19,16,20,24,14,8,18,29,30,26,25,20,20,17,12,32,24,19,28,31,21,21,23,21,22,25,30,33,24,29],
];

// ---- Excel upload support -------------------------------------------------
// Expects the same layout as the source template: title rows 1-2, rashi/star
// name columns A-B, and the 36x36 number grid starting at cell C3 (through AL38).
function extractMatrixFromWorkbook(workbook) {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("Excel வொர்க்புக்கில் shet கிடைக்கவில்லை.");

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const n = STAR_ROWS.length; // 36
  const ROW_START = 2; // 0-indexed -> spreadsheet row 3
  const COL_START = 2; // 0-indexed -> spreadsheet column C

  const matrix = [];
  for (let i = 0; i < n; i++) {
    const srcRow = rows[ROW_START + i] || [];
    const row = [];
    for (let j = 0; j < n; j++) {
      const raw = srcRow[COL_START + j];
      const num = typeof raw === "number" ? raw : parseFloat(raw);
      if (!Number.isFinite(num)) {
        throw new Error(
          `வரிசை ${i + 1}, நெடுவரிசை ${j + 1}: எண் எதிர்பார்க்கப்பட்டது, ஆனால் "${raw}" கிடைத்தது.`
        );
      }
      row.push(num);
    }
    matrix.push(row);
  }
  return matrix;
}

const COL_W = 44; // px per data column
const ROW_LABEL1_W = 90; // rashi name column
const ROW_LABEL2_W = 130; // star name column
const HEAD_ROW1_H = 32; // px, rashi header row
const HEAD_ROW2_H = 50; // px, star header row

// same array contents regardless of order? we only ever build ascending ranges, so simple compare is fine
function sameSet(a, b) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export default function NakshatraPoruthamTable() {
  // Data source: defaults to the built-in matrix; an Excel upload can replace
  // it, but nothing else in the component changes when that happens.
  const [uploadedMatrix, setUploadedMatrix] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const fileInputRef = useRef(null);
  const matrix = uploadedMatrix || REAL_MATRIX;
  const n = STAR_ROWS.length;

  const handleExcelChange = (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    if (!isExcel) {
      setUploadError("Excel கோப்பு (.xlsx அல்லது .xls) மட்டுமே ஏற்றுக்கொள்ளப்படும்.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const parsed = extractMatrixFromWorkbook(workbook);
        setUploadedMatrix(parsed);
        setUploadedFileName(file.name);
        setUploadError("");
      } catch (err) {
        setUploadError(err.message || "Excel கோப்பைப் படிக்க முடியவில்லை.");
      }
    };
    reader.onerror = () => setUploadError("Excel கோப்பைப் படிக்க முடியவில்லை.");
    reader.readAsArrayBuffer(file);
  };

  const resetToSampleData = () => {
    setUploadedMatrix(null);
    setUploadedFileName("");
    setUploadError("");
  };

  // Selection state: arrays of row/col indices currently highlighted.
  // A single star click -> [index]. A rashi-group click -> all 3 indices of that group.
  const [selRows, setSelRows] = useState(null);
  const [selCols, setSelCols] = useState(null);

  const cellBg = (val) => {
    if (val >= 30) return "#eaf6ec";
    if (val <= 10) return "#fdecec";
    return "#ffffff";
  };

  const rowIndicesForRashi = (rashiIndex) =>
    STAR_ROWS.reduce((acc, s, i) => (s.rashiIndex === rashiIndex ? [...acc, i] : acc), []);

  const toggleRows = (indices) => setSelRows((prev) => (sameSet(prev, indices) ? null : indices));
  const toggleCols = (indices) => setSelCols((prev) => (sameSet(prev, indices) ? null : indices));

  const clickStarRow = (ri) => toggleRows([ri]);
  const clickRashiRow = (rashiIndex) => toggleRows(rowIndicesForRashi(rashiIndex));
  const clickStarCol = (ci) => toggleCols([ci]);
  const clickRashiCol = (rashiIndex) => toggleCols(rowIndicesForRashi(rashiIndex));
  const clickCell = (ri, ci) => {
    if (selRows && selRows.length === 1 && selRows[0] === ri && selCols && selCols.length === 1 && selCols[0] === ci) {
      setSelRows(null);
      setSelCols(null);
    } else {
      setSelRows([ri]);
      setSelCols([ci]);
    }
  };

  const describeSelection = (indices) => {
    if (!indices) return null;
    if (indices.length === 1) return STAR_ROWS[indices[0]].star;
    return RASHIS[STAR_ROWS[indices[0]].rashiIndex].name;
  };

  const rowLabel = describeSelection(selRows);
  const colLabel = describeSelection(selCols);
  const singlePick = selRows && selCols && selRows.length === 1 && selCols.length === 1;
  const pickedValue = singlePick ? matrix[selRows[0]][selCols[0]] : null;

  return (
    <div style={{ fontFamily: "'Noto Sans Tamil', 'Latha', sans-serif", background: "#f6f7f8", padding: 16 }}>
      <style>{`
        .npt-table-wrap {
          overflow: auto;
          max-height: 78vh;
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
        /* Sticky corner: covers both frozen columns AND both header rows */
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
        .npt-col-rashi-head, .npt-col-star-head, .npt-row-rashi-label, .npt-row-star-label {
          cursor: pointer;
          user-select: none;
          transition: background-color 0.12s ease;
        }
        .npt-col-rashi-head {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #ffffff;
          font-weight: 700;
          font-size: 12.5px;
          height: ${HEAD_ROW1_H}px;
          vertical-align: middle;
        }
        .npt-col-rashi-head:hover, .npt-row-rashi-label:hover {
          background: #fff1d6 !important;
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
        .npt-col-star-head:hover, .npt-row-star-label:hover {
          background: #fff1d6 !important;
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
        /* Selected header state */
        .npt-head-selected {
          background: #ffb703 !important;
          color: #1a1a1a;
        }
        /* Selected row/column band across the data grid — !important so it
           beats the inline per-cell background-color used for base shading */
        .npt-row-hit {
          background: #ffe9b8 !important;
          font-weight: 700;
        }
        .npt-col-hit {
          background: #ffe9b8 !important;
          font-weight: 700;
        }
        .npt-data-cell {
          cursor: pointer;
          color: #1a1a1a;
          transition: background-color 0.12s ease;
        }
        .npt-data-cell:hover {
          background: #ffe7b3 !important;
        }
        /* The intersection cell(s) of the current row+column selection: the "matching number" */
        .npt-match-cell {
          background: #ffb703 !important;
          color: #7a3e00;
          font-weight: 800;
          font-size: 13px;
          box-shadow: inset 0 0 0 2px #b56c00;
        }
        .npt-band-right {
          border-right: 2px solid #6f6f6f !important;
        }
        .npt-band-bottom {
          border-bottom: 2px solid #6f6f6f !important;
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, margin: "0 0 0 2px", color: "#222" }}>
          நட்சத்திர பொருத்தம் அட்டவணை {uploadedMatrix ? "" : "(Dummy Data)"}
        </h2>

        <div style={{ fontSize: 12.5, color: "#444", background: "#fff", border: "1px solid #ddd", borderRadius: 6, padding: "6px 10px", minWidth: 260 }}>
          {rowLabel || colLabel ? (
            <>
              <strong>{rowLabel || "—"}</strong> × <strong>{colLabel || "—"}</strong>
              {singlePick && (
                <span style={{ marginLeft: 8, color: "#b56c00", fontWeight: 800 }}>
                  பொருத்தம்: {pickedValue}/36
                </span>
              )}
            </>
          ) : (
            <span style={{ color: "#888" }}>ஒரு நட்சத்திரம் (வரிசை) &amp; ஒரு நட்சத்திரம் (நெடுவரிசை) கிளிக் செய்யவும்</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleExcelChange}
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: "#1a1a1a",
            background: "#ffffff",
            border: "1px solid #8c8c8c",
            borderRadius: 6,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          📄 Excel பதிவேற்றம் (.xlsx / .xls)
        </button>

        {uploadedMatrix && (
          <>
            <span style={{ fontSize: 12, color: "#2e7d32" }}>
              ✓ ஏற்றப்பட்டது: {uploadedFileName}
            </span>
            <button
              type="button"
              onClick={resetToSampleData}
              style={{
                fontSize: 12,
                color: "#555",
                background: "transparent",
                border: "1px solid #ccc",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
              }}
            >
              மாதிரி தரவுக்குத் திரும்பு
            </button>
          </>
        )}

        {uploadError && (
          <span style={{ fontSize: 12, color: "#c62828" }}>⚠ {uploadError}</span>
        )}
      </div>

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
            {/* Row 1: Rashi group headers spanning 3 columns each */}
            <tr>
              <th
                className="npt-corner npt-band-right npt-band-bottom"
                rowSpan={2}
                colSpan={2}
                style={{ cursor: "default" }}
              >
                நட்சத்திரம்
                <br />
                பொருத்தம் (*/36)
              </th>
              {RASHIS.map((r, ri) => {
                const indices = rowIndicesForRashi(ri);
                const isSel = sameSet(selCols, indices);
                return (
                  <th
                    key={r.name}
                    colSpan={3}
                    onClick={() => clickRashiCol(ri)}
                    className={`npt-col-rashi-head${ri < RASHIS.length - 1 ? " npt-band-right" : ""}${
                      isSel ? " npt-head-selected" : ""
                    }`}
                  >
                    {r.name}
                  </th>
                );
              })}
            </tr>
            {/* Row 2: individual star/pada headers */}
            <tr>
              {STAR_ROWS.map((s, ci) => {
                const isSel = selCols && selCols.length === 1 && selCols[0] === ci;
                return (
                  <th
                    key={ci}
                    onClick={() => clickStarCol(ci)}
                    className={`npt-col-star-head${
                      ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup ? " npt-band-right" : ""
                    }${isSel ? " npt-head-selected" : ""}`}
                  >
                    {s.star}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {STAR_ROWS.map((rowMeta, ri) => {
              const rashiObj = RASHIS[rowMeta.rashiIndex];
              const bottomBand = ri < n - 1 && STAR_ROWS[ri + 1].isFirstOfGroup;
              const rowIsSel = selRows && selRows.includes(ri);
              const rashiGroupIndices = rowIndicesForRashi(rowMeta.rashiIndex);
              const rashiHeadSel = sameSet(selRows, rashiGroupIndices);
              return (
                <tr key={ri}>
                  {rowMeta.isFirstOfGroup && (
                    <td
                      className={`npt-row-rashi-label${rashiHeadSel ? " npt-head-selected" : ""}`}
                      rowSpan={rashiObj.stars.length}
                      onClick={() => clickRashiRow(rowMeta.rashiIndex)}
                    >
                      {rashiObj.name}
                    </td>
                  )}
                  <td
                    className={`npt-row-star-label${bottomBand ? " npt-band-bottom" : ""}${
                      selRows && selRows.length === 1 && selRows[0] === ri ? " npt-head-selected" : ""
                    }`}
                    onClick={() => clickStarRow(ri)}
                  >
                    {rowMeta.star}
                  </td>
                  {matrix[ri].map((val, ci) => {
                    const colIsSel = selCols && selCols.includes(ci);
                    const isMatch = rowIsSel && colIsSel;
                    let cls = "npt-data-cell";
                    if (ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup) cls += " npt-band-right";
                    if (bottomBand) cls += " npt-band-bottom";
                    if (isMatch) cls += " npt-match-cell";
                    else if (rowIsSel) cls += " npt-row-hit";
                    else if (colIsSel) cls += " npt-col-hit";
                    return (
                      <td
                        key={ci}
                        className={cls}
                        style={isMatch ? undefined : { background: cellBg(val) }}
                        onClick={() => clickCell(ri, ci)}
                      >
                        {val}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p style={{ fontSize: 11, color: "#777", marginTop: 8 }}>
        * Values match the source spreadsheet exactly (36×36 porutham matrix). Click a rāsi or nakshathiram header
        (row or column) to select it, or click any cell directly — the matching score is highlighted in amber.
      </p>
    </div>
  );
}