import React, { useRef } from 'react';
import { Download, FileText, CheckCircle2, AlertTriangle, XCircle, ArrowLeft, Printer } from 'lucide-react';
import { VerdictData } from '../data/demoData';
import { jsPDF } from 'jspdf';

interface PdfViewProps {
  verdict: VerdictData;
  onBack: () => void;
}

const VERDICT_COLOR: Record<string, string> = {
  Pass: '#06d6a0',
  Partial: '#ffbe0b',
  Fail: '#ef476f',
};

const VerdictChip: React.FC<{ verdict: string }> = ({ verdict }) => {
  const Icon = verdict === 'Pass' ? CheckCircle2 : verdict === 'Partial' ? AlertTriangle : XCircle;
  return (
    <span
      className="retro-pixel-tag inline-flex items-center gap-1.5 px-2 py-1.5 border-2 border-ink rounded-md text-ink"
      style={{ background: VERDICT_COLOR[verdict] ?? VERDICT_COLOR.Partial }}
    >
      <Icon size={11} strokeWidth={3} />
      {verdict.toUpperCase()}
    </span>
  );
};

export const PdfView: React.FC<PdfViewProps> = ({ verdict, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.setFillColor(246, 241, 229);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    doc.setFillColor(22, 19, 14);
    doc.rect(0, 0, pageWidth, 26, 'F');
    doc.setTextColor(255, 190, 11);
    doc.setFontSize(15);
    doc.setFont('courier', 'bold');
    doc.text('PR AUTOPILOT — ANALYSIS REPORT', 14, 12);
    doc.setTextColor(246, 241, 229);
    doc.setFontSize(8);
    doc.text(`Generated ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 19);

    doc.setTextColor(22, 19, 14);
    doc.setFontSize(22);
    doc.text(`VERDICT: ${verdict.overall_verdict.toUpperCase()}`, 14, 42);
    doc.setFontSize(14);
    doc.text(`CONFIDENCE: ${verdict.confidence}%`, 14, 52);

    doc.setDrawColor(22, 19, 14);
    doc.setLineWidth(1);
    doc.line(14, 58, pageWidth - 14, 58);

    doc.setFont('courier', 'normal');
    doc.setFontSize(9);
    const summaryLines = doc.splitTextToSize(verdict.summary, pageWidth - 28);
    doc.text(summaryLines, 14, 66);

    let yPos = 66 + summaryLines.length * 4.5 + 10;

    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text(`REQUIREMENTS BREAKDOWN (${verdict.requirements.length})`, 14, yPos);
    yPos += 9;

    verdict.requirements.forEach((req, index) => {
      if (yPos > 262) {
        doc.addPage();
        doc.setFillColor(246, 241, 229);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        yPos = 20;
      }

      doc.setFont('courier', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(22, 19, 14);
      const reqLines = doc.splitTextToSize(`${index + 1}. ${req.text}`, pageWidth - 28);
      doc.text(reqLines, 14, yPos);
      yPos += reqLines.length * 5 + 1;

      doc.setFontSize(8);
      doc.text(`VERDICT: ${req.verdict.toUpperCase()}  -  CONFIDENCE: ${req.confidence}%`, 18, yPos);
      yPos += 5;

      doc.setFont('courier', 'normal');
      const evLines = doc.splitTextToSize(`Evidence: ${req.evidence}`, pageWidth - 38);
      doc.text(evLines, 18, yPos);
      yPos += evLines.length * 4 + 3;

      const testLines = doc.splitTextToSize(`Test: ${req.test}`, pageWidth - 38);
      doc.text(testLines, 18, yPos);
      yPos += testLines.length * 4 + 8;

      doc.setDrawColor(22, 19, 14);
      doc.setLineWidth(0.3);
      doc.setLineDashPattern([2, 2], 0);
      doc.line(14, yPos - 4, pageWidth - 14, yPos - 4);
      doc.setLineDashPattern([], 0);
    });

    doc.save('pr-autopilot-report.pdf');
  };

  return (
    <div className="retro-scope retro-paper-bg retro-grain min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-[#fffdf6]/95 backdrop-blur-sm border-b-2 border-ink">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button type="button" onClick={onBack} className="retro-btn px-3 sm:px-4 py-2 text-sm">
              <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
            </button>
            <span className="flex items-center gap-2 font-display-retro text-base sm:text-lg text-ink">
              <FileText size={18} /> EXPORT REPORT
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => window.print()} className="retro-btn px-3 sm:px-4 py-2 text-sm">
              <Printer size={16} /> <span className="hidden sm:inline">Print</span>
            </button>
            <button type="button" onClick={handleExport} className="retro-btn retro-btn-yellow px-3 sm:px-5 py-2 text-sm">
              <Download size={16} /> <span className="hidden sm:inline">Download PDF</span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-8 max-w-[900px] mx-auto w-full">
        <div ref={contentRef} className="retro-card overflow-hidden">
          <div className="bg-ink px-6 sm:px-10 py-7 border-b-2 border-ink">
            <p className="retro-pixel-tag text-retro-yellow mb-2">OFFICIAL DOCUMENT</p>
            <h1 className="font-display-retro text-2xl sm:text-4xl text-paper tracking-tight">
              PR AUTOPILOT — ANALYSIS REPORT
            </h1>
            <p className="font-mono text-xs text-paper/60 mt-3">
              Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
            </p>
          </div>

          <div className="p-6 sm:p-10 bg-[#fffdf6] space-y-10">
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14">
              <div className="text-center">
                <div
                  className="retro-stamp inline-block border-4 font-display-retro text-3xl sm:text-4xl px-6 py-3 rounded-lg select-none"
                  style={{
                    borderColor: VERDICT_COLOR[verdict.overall_verdict],
                    color: VERDICT_COLOR[verdict.overall_verdict],
                  }}
                >
                  {verdict.overall_verdict.toUpperCase()}
                </div>
                <div className="retro-pixel-tag text-ink/50 mt-4">OVERALL VERDICT</div>
              </div>
              <div className="hidden sm:block w-0.5 h-20 bg-ink/15" />
              <div className="text-center">
                <div className="font-display-retro text-5xl text-ink">{verdict.confidence}%</div>
                <div className="retro-pixel-tag text-ink/50 mt-2">CONFIDENCE SCORE</div>
              </div>
              <div className="hidden sm:block w-0.5 h-20 bg-ink/15" />
              <div className="text-center">
                <div className="font-display-retro text-5xl text-ink">{verdict.requirements.length}</div>
                <div className="retro-pixel-tag text-ink/50 mt-2">CRITERIA CHECKED</div>
              </div>
            </div>

            <section className="border-2 border-ink rounded-xl overflow-hidden shadow-retro-sm">
              <div className="retro-window-bar">
                <span className="retro-window-dot bg-retro-yellow" />
                <span className="ml-2 retro-pixel-tag text-ink/70">SUMMARY</span>
              </div>
              <p className="p-5 font-mono text-sm text-ink-soft leading-relaxed bg-[#fffdf6]">
                {verdict.summary}
              </p>
            </section>

            <section className="space-y-5">
              <h3 className="font-display-retro text-xl text-ink">
                REQUIREMENTS <span className="retro-marker">BREAKDOWN</span>
              </h3>
              {verdict.requirements.map((req, index) => (
                <article key={req.id} className="border-2 border-ink rounded-xl overflow-hidden bg-[#fffdf6] shadow-retro-sm">
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b-2 border-ink bg-paper-dim">
                    <span className="w-8 h-8 shrink-0 rounded-lg border-2 border-ink bg-[#fffdf6] flex items-center justify-center font-mono text-sm font-bold text-ink shadow-retro-sm">
                      {index + 1}
                    </span>
                    <p className="font-mono text-sm font-bold text-ink flex-1">{req.text}</p>
                    <VerdictChip verdict={req.verdict} />
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="retro-pixel-tag text-ink/50">CONFIDENCE</span>
                        <span className="font-mono text-xs font-bold text-ink">{req.confidence}%</span>
                      </div>
                      <div className="h-3.5 border-2 border-ink rounded-full bg-paper-dim overflow-hidden">
                        <div
                          className="h-full border-r-2 border-ink"
                          style={{ width: `${req.confidence}%`, background: VERDICT_COLOR[req.verdict] }}
                        />
                      </div>
                    </div>
                    <div className="border-2 border-ink rounded-lg p-4 bg-retro-blue/10">
                      <h4 className="retro-pixel-tag text-ink/60 mb-2">EVIDENCE</h4>
                      <p className="font-mono text-xs text-ink leading-relaxed">{req.evidence}</p>
                    </div>
                    <div className="retro-scanlines border-2 border-ink rounded-lg p-4 bg-ink overflow-x-auto">
                      <h4 className="retro-pixel-tag text-retro-green mb-2">GENERATED TEST</h4>
                      <pre className="font-mono text-xs text-retro-green whitespace-pre-wrap leading-relaxed">{req.test}</pre>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <footer className="pt-6 border-t-2 border-dashed border-ink/25 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="retro-pixel-tag text-ink/40">STAMPED BY PR AUTOPILOT · EVIDENCE-VERIFIED</p>
              <p className="font-mono text-[10px] text-ink/40">Every finding cites file:line — verify before you merge.</p>
            </footer>
          </div>
        </div>
      </main>
    </div>
  );
};