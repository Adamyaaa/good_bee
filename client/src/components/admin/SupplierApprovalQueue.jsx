import React, { useState } from 'react';
import {
  FlaskConical,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Eye,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Layers,
  X,
  ExternalLink
} from 'lucide-react';

export default function SupplierApprovalQueue({
  submissions = [],
  onDecideSubmission,
  token
}) {
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PENDING_REVIEW', 'APPROVED', 'REVISIONS_REQUESTED', 'REJECTED'
  const [selectedSub, setSelectedSub] = useState(null);
  const [revisionModalSub, setRevisionModalSub] = useState(null);
  const [revisionNote, setRevisionNote] = useState('');
  const [actionNotice, setActionNotice] = useState('');

  const pendingCount = submissions.filter(
    (s) => s.status === 'PENDING_REVIEW' || s.status === 'PENDING'
  ).length;

  const filtered = submissions.filter((s) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'PENDING_REVIEW') return s.status === 'PENDING_REVIEW' || s.status === 'PENDING';
    return s.status === filterStatus;
  });

  const handleApprove = (sub) => {
    onDecideSubmission(sub.id, 'APPROVE', 'Verified 100% natural purity and active-stabilization batch specs. Approved for public storefront.');
    setActionNotice(`Formulation "${sub.title}" approved and immediately published to the storefront catalog!`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleReject = (sub) => {
    const reason = window.prompt(`Provide rejection reason for "${sub.title}":`, 'Does not meet 100% natural botanical purity standard.');
    if (reason) {
      onDecideSubmission(sub.id, 'REJECT', reason);
      setActionNotice(`Submission "${sub.title}" rejected with audit note.`);
      setTimeout(() => setActionNotice(''), 4000);
    }
  };

  const handleOpenRevision = (sub) => {
    setRevisionModalSub(sub);
    setRevisionNote(sub.adminNotes || 'Please provide higher-resolution multi-angle photos (hero, ingredients, and texture swatch) along with GC-MS batch purity certificate.');
  };

  const handleSendRevision = (e) => {
    e.preventDefault();
    if (!revisionModalSub || !revisionNote.trim()) return;

    onDecideSubmission(revisionModalSub.id, 'REVISION', revisionNote.trim());
    setRevisionModalSub(null);
    setActionNotice(`Revision requested from producer for "${revisionModalSub.title}".`);
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header telemetry */}
      <div className="bg-slate-950 p-5 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-400">
              <FlaskConical className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                Quarantined Supplier Product Proposals
              </h3>
              <p className="text-xs text-slate-400">
                Incoming producer formulations are strictly locked from the public storefront until verified
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'ALL', label: `All (${submissions.length})` },
            { id: 'PENDING_REVIEW', label: `Pending Review (${pendingCount})`, badge: pendingCount > 0 },
            { id: 'APPROVED', label: `Approved (${submissions.filter((s) => s.status === 'APPROVED').length})` },
            { id: 'REVISIONS_REQUESTED', label: 'Revisions' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
            </button>
          ))}
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 bg-emerald-950 border border-emerald-500/50 text-emerald-200 rounded-2xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((sub) => {
          const isPending = sub.status === 'PENDING_REVIEW' || sub.status === 'PENDING';
          const isApproved = sub.status === 'APPROVED';
          const isRevision = sub.status === 'REVISIONS_REQUESTED';
          const isRejected = sub.status === 'REJECTED';

          const imagesList = sub.gallery && sub.gallery.length > 0 ? sub.gallery : [sub.image];

          return (
            <div
              key={sub.id}
              className={`rounded-3xl border p-5 sm:p-6 space-y-4 transition-all flex flex-col justify-between ${
                isPending
                  ? 'bg-slate-950/90 border-amber-500/40 shadow-xl'
                  : isApproved
                  ? 'bg-slate-950/60 border-emerald-500/30'
                  : 'bg-slate-950/40 border-slate-800'
              }`}
            >
              
              <div className="space-y-4">
                
                {/* Card Top: Producer & Status */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                      {sub.producerName || 'Aura Botanica Bio-Labs'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Cert ID: <span className="font-mono text-slate-300">{sub.labCertId || 'LAB-ISO-9001-GB'}</span>
                    </span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1.5 ${
                    isPending
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40 animate-pulse'
                      : isApproved
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      : isRevision
                      ? 'bg-purple-950 text-purple-300 border-purple-500/40'
                      : 'bg-rose-950 text-rose-300 border-rose-500/40'
                  }`}>
                    {isPending && <Clock className="w-3 h-3" />}
                    {isApproved && <CheckCircle className="w-3 h-3" />}
                    {isRevision && <AlertTriangle className="w-3 h-3" />}
                    <span>{sub.status.replace(/_/g, ' ')}</span>
                  </span>
                </div>

                {/* Main Product Info & Multi-Image Gallery Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                  
                  {/* Image thumbnails (Col 4) */}
                  <div className="sm:col-span-4 space-y-2">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 aspect-square">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <span className="absolute bottom-2 left-2 text-[9px] font-mono bg-slate-950/80 px-1.5 py-0.5 rounded text-slate-300">
                        {imagesList.length} Photos
                      </span>
                    </div>

                    {imagesList.length > 1 && (
                      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                        {imagesList.slice(0, 4).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt="Preview"
                            className="w-8 h-8 rounded-lg object-cover border border-slate-800 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => setSelectedSub(sub)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Details (Col 8) */}
                  <div className="sm:col-span-8 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 text-[10px] uppercase font-bold tracking-wider">
                        {sub.category}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sub.volume || '50 ml'}</span>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-white leading-snug">
                      {sub.title}
                    </h4>

                    {/* Pricing pill */}
                    <div className="flex items-center gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Lab Cost</span>
                        <span className="font-bold text-amber-400 font-mono">₹{sub.price}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Storefront MSRP</span>
                        <span className="font-bold text-slate-300 font-mono">₹{sub.mrp || Math.round(sub.price * 1.25)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Batch Stock</span>
                        <span className="font-bold text-slate-300 font-mono">{sub.stock || 50} units</span>
                      </div>
                    </div>

                    {/* Disclosed botanical ingredients */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 line-clamp-2">
                      <span className="text-amber-400 font-bold block text-[10px] uppercase">Active Botanicals:</span>
                      {typeof sub.ingredients === 'string' ? sub.ingredients : (sub.ingredients || []).join(', ')}
                    </div>
                  </div>

                </div>

                {/* Batch doc & Admin notes */}
                <div className="space-y-1.5 text-xs">
                  {sub.batchDoc && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{sub.batchDoc}</span>
                    </div>
                  )}

                  {sub.adminNotes && (
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
                      <span className="font-bold text-purple-300 block text-[10px] uppercase">Admin Feedback Log:</span>
                      <p className="italic">"{sub.adminNotes}"</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedSub(sub)}
                  className="px-3 py-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-xl text-xs flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect Proposal</span>
                </button>

                {isPending && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(sub)}
                      className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenRevision(sub)}
                      className="px-3 py-1.5 bg-purple-950/60 hover:bg-purple-900 text-purple-200 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Request Revisions
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(sub)}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-colors shadow-md flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                )}

                {isApproved && (
                  <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3.5 h-3.5" /> Live in Catalog
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Inspect Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto text-xs">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">
                  Formulation Inspection & Verification
                </span>
                <h3 className="font-serif text-xl font-bold text-white">{selectedSub.title}</h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Full */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Submitted 4–5 Resolution Asset Pack:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(selectedSub.gallery && selectedSub.gallery.length > 0 ? selectedSub.gallery : [selectedSub.image]).map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                    <img src={img} alt="Pack" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Description & Ritual */}
            <div className="space-y-2 text-slate-300 leading-relaxed">
              <p>{selectedSub.description}</p>
              {selectedSub.manufacturingProcess && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-amber-400 font-bold uppercase text-[10px] block">Manufacturing & Extraction Method:</span>
                  <p className="mt-0.5">{selectedSub.manufacturingProcess}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Revision Request Modal */}
      {revisionModalSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-purple-400 font-bold">
                  Quality Audit Feedback
                </span>
                <h3 className="font-serif text-lg font-bold text-white">
                  Request Revisions from {revisionModalSub.producerName}
                </h3>
              </div>
              <button
                onClick={() => setRevisionModalSub(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-full bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendRevision} className="space-y-3">
              <div>
                <label className="block mb-1 text-slate-300 font-medium">
                  Revision Instructions for Producer Lab:
                </label>
                <textarea
                  rows={4}
                  required
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Specify required documentation, 4K image re-shoots, or ingredient adjustments..."
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-white leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRevisionModalSub(null)}
                  className="px-4 py-2 bg-slate-800 text-white rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl"
                >
                  Send Revision Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
