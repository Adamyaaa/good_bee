import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FlaskConical, Plus, CheckCircle, Clock, XCircle, FileText, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function ProducerPortal({ onNavigateHome }) {
  const { user, token, logout } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PENDING', 'APPROVED', 'REJECTED'

  const [form, setForm] = useState({
    title: '',
    category: 'Concentrated Serums',
    concerns: ['Barrier Repair'],
    price: '',
    mrp: '',
    volume: '30 ml',
    stock: 50,
    ingredients: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/producer/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmission = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');

    try {
      const res = await fetch('/api/v1/producer/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');

      setSuccessMsg(data.message);
      setShowSubmitModal(false);
      fetchSubmissions();

      // Reset form
      setForm({
        title: '',
        category: 'Concentrated Serums',
        concerns: ['Barrier Repair'],
        price: '',
        mrp: '',
        volume: '30 ml',
        stock: 50,
        ingredients: '',
        description: '',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = submissions.filter((s) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return s.status === 'PENDING_REVIEW';
    if (activeTab === 'APPROVED') return s.status === 'APPROVED';
    if (activeTab === 'REJECTED') return s.status === 'REJECTED';
    return true;
  });

  return (
    <div className="py-10 bg-brand-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-brand-gold/25">
          <div className="flex items-center gap-3">
            <span className="p-3 rounded-2xl bg-brand-charcoal text-brand-gold">
              <FlaskConical className="w-6 h-6" />
            </span>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-brand-gold-dark block">
                Producer & Laboratory Partner Studio
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-semibold">
                {user ? user.companyName || user.name : 'Artisanal Partner'}
              </h1>
              <p className="text-xs text-brand-muted">
                Lab Accreditation: {user ? user.labCertId || 'LAB-ISO-9001-GB' : 'Pending verification'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Submit New Formulation</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-brand-cream border border-brand-gold/30 rounded-full text-xs font-medium text-brand-charcoal hover:bg-brand-sand/50"
            >
              Storefront
            </button>
          </div>
        </div>

        {/* Workflow Info Alert */}
        <div className="bg-brand-sand/40 border border-brand-gold/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-brand-charcoal">
          <ShieldCheck className="w-5 h-5 text-brand-gold-dark flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-brand-charcoal block">Quarantined Formulation Submission Protocol</span>
            <p className="text-brand-muted leading-relaxed">
              Every formulation submitted by laboratory and producer partners is placed into the <span className="font-semibold text-amber-900">Pending Review</span> queue. Submissions remain strictly hidden from the public storefront until Good Bee Research & Quality Admin approval.
            </p>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-brand-gold/20 gap-4 text-xs font-semibold">
          {[
            { id: 'ALL', label: `All Submissions (${submissions.length})` },
            { id: 'PENDING', label: `Pending Review (${submissions.filter((s) => s.status === 'PENDING_REVIEW').length})` },
            { id: 'APPROVED', label: `Approved & Published (${submissions.filter((s) => s.status === 'APPROVED').length})` },
            { id: 'REJECTED', label: `Revisions Requested (${submissions.filter((s) => s.status === 'REJECTED').length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2.5 transition-colors relative ${
                activeTab === tab.id ? 'text-brand-charcoal border-b-2 border-brand-gold' : 'text-brand-muted hover:text-brand-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-brand-muted">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-brand-cream/40 rounded-2xl border border-brand-gold/20 p-8 space-y-3">
            <p className="font-serif text-lg text-brand-charcoal">No submissions in this filter category.</p>
            <p className="text-xs text-brand-muted">
              Submit your formulation specs and batch testing sheets to enter the Quality Review pipeline.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sub) => {
              const isApproved = sub.status === 'APPROVED';
              const isPending = sub.status === 'PENDING_REVIEW';
              const isRejected = sub.status === 'REJECTED';

              return (
                <div
                  key={sub.id}
                  className="bg-brand-cream/40 rounded-2xl border border-brand-gold/30 p-5 space-y-4 flex flex-col justify-between shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark px-2 py-0.5 rounded bg-brand-ivory border border-brand-gold/20">
                        {sub.category}
                      </span>

                      {/* Status Badges */}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle className="w-3 h-3" /> Approved & Live
                        </span>
                      )}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                          <Clock className="w-3 h-3" /> Under Review
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                          <XCircle className="w-3 h-3" /> Revision Requested
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-16 h-16 rounded-xl object-cover bg-brand-sand/40 border border-brand-gold/20 flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-serif text-base font-semibold text-brand-charcoal leading-snug">
                          {sub.title}
                        </h4>
                        <p className="text-xs font-bold text-brand-charcoal mt-1">
                          ₹{sub.price} <span className="text-[11px] text-brand-muted font-normal">(MRP: ₹{sub.mrp})</span>
                        </p>
                        <p className="text-[10px] text-brand-muted">Volume: {sub.volume} • Stock: {sub.stock}</p>
                      </div>
                    </div>

                    <div className="text-xs text-brand-charcoal/80 space-y-1 bg-brand-ivory/60 p-3 rounded-xl border border-brand-gold/15">
                      <span className="text-[10px] font-bold text-brand-gold-dark block uppercase">Active Botanical Extract</span>
                      <p className="line-clamp-2 text-[11px]">{sub.ingredients}</p>
                    </div>

                    {/* Admin Feedback Box if rejected */}
                    {sub.adminNotes && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-amber-800">
                          <AlertCircle className="w-3.5 h-3.5" /> Good Bee Quality Review Feedback:
                        </span>
                        <p className="text-[11px] leading-relaxed">{sub.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-brand-gold/20 text-[11px] text-brand-muted flex items-center justify-between">
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    <span className="font-mono text-[10px]">ID: {sub.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Modal: New Formulation Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-2xl max-w-2xl w-full p-6 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
              <div>
                <h3 className="font-serif text-2xl font-semibold text-brand-charcoal">
                  Submit Formulation for Quality Audit
                </h3>
                <p className="text-xs text-brand-muted">
                  Products are vetted for active stabilization and 100% natural purity before public release.
                </p>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-brand-muted hover:text-brand-charcoal p-1.5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmission} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">Formulation Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="e.g. Bio-Peptide Sea Kelp Tightening Essence"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                  >
                    <option value="Concentrated Serums">Concentrated Serums</option>
                    <option value="Face Care">Face Care</option>
                    <option value="Cleansers">Cleansers</option>
                    <option value="Body Care">Body Care</option>
                    <option value="Restorative Elixirs">Restorative Elixirs</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Volume / Weight</label>
                  <input
                    type="text"
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="30 ml / 50 g"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Target Retail Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="1890"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-medium text-brand-charcoal">Initial Batch Units (Stock)</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="50"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">
                    Full Botanical Actives & INCI Disclosure
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Cold-milled propolis, plant squalane, bakuchiol, etc."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-medium text-brand-charcoal">
                    Formulation & Research Description
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 bg-brand-cream border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Stabilization details, extraction temperatures, pH tests..."
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-brand-gold/20 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2.5 rounded-full border border-brand-gold/30 text-brand-charcoal hover:bg-brand-cream text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold-dark transition-colors shadow-luxury flex items-center gap-2"
                >
                  {submitting ? 'Submitting to Queue...' : 'Submit to Admin Review'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
