import React, { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { getNakshatraMatrix, updateNakshatraMatrix, resetNakshatraMatrix } from "@/api/nakshatra";
import { calculateTwoStars } from "@/api/porutham_api";
import { motion, AnimatePresence } from 'motion/react';
import { useI18n } from '../i18n';
import { FileUp, RefreshCw, Star, Info, CheckCircle, Upload, ShieldAlert } from 'lucide-react';

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

const STAR_ROWS = RASHIS.flatMap((r, ri) =>
  r.stars.map((s, si) => ({ rashi: r.name, rashiIndex: ri, star: s, isFirstOfGroup: si === 0 }))
);

const REAL_MATRIX = [
  [24, 21, 32, 20, 20, 20, 18, 11, 11, 15, 14, 19, 19, 26, 25, 16, 16, 10, 22, 25, 22, 24, 32, 19, 15, 30, 29, 23, 26, 18, 19, 16, 15, 20, 31, 31],
  [23, 24, 28, 16, 20, 13, 12, 18, 21, 24, 15, 18, 21, 16, 26, 27, 25, 11, 14, 28, 22, 24, 23, 26, 25, 20, 31, 26, 24, 10, 11, 19, 25, 29, 23, 33],
  [28, 28, 24, 12, 7, 14, 12, 14, 13, 17, 19, 15, 19, 21, 18, 18, 21, 23, 27, 16, 19, 21, 26, 31, 31, 23, 14, 9, 10, 23, 24, 28, 18, 23, 26, 17],
  [24, 24, 20, 24, 19, 26, 17, 18, 18, 15, 18, 13, 12, 14, 11, 16, 19, 22, 31, 20, 23, 19, 24, 29, 27, 19, 10, 14, 9, 29, 29, 32, 23, 18, 21, 12],
  [28, 29, 15, 19, 24, 35, 26, 23, 23, 21, 22, 6, 3, 18, 19, 24, 21, 18, 27, 24, 19, 15, 28, 23, 19, 26, 17, 21, 19, 25, 25, 24, 31, 27, 25, 19],
  [30, 19, 24, 28, 34, 24, 15, 23, 22, 19, 13, 14, 13, 9, 18, 23, 24, 24, 8, 17, 33, 27, 21, 23, 22, 14, 24, 28, 30, 15, 15, 26, 29, 24, 18, 25],
  [27, 16, 22, 25, 31, 21, 24, 32, 31, 18, 12, 13, 17, 13, 22, 24, 25, 9, 8, 24, 18, 20, 19, 20, 22, 14, 24, 26, 28, 13, 14, 25, 28, 25, 18, 25],
  [17, 18, 19, 23, 30, 30, 33, 24, 24, 11, 19, 13, 16, 23, 14, 16, 17, 19, 18, 21, 18, 21, 23, 11, 13, 27, 25, 28, 29, 23, 24, 13, 28, 19, 25, 28],
  [20, 28, 23, 26, 27, 29, 32, 23, 24, 11, 21, 16, 16, 19, 15, 17, 15, 20, 19, 25, 26, 19, 28, 13, 13, 23, 26, 28, 28, 24, 25, 18, 18, 15, 27, 27],
  [22, 26, 25, 22, 21, 25, 16, 27, 24, 24, 34, 29, 16, 17, 15, 11, 11, 14, 14, 20, 11, 17, 26, 12, 17, 27, 30, 25, 25, 21, 21, 16, 14, 18, 30, 30],
  [29, 21, 25, 22, 25, 17, 17, 25, 22, 34, 24, 29, 18, 15, 22, 18, 20, 4, 3, 20, 13, 19, 15, 21, 25, 20, 29, 23, 24, 10, 10, 22, 24, 28, 18, 31],
  [24, 23, 22, 19, 9, 19, 19, 18, 20, 29, 28, 24, 13, 14, 18, 14, 13, 19, 19, 4, 11, 17, 20, 23, 30, 24, 17, 12, 10, 26, 26, 25, 20, 24, 25, 14],
  [22, 24, 22, 17, 10, 17, 21, 23, 27, 22, 26, 21, 24, 29, 27, 16, 17, 21, 20, 8, 12, 15, 19, 25, 21, 16, 8, 9, 19, 23, 23, 26, 17, 23, 26, 17],
  [29, 19, 25, 20, 23, 16, 20, 18, 21, 29, 23, 23, 29, 24, 34, 23, 22, 8, 7, 21, 15, 18, 16, 19, 18, 13, 23, 24, 24, 10, 10, 19, 24, 30, 23, 31],
  [23, 31, 22, 17, 25, 24, 28, 21, 20, 23, 32, 25, 26, 34, 24, 13, 13, 15, 13, 12, 22, 12, 15, 25, 10, 10, 24, 21, 22, 25, 17, 17, 12, 15, 21, 33],
  [20, 28, 19, 23, 31, 30, 32, 25, 26, 19, 28, 21, 25, 31, 21, 24, 26, 24, 15, 25, 15, 10, 21, 5, 6, 20, 17, 20, 23, 15, 22, 17, 20, 18, 31, 25],
  [15, 17, 23, 27, 27, 31, 33, 23, 26, 20, 27, 23, 25, 30, 22, 25, 24, 27, 18, 25, 18, 14, 19, 8, 8, 19, 19, 22, 20, 19, 26, 14, 22, 21, 27, 30],
  [20, 12, 25, 30, 25, 14, 16, 27, 23, 20, 12, 26, 30, 15, 22, 25, 26, 24, 15, 17, 25, 20, 5, 17, 20, 3, 14, 17, 17, 13, 20, 29, 24, 22, 13, 25],
  [21, 14, 27, 29, 24, 13, 13, 24, 31, 19, 12, 25, 26, 11, 18, 24, 25, 23, 24, 26, 34, 23, 7, 20, 20, 3, 14, 19, 19, 15, 13, 22, 17, 20, 11, 20],
  [21, 28, 15, 17, 21, 30, 30, 26, 21, 28, 26, 14, 13, 26, 25, 31, 34, 28, 27, 24, 19, 8, 22, 18, 13, 19, 9, 15, 17, 28, 19, 13, 23, 27, 25, 18],
  [21, 22, 19, 21, 13, 24, 24, 24, 17, 18, 20, 17, 18, 17, 18, 24, 24, 24, 35, 18, 24, 13, 15, 20, 20, 11, 6, 16, 10, 26, 24, 22, 22, 15, 19, 19],
  [23, 24, 21, 19, 11, 22, 20, 20, 27, 23, 25, 23, 21, 21, 22, 18, 18, 28, 30, 13, 19, 24, 26, 31, 23, 14, 9, 5, 3, 20, 20, 18, 11, 16, 16, 10],
  [30, 22, 25, 23, 27, 19, 17, 21, 13, 33, 22, 28, 24, 21, 29, 25, 27, 10, 13, 29, 22, 27, 24, 30, 15, 14, 21, 16, 19, 3, 3, 15, 17, 23, 23, 25],
  [17, 24, 31, 29, 19, 22, 20, 8, 9, 19, 27, 30, 30, 23, 17, 13, 11, 25, 27, 22, 27, 32, 29, 34, 13, 16, 17, 13, 11, 18, 18, 10, 4, 9, 19, 16],
  [6, 18, 19, 22, 24, 20, 18, 18, 14, 26, 14, 24, 29, 28, 25, 16, 16, 12, 24, 25, 21, 25, 30, 23, 21, 24, 27, 26, 14, 15, 20, 20, 13, 6, 11, 20],
  [23, 12, 15, 18, 23, 17, 17, 24, 24, 30, 19, 24, 25, 20, 31, 26, 26, 11, 13, 25, 21, 25, 22, 25, 27, 24, 33, 21, 22, 7, 7, 14, 21, 26, 17, 26],
  [23, 23, 6, 9, 11, 22, 17, 26, 29, 29, 30, 15, 16, 30, 28, 23, 26, 18, 19, 19, 11, 16, 31, 24, 27, 33, 24, 12, 13, 14, 14, 15, 20, 25, 26, 17],
  [22, 22, 5, 7, 14, 21, 27, 30, 30, 25, 27, 11, 11, 25, 23, 27, 30, 23, 24, 23, 16, 11, 27, 19, 23, 29, 20, 24, 25, 26, 19, 20, 25, 21, 22, 13],
  [20, 21, 7, 9, 11, 23, 29, 28, 23, 27, 23, 14, 11, 25, 25, 29, 27, 15, 26, 22, 18, 14, 25, 22, 23, 30, 20, 24, 24, 28, 21, 20, 24, 21, 20, 14],
  [15, 4, 21, 23, 15, 7, 13, 24, 16, 19, 12, 25, 26, 11, 19, 23, 23, 20, 26, 24, 31, 26, 12, 24, 29, 12, 23, 27, 27, 24, 17, 25, 11, 17, 7, 13],
  [15, 4, 21, 22, 17, 6, 6, 17, 10, 19, 12, 25, 26, 21, 12, 15, 13, 28, 30, 20, 26, 20, 20, 20, 23, 22, 21, 24, 29, 32, 24, 18, 7, 16, 16, 19],
  [8, 16, 21, 23, 17, 17, 6, 12, 14, 20, 19, 26, 21, 12, 15, 13, 18, 30, 20, 30, 26, 20, 23, 22, 21, 24, 29, 26, 21, 32, 24, 18, 7, 16, 16, 13],
  [13, 18, 15, 16, 20, 23, 23, 15, 8, 16, 26, 19, 20, 21, 23, 17, 20, 19, 24, 26, 30, 23, 19, 26, 10, 15, 26, 29, 26, 29, 18, 24, 13, 21, 19, 21],
  [14, 20, 16, 12, 16, 19, 19, 11, 20, 12, 22, 16, 24, 27, 21, 17, 15, 21, 25, 25, 18, 23, 30, 15, 16, 27, 30, 30, 29, 26, 24, 13, 19, 24, 32, 30],
  [23, 16, 17, 12, 19, 9, 9, 19, 20, 24, 13, 18, 24, 23, 31, 26, 27, 8, 8, 27, 18, 23, 21, 26, 23, 22, 29, 29, 30, 14, 12, 23, 27, 22, 24, 34],
  [23, 23, 11, 7, 7, 19, 19, 16, 20, 24, 14, 8, 18, 29, 30, 26, 25, 20, 20, 17, 12, 32, 24, 19, 28, 31, 21, 21, 23, 21, 22, 25, 30, 33, 24, 29],
];

function extractMatrixFromWorkbook(workbook: XLSX.WorkBook): number[][] {
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("Excel வொர்க்புக்கில் shet கிடைக்கவில்லை.");

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null }) as (unknown[])[];
  const n = STAR_ROWS.length; 
  const ROW_START = 2; 
  const COL_START = 2; 

  const matrix: number[][] = [];
  for (let i = 0; i < n; i++) {
    const srcRow = rows[ROW_START + i] || [];
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      const raw = srcRow[COL_START + j];
      const num = typeof raw === "number" ? raw : parseFloat(String(raw));
      if (!Number.isFinite(num)) {
        throw new Error(`வரிசை ${i + 1}, நெடுவரிசை ${j + 1}: எண் எதிர்பார்க்கப்பட்டது, ஆனால் "${raw}" கிடைத்தது.`);
      }
      row.push(num);
    }
    matrix.push(row);
  }
  return matrix;
}

const COL_W = 46; 
const ROW_LABEL1_W = 90; 
const ROW_LABEL2_W = 140; 
const HEAD_ROW1_H = 34; 
const HEAD_ROW2_H = 50; 

function sameSet(a: any, b: any) {
  if (!a || !b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

export default function NakshatraPoruthamTable() {
  const { t } = useI18n();
  const [matrix, setMatrix] = useState<number[][]>(REAL_MATRIX);
  const [loading, setLoading] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isModified, setIsModified] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const n = STAR_ROWS.length;

  useEffect(() => {
    async function loadMatrix() {
      try {
        setLoading(true);
        const data = await getNakshatraMatrix();
        if (data && data.matrix) {
          setMatrix(data.matrix);
          setIsModified(data.isCustomized);
        }
      } catch (err) {
        console.error("Failed to load Nakshatra matrix from backend", err);
      } finally {
        setLoading(false);
      }
    }
    loadMatrix();
  }, []);

  const handleExcelChange = (e: any) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;

    const isExcel = /\.(xlsx|xls)$/i.test(file.name);
    if (!isExcel) {
      setUploadError("Excel கோப்பு (.xlsx அல்லது .xls) மட்டுமே ஏற்றுக்கொள்ளப்படும்.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const result = evt.target?.result;
        if (!(result instanceof ArrayBuffer)) {
          throw new Error("Excel கோப்பை தரவுவாக பெற முடியவில்லை.");
        }
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });
        const parsed = extractMatrixFromWorkbook(workbook);

        setLoading(true);
        const response = await updateNakshatraMatrix(parsed);
        setMatrix(response.matrix);
        setIsModified(response.isCustomized);
        setUploadedFileName(file.name);
        setUploadError("");
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Excel கோப்பைப் படிக்க முடியவில்லை.";
        setUploadError(errorMsg || "Excel கோப்பைப் படிக்க முடியவில்லை.");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => setUploadError("Excel கோப்பைப் படிக்க முடியவில்லை.");
    reader.readAsArrayBuffer(file);
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const response = await resetNakshatraMatrix();
      setMatrix(response.matrix);
      setUploadedFileName("");
      setUploadError("");
      setIsModified(response.isCustomized);
    } catch (err) {
      setUploadError("மீட்டமைக்க முடியவில்லை.");
    } finally {
      setLoading(false);
    }
  };

  const [selRows, setSelRows] = useState<number[] | null>(null);
  const [selCols, setSelCols] = useState<number[] | null>(null);

  const cellBg = (val: number) => {
    if (val >= 30) return "#d1fae5"; // emerald-100
    if (val <= 10) return "#ffe4e6"; // rose-100
    return "#ffffff";
  };

  const rowIndicesForRashi = (rashiIndex: number): number[] =>
    STAR_ROWS.reduce<number[]>((acc, s, i) => (s.rashiIndex === rashiIndex ? [...acc, i] : acc), []);

  const toggleRows = (indices: number[]) => setSelRows((prev) => (sameSet(prev, indices) ? null : indices));
  const toggleCols = (indices: number[]) => setSelCols((prev) => (sameSet(prev, indices) ? null : indices));

  const clickStarRow = (ri: number) => toggleRows([ri]);
  const clickRashiRow = (rashiIndex: number) => toggleRows(rowIndicesForRashi(rashiIndex));
  const clickStarCol = (ci: number) => toggleCols([ci]);
  const clickRashiCol = (rashiIndex: number) => toggleCols(rowIndicesForRashi(rashiIndex));
  const clickCell = (ri: number, ci: number) => {
    if (selRows && selRows.length === 1 && selRows[0] === ri && selCols && selCols.length === 1 && selCols[0] === ci) {
      setSelRows(null);
      setSelCols(null);
    } else {
      setSelRows([ri]);
      setSelCols([ci]);
    }
  };

  const describeSelection = (indices: number[] | null) => {
    if (!indices) return null;
    if (indices.length === 1) return STAR_ROWS[indices[0]].star;
    return RASHIS[STAR_ROWS[indices[0]].rashiIndex].name;
  };

  const rowLabel = describeSelection(selRows);
  const colLabel = describeSelection(selCols);
  const singlePick = selRows && selCols && selRows.length === 1 && selCols.length === 1;
  const pickedValue = singlePick ? matrix[selRows[0]][selCols[0]] : null;

  const [dynMatchResult, setDynMatchResult] = useState<any>(null);
  const [isDynLoading, setIsDynLoading] = useState(false);

  useEffect(() => {
    if (singlePick && selRows && selCols) {
      const brideStar = STAR_ROWS[selRows[0]].star;
      const groomStar = STAR_ROWS[selCols[0]].star;
      setIsDynLoading(true);
      calculateTwoStars(brideStar, groomStar)
        .then(res => {
          setDynMatchResult(res);
        })
        .catch(err => {
          console.error("Failed to calculate matching dynamically", err);
        })
        .finally(() => {
          setIsDynLoading(false);
        });
    } else {
      setDynMatchResult(null);
    }
  }, [selRows, selCols, singlePick]);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[95vw] mx-auto w-full min-h-screen bg-slate-50/50">
      <style>{`
        .npt-table-wrap {
          overflow: auto;
          max-height: 75vh;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
        }
        .npt-table {
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
          width: max-content;
        }
        .npt-table th, .npt-table td {
          border-right: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          box-sizing: border-box;
          text-align: center;
          font-size: 11px;
          padding: 6px 4px;
          line-height: 1.2;
          white-space: normal;
          word-break: keep-all;
        }
        .npt-corner {
          position: sticky;
          left: 0;
          top: 0;
          z-index: 50;
          background: #f8fafc;
          font-weight: 800;
          font-size: 11px;
          color: #475569;
          height: ${HEAD_ROW1_H + HEAD_ROW2_H}px;
        }
        .npt-col-rashi-head, .npt-col-star-head, .npt-row-rashi-label, .npt-row-star-label {
          cursor: pointer;
          user-select: none;
          transition: all 0.2s ease;
        }
        .npt-col-rashi-head {
          position: sticky;
          top: 0;
          z-index: 30;
          background: #f8fafc;
          font-weight: 800;
          color: #334155;
          font-size: 12.5px;
          height: ${HEAD_ROW1_H}px;
          vertical-align: middle;
        }
        .npt-col-rashi-head:hover, .npt-row-rashi-label:hover {
          background: #eef2ff !important;
          color: #4f46e5;
        }
        .npt-col-star-head {
          position: sticky;
          top: ${HEAD_ROW1_H}px;
          z-index: 30;
          background: #ffffff;
          font-weight: 700;
          color: #475569;
          height: ${HEAD_ROW2_H}px;
          vertical-align: middle;
        }
        .npt-col-star-head:hover, .npt-row-star-label:hover {
          background: #eef2ff !important;
          color: #4f46e5;
        }
        .npt-row-rashi-label {
          position: sticky;
          left: 0;
          z-index: 20;
          background: #f8fafc;
          font-weight: 800;
          color: #334155;
        }
        .npt-row-star-label {
          position: sticky;
          left: ${ROW_LABEL1_W}px;
          z-index: 20;
          background: #ffffff;
          font-weight: 700;
          color: #475569;
          text-align: left !important;
          padding-left: 10px !important;
        }
        .npt-head-selected {
          background: #e0e7ff !important;
          color: #4338ca !important;
        }
        .npt-row-hit {
          background: #eef2ff !important;
          font-weight: 800;
        }
        .npt-col-hit {
          background: #eef2ff !important;
          font-weight: 800;
        }
        .npt-data-cell {
          cursor: pointer;
          color: #334155;
          font-weight: 600;
          transition: all 0.15s ease;
        }
        .npt-data-cell:hover {
          background: #c7d2fe !important;
          color: #3730a3;
        }
        .npt-match-cell {
          background: #4f46e5 !important;
          color: #ffffff !important;
          font-weight: 900;
          font-size: 13px;
          box-shadow: inset 0 0 0 2px #3730a3;
        }
        .npt-band-right {
          border-right: 2px solid #cbd5e1 !important;
        }
        .npt-band-bottom {
          border-bottom: 2px solid #cbd5e1 !important;
        }
      `}</style>

      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            {t('nakshatraTitle')}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">{t('nakshatraSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleExcelChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Upload className="h-4 w-4 text-indigo-500" /> Excel பதிவேற்றம்
          </button>

          {isModified && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold px-4 py-2 rounded-xl transition-all"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> மாதிரி தரவுக்குத் திரும்பு
            </button>
          )}
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Main Table Area */}
        <div className="flex-1 relative w-full">
          {/* Axis Labels */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-200 shadow-sm z-50">
            பெண் / Female (Columns)
          </div>
          <div className="absolute top-1/2 -left-4 -translate-y-1/2 -translate-x-full bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-200 shadow-sm transform -rotate-90 origin-right z-50">
            ஆண் / Male (Rows)
          </div>

          <div className="npt-table-wrap ml-6 mt-2 relative">
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
                    <div className="flex flex-col items-center justify-center h-full gap-1">
                      <Star className="h-4 w-4 text-slate-400" />
                      <span>பொருத்தம்<br/>(*/36)</span>
                    </div>
                  </th>
                  {RASHIS.map((r, ri) => {
                    const indices = rowIndicesForRashi(ri);
                    const isSel = sameSet(selCols, indices);
                    return (
                      <th
                        key={r.name}
                        colSpan={3}
                        onClick={() => clickRashiCol(ri)}
                        className={`npt-col-rashi-head${ri < RASHIS.length - 1 ? ' npt-band-right' : ''}${isSel ? ' npt-head-selected' : ''}`}
                      >
                        {r.name}
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  {STAR_ROWS.map((s, ci) => {
                    const isSel = selCols && selCols.length === 1 && selCols[0] === ci;
                    return (
                      <th
                        key={ci}
                        onClick={() => clickStarCol(ci)}
                        className={`npt-col-star-head${ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup ? ' npt-band-right' : ''}${isSel ? ' npt-head-selected' : ''}`}
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
                          className={`npt-row-rashi-label${rashiHeadSel ? ' npt-head-selected' : ''}`}
                          rowSpan={rashiObj.stars.length}
                          onClick={() => clickRashiRow(rowMeta.rashiIndex)}
                        >
                          {rashiObj.name}
                        </td>
                      )}
                      <td
                        className={`npt-row-star-label${bottomBand ? ' npt-band-bottom' : ''}${selRows && selRows.length === 1 && selRows[0] === ri ? ' npt-head-selected' : ''}`}
                        onClick={() => clickStarRow(ri)}
                      >
                        {rowMeta.star}
                      </td>
                      {matrix[ri].map((val, ci) => {
                        const colIsSel = selCols && selCols.includes(ci);
                        const isMatch = rowIsSel && colIsSel;
                        let cls = 'npt-data-cell';
                        if (ci < n - 1 && STAR_ROWS[ci + 1].isFirstOfGroup) cls += ' npt-band-right';
                        if (bottomBand) cls += ' npt-band-bottom';
                        if (isMatch) cls += ' npt-match-cell';
                        else if (rowIsSel) cls += ' npt-row-hit';
                        else if (colIsSel) cls += ' npt-col-hit';
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
        </div>

        {/* Info Panel / Results Card */}
        <div className="w-full md:w-80 lg:w-96 shrink-0 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/60 shadow-sm sticky top-6">
            <h3 className="text-sm font-extrabold text-slate-800 mb-3 flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-500" />
              Selection Details
            </h3>
            
            {rowLabel || colLabel ? (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="bg-indigo-50 text-indigo-900 text-xs font-bold p-2.5 rounded-xl border border-indigo-100 flex items-center gap-2">
                    <span className="bg-indigo-200 text-indigo-800 text-[9px] uppercase px-1.5 py-0.5 rounded-md shrink-0">Male</span>
                    {rowLabel || "—"}
                  </div>
                  <div className="bg-emerald-50 text-emerald-900 text-xs font-bold p-2.5 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <span className="bg-emerald-200 text-emerald-800 text-[9px] uppercase px-1.5 py-0.5 rounded-md shrink-0">Female</span>
                    {colLabel || "—"}
                  </div>
                </div>
                
                {singlePick && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center mt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Matrix Score</p>
                    <div className="text-3xl font-black text-indigo-600">{pickedValue}<span className="text-lg text-slate-400">/36</span></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-2xl p-6 text-center text-slate-400 text-xs font-medium">
                ஒரு நட்சத்திரம் (வரிசை) &amp; ஒரு நட்சத்திரம் (நெடுவரிசை) கிளிக் செய்யவும்
              </div>
            )}
            
            <AnimatePresence>
              {singlePick && selRows && selCols && dynMatchResult && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dynamic Result</p>
                    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      dynMatchResult.rating === "Excellent" ? "bg-emerald-100 text-emerald-700" : dynMatchResult.rating === "Good" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {dynMatchResult.rating}
                    </span>
                  </div>
                  
                  <div className="bg-white border border-slate-100 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto custom-scrollbar">
                    {dynMatchResult.poruthamScores?.map((p: any, idx: number) => (
                      <div key={idx} className="p-2.5 border-b border-slate-50 last:border-0 flex justify-between items-center hover:bg-slate-50">
                        <div>
                          <p className="text-[11px] font-bold text-slate-700">{p.label}</p>
                          <p className="text-[9px] font-medium text-slate-400 truncate max-w-[140px]">{p.description}</p>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                          p.status === "Uthamam" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : p.status === "Madhyamam" ? "bg-amber-50 text-amber-600 border border-amber-100" : "bg-rose-50 text-rose-600 border border-rose-100"
                        }`}>
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {uploadError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-medium flex gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0" /> {uploadError}
              </div>
            )}
            
            {uploadedFileName && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold flex gap-2 items-center">
                <CheckCircle className="h-4 w-4 shrink-0" /> {uploadedFileName} loaded
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}