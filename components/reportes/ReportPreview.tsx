'use client';

import { forwardRef } from 'react';
import { Activity } from 'lucide-react';
import { ReportData } from '@/lib/reportes/report-types';

interface ReportPreviewProps {
  data: ReportData;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '—';
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
};

const filledMeasurements = (measurements: ReportData['measurements']) =>
  measurements.filter((m) => m.label.trim() || m.value.trim());

const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(({ data }, ref) => {
  const filled = filledMeasurements(data.measurements);

  return (
    <div
      ref={ref}
      id="report-preview"
      className="bg-white shadow-none"
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        width: '100%',
        minHeight: '297mm',
        padding: '14mm 16mm',
        boxSizing: 'border-box',
        color: '#1e293b',
        fontSize: '10pt',
        lineHeight: '1.6',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: '2px solid #0d9488', paddingBottom: '10mm', marginBottom: '8mm' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #0d9488, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16pt', fontWeight: '700', color: '#0d9488', letterSpacing: '-0.3px' }}>
                MediReport
              </div>
              <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '1px' }}>
                Medical Imaging &amp; Diagnostic Reports
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '14pt', fontWeight: '700', color: '#0f172a', letterSpacing: '0.5px' }}>
              {data.studyType || 'MEDICAL REPORT'}
            </div>
            <div style={{ fontSize: '8pt', color: '#64748b', marginTop: '2px' }}>
              Date: {formatDate(data.date)}
            </div>
            <div style={{ fontSize: '8pt', color: '#94a3b8', marginTop: '1px' }}>
              Report ID: {`RPT-${data.date?.replace(/-/g, '') || '00000000'}-${Math.abs(data.patientName.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 9999).toString().padStart(4, '0')}`}
            </div>
          </div>
        </div>
      </div>

      {/* Patient & Doctor Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6mm', marginBottom: '8mm' }}>
        <InfoBox title="Patient Information">
          <InfoRow label="Name" value={data.patientName || '—'} />
          <InfoRow label="Study" value={data.studyType || '—'} />
        </InfoBox>
        <InfoBox title="Ordering Physician">
          <InfoRow label="Doctor" value={data.doctorName || '—'} />
          <InfoRow label="Date" value={formatDate(data.date)} />
        </InfoBox>
      </div>

      {/* Reason */}
      {data.reason.trim() && (
        <SectionBlock title="Clinical Indication / Reason for Study" accent="#0ea5e9">
          <p style={{ margin: 0, color: '#334155' }}>{data.reason}</p>
        </SectionBlock>
      )}

      {/* Description */}
      {data.description.trim() && (
        <SectionBlock title="Findings &amp; Description" accent="#0d9488">
          <p style={{ margin: 0, color: '#1e293b', whiteSpace: 'pre-wrap' }}>{data.description}</p>
        </SectionBlock>
      )}

      {/* Measurements */}
      {filled.length > 0 && (
        <SectionBlock title="Measurements" accent="#14b8a6">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9.5pt' }}>
            <thead>
              <tr style={{ background: '#f0fdfa' }}>
                <th style={{ textAlign: 'left', padding: '4px 8px', color: '#0f766e', fontWeight: '600', borderBottom: '1px solid #99f6e4', fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Parameter</th>
                <th style={{ textAlign: 'right', padding: '4px 8px', color: '#0f766e', fontWeight: '600', borderBottom: '1px solid #99f6e4', fontSize: '8pt', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              {filled.map((m, i) => (
                <tr key={m.id} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fffe' }}>
                  <td style={{ padding: '4px 8px', color: '#334155', borderBottom: '1px solid #e2e8f0' }}>{m.label}</td>
                  <td style={{ padding: '4px 8px', textAlign: 'right', fontFamily: 'monospace', color: '#0f172a', fontWeight: '600', borderBottom: '1px solid #e2e8f0' }}>{m.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionBlock>
      )}

      {/* Conclusion */}
      {data.conclusion.trim() && (
        <SectionBlock title="Conclusion / Impression" accent="#06b6d4">
          <p style={{ margin: 0, color: '#0f172a', whiteSpace: 'pre-wrap', fontWeight: '500' }}>{data.conclusion}</p>
        </SectionBlock>
      )}

      {/* Footer / Signature */}
      <div style={{ marginTop: '14mm', borderTop: '1px solid #e2e8f0', paddingTop: '8mm', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: '7.5pt', color: '#94a3b8', maxWidth: '55%' }}>
          <p style={{ margin: '0 0 2px 0' }}>This report is generated for medical reference purposes only.</p>
          <p style={{ margin: 0 }}>Please consult with your healthcare provider for medical advice.</p>
        </div>
        <div style={{ textAlign: 'center', minWidth: '120px' }}>
          {data.signatureDataUrl ? (
            <img
              src={data.signatureDataUrl}
              alt="Signature"
              style={{ height: '40px', maxWidth: '140px', objectFit: 'contain', display: 'block', margin: '0 auto 4px' }}
            />
          ) : (
            <div style={{ height: '40px', borderBottom: '1.5px solid #334155', marginBottom: '4px', width: '120px' }} />
          )}
          <div style={{ fontSize: '8pt', color: '#334155', fontWeight: '600' }}>
            {data.doctorName || 'Physician'}
          </div>
          <div style={{ fontSize: '7pt', color: '#94a3b8' }}>Authorized Signature</div>
        </div>
      </div>
    </div>
  );
});

ReportPreview.displayName = 'ReportPreview';
export default ReportPreview;

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: '1px solid #ccfbf1', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(90deg, #f0fdfa, #ecfdf5)', padding: '4px 8px', borderBottom: '1px solid #ccfbf1' }}>
        <span style={{ fontSize: '7.5pt', fontWeight: '700', color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</span>
      </div>
      <div style={{ padding: '6px 8px', background: 'white' }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginBottom: '2px', fontSize: '9pt' }}>
      <span style={{ color: '#94a3b8', minWidth: '44px', fontFamily: 'sans-serif', fontSize: '8pt' }}>{label}:</span>
      <span style={{ color: '#1e293b', fontWeight: '600' }}>{value}</span>
    </div>
  );
}

function SectionBlock({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <div style={{ marginBottom: '6mm' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
        <div style={{ width: '3px', height: '14px', background: accent, borderRadius: '2px', flexShrink: 0 }} />
        <span style={{ fontSize: '9pt', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: 'sans-serif' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </div>
      <div style={{ paddingLeft: '9px', borderLeft: `1px solid ${accent}22` }}>
        {children}
      </div>
    </div>
  );
}
