import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  FlaskConical,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Download,
  Calendar,
  Layers,
  Search,
  Sparkles,
  ExternalLink,
  Award,
  Activity,
  FileCheck,
  Eye,
  X
} from 'lucide-react';

const INITIAL_SUBMISSIONS = [
  {
    id: 'sub_001',
    lotNumber: 'LOT-2026-NIL-401',
    title: 'Nilgiri Wild Forest Raw Beeswax (Batch #401)',
    category: 'Botanical Raw Actives',
    concerns: ['Barrier Repair', 'Deep Hydration'],
    status: 'APPROVED',
    price: 3400,
    mrp: 4200,
    stock: 120,
    volume: '5 kg bulk drum',
    origin: 'Nilgiri Biosphere Reserve, Tamil Nadu (2,100m ASL)',
    harvestSeason: 'Post-Monsoon Blossom 2026',
    activePurity: '99.4% Hydrocarbon & Ester Index',
    labCertId: 'COA-NIL-2026-09A',
    coaStatus: 'PASSED_CLEAN',
    ingredients: '100% pure Apis dorsata raw honeycomb cappings. Zero micro-crystalline paraffin or synthetic bleaching.',
    description: 'Harvested ethically from Nilgiri cliff ledges by tribal beekeeping cooperatives. Cold-strained and active-stabilized below 38°C.',
    submittedAt: '2026-10-21T10:00:00.000Z',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Verified 100% natural purity and cold-pressed bio-active markers. Approved for master formulation.'
  },
  {
    id: 'sub_002',
    lotNumber: 'LOT-2026-ALM-142',
    title: 'Cold-Pressed Sweet Almond Seed Oil (Lot #14)',
    category: 'Pure Carrier Actives',
    concerns: ['Dryness & Moisture Deficit', 'Fine Lines'],
    status: 'PENDING_REVIEW',
    price: 1850,
    mrp: 2200,
    stock: 45,
    volume: '2.5 Litre batch',
    origin: 'Kashmir Valley Orchard Estates, 1,600m ASL',
    harvestSeason: 'Autumn Late Harvest 2026',
    activePurity: '0.8 meq/kg Peroxide Index (Ultra Fresh)',
    labCertId: 'COA-KSM-2026-QC',
    coaStatus: 'IN_ASSAY',
    ingredients: 'Prunus amygdalus dulcis kernel single-origin cold virgin oil.',
    description: 'First hydraulic mechanical pressing at <30°C. High natural alpha-tocopherol and phytosterol retention without solvent extraction.',
    submittedAt: '2026-10-26T14:30:00.000Z',
    image: 'https://images.unsplash.com/photo-1608248597359-074478e17812?auto=format&fit=crop&w=800&q=80',
    adminNotes: null
  },
  {
    id: 'sub_003',
    lotNumber: 'LOT-2026-SAF-088',
    title: 'Kashmir Crocus Saffron Active Stigmas',
    category: 'Bio-Active Infusions',
    concerns: ['Pigmentation & Tone', 'Youth & Radiance'],
    status: 'APPROVED',
    price: 9500,
    mrp: 12000,
    stock: 25,
    volume: '50 g sealed nitrogen glass jar',
    origin: 'Pampore Plateau, Jammu & Kashmir',
    harvestSeason: 'October Purple Bloom 2026',
    activePurity: '248 UV-Vis Crocin Index (ISO 3632 Category 1)',
    labCertId: 'COA-ISO-3632-GB9',
    coaStatus: 'PASSED_CLEAN',
    ingredients: 'Grade-A Mongra Crocus sativus threads. Certified free of artificial colorants or stigma fillers.',
    description: 'Hand-culled at dawn. Vacuum-nitrogen sealed within 4 hours of harvest to preserve active safranal volatiles and antioxidant carotenoids.',
    submittedAt: '2026-10-18T09:15:00.000Z',
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Superlative crocin density confirmed via spectrophotometry. Fast-tracked for Royal Saffron line.'
  },
  {
    id: 'sub_004',
    lotNumber: 'LOT-2026-ROS-219',
    title: 'Wild Himalayan Rosemary Essential Extract',
    category: 'Concentrated Serums',
    concerns: ['Hair Fall & Scalp Health', 'Cellular Renewal'],
    status: 'REVISIONS_REQUESTED',
    price: 2400,
    mrp: 2950,
    stock: 60,
    volume: '500 ml copper flask',
    origin: 'Uttarakhand High Altitude Valley, 2,400m ASL',
    harvestSeason: 'Spring Blossom 2026',
    activePurity: '1.8-Cineole 48.2% & Rosmarinic Acid',
    labCertId: 'COA-UTK-2026-REV',
    coaStatus: 'REVISION_NEEDED',
    ingredients: 'Steam-distilled Rosmarinus officinalis leaf oil, copper alembic condensation.',
    description: 'Slow-distilled over wood embers. High terpene and cineole potency for root stimulation.',
    submittedAt: '2026-10-24T16:20:00.000Z',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    adminNotes: 'Please upload second-round GC-MS chromatogram confirming camphor index is strictly within therapeutic threshold (<12%).'
  }
];

const BATCH_QC_RECORDS = [
  {
    coaId: 'COA-NIL-2026-09A',
    lotNumber: 'LOT-2026-NIL-401',
    productTitle: 'Nilgiri Wild Forest Raw Beeswax (Batch #401)',
    testingDate: '2026-10-22',
    labTechnician: 'Dr. S. Radhakrishnan, Ph.D. (Ayush Bio-Analytics)',
    parameters: [
      { name: 'GC-MS Hydrocarbon Profile', result: '99.4% Pure', standard: '> 98.0%', status: 'PASS' },
      { name: 'Heavy Metals (Pb, As, Cd)', result: '< 0.01 ppm', standard: '< 0.5 ppm', status: 'PASS' },
      { name: 'Microbial Yeast & Mold CFU', result: '0 CFU/g', standard: '< 10 CFU/g', status: 'PASS' },
      { name: 'Paraffin Adulteration Test', result: 'Negative (Clean)', standard: 'Zero Tolerance', status: 'PASS' }
    ],
    overallConclusion: 'Complies with 100% natural botanical pharmacopeia standards. Approved for high-grade dermocosmetics.'
  },
  {
    coaId: 'COA-ISO-3632-GB9',
    lotNumber: 'LOT-2026-SAF-088',
    productTitle: 'Kashmir Crocus Saffron Active Stigmas',
    testingDate: '2026-10-19',
    labTechnician: 'Meenakshi Sundaram (Chromatography Fellow)',
    parameters: [
      { name: 'Crocin (Coloring Strength)', result: '248 Absorbance Units', standard: '> 220 (Cat 1)', status: 'PASS' },
      { name: 'Safranal (Aroma Volatiles)', result: '38 Absorbance Units', standard: '20 - 50', status: 'PASS' },
      { name: 'Picrocrocin (Flavor / Bitterness)', result: '88 Absorbance Units', standard: '> 70', status: 'PASS' },
      { name: 'Moisture & Volatile Matter', result: '8.4%', standard: '< 10.0%', status: 'PASS' }
    ],
    overallConclusion: 'Exceptional potency. Certified Grade 1 Mongra under ISO 3632 protocol.'
  },
  {
    coaId: 'COA-KSM-2026-QC',
    lotNumber: 'LOT-2026-ALM-142',
    productTitle: 'Cold-Pressed Sweet Almond Seed Oil (Lot #14)',
    testingDate: '2026-10-26',
    labTechnician: 'Ananya Deshmukh (QC Inspector)',
    parameters: [
      { name: 'Free Fatty Acids (Oleic Acid %)', result: '0.42%', standard: '< 0.8%', status: 'PASS' },
      { name: 'Peroxide Value (Rancidity)', result: '0.8 meq/kg', standard: '< 5.0 meq/kg', status: 'PASS' },
      { name: 'Hexane / Chemical Solvent Residue', result: 'Undetected', standard: 'Zero Allowed', status: 'PASS' },
      { name: 'Spectrophotometric Stability', result: 'Running in Incubator (48h)', standard: '> 95% retention', status: 'IN_PROGRESS' }
    ],
    overallConclusion: 'Primary physical indices passed. Incubator stress test concluding in 18 hours.'
  }
];

const PAYOUT_LEDGER = [
  {
    id: 'PAY-2026-OCT-091',
    lotNumber: 'LOT-2026-SAF-088',
    itemDescription: 'Kashmir Crocus Saffron Active Stigmas (25 nitrogen units)',
    grossAmount: 237500,
    tdsDeduction: 4750,
    netPayable: 232750,
    disbursedDate: '2026-10-23',
    utrNumber: 'HDFC0001928491823',
    status: 'SETTLED',
    paymentMode: 'Direct Bank RTGS'
  },
  {
    id: 'PAY-2026-OCT-044',
    lotNumber: 'LOT-2026-NIL-401',
    itemDescription: 'Nilgiri Wild Forest Raw Beeswax (120 drums bulk)',
    grossAmount: 408000,
    tdsDeduction: 8160,
    netPayable: 399840,
    disbursedDate: '2026-10-25',
    utrNumber: 'ICIC0009182746192',
    status: 'SETTLED',
    paymentMode: 'Direct Bank RTGS'
  },
  {
    id: 'PAY-2026-NOV-PEND',
    lotNumber: 'LOT-2026-ALM-142',
    itemDescription: 'Cold-Pressed Sweet Almond Seed Oil (45 batches)',
    grossAmount: 83250,
    tdsDeduction: 1665,
    netPayable: 81585,
    disbursedDate: 'Scheduled 2026-11-05',
    utrNumber: 'Pending QC Sign-off',
    status: 'ESCROW_HOLD_QC',
    paymentMode: 'Scheduled NEFT'
  }
];

export default function ProducerPortal({ onNavigateHome }) {
  const { user, token } = useAuth();
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('FORMULATIONS'); // 'FORMULATIONS', 'QUALITY_CONTROL', 'PAYOUTS'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'PENDING_REVIEW', 'APPROVED', 'REVISIONS_REQUESTED'
  const [searchQuery, setSearchQuery] = useState('');

  // Submissions state
  const [submissions, setSubmissions] = useState(() => {
    try {
      const stored = localStorage.getItem('goodbee_producer_submissions');
      return stored ? JSON.parse(stored) : INITIAL_SUBMISSIONS;
    } catch (e) {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedCoa, setSelectedCoa] = useState(null);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // New Formulation Form State
  const [form, setForm] = useState({
    title: '',
    category: 'Botanical Raw Actives',
    concerns: ['Barrier Repair'],
    lotNumber: `LOT-${new Date().getFullYear()}-BIO-${Math.floor(100 + Math.random() * 900)}`,
    origin: 'Nilgiri Biosphere Reserve, Tamil Nadu (2,100m ASL)',
    harvestSeason: 'Autumn Late Harvest 2026',
    activePurity: '98.5% Spectrophotometric Index',
    price: '',
    mrp: '',
    volume: '5 kg bulk drum',
    stock: 50,
    ingredients: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1608248597359-074478e17812?auto=format&fit=crop&w=800&q=80',
    labCertDeclaration: true
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/v1/producer/submissions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.submissions && data.submissions.length > 0) {
          // Merge API submissions with our rich seed objects
          setSubmissions(data.submissions);
          localStorage.setItem('goodbee_producer_submissions', JSON.stringify(data.submissions));
        }
      }
    } catch (err) {
      // offline fallback is already active
    }
  };

  const handleCreateSubmission = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.price) return;
    setSubmitting(true);

    const newSub = {
      id: `sub_${Date.now()}`,
      lotNumber: form.lotNumber,
      title: form.title,
      category: form.category,
      concerns: form.concerns,
      price: Number(form.price),
      mrp: Number(form.mrp || Number(form.price) * 1.3),
      volume: form.volume,
      stock: Number(form.stock),
      origin: form.origin,
      harvestSeason: form.harvestSeason,
      activePurity: form.activePurity,
      ingredients: form.ingredients,
      description: form.description,
      image: form.image,
      status: 'PENDING_REVIEW',
      coaStatus: 'IN_ASSAY',
      labCertId: `COA-QC-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      adminNotes: null
    };

    try {
      await fetch('/api/v1/producer/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newSub)
      });
    } catch (e) {}

    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    try {
      localStorage.setItem('goodbee_producer_submissions', JSON.stringify(updated));
    } catch (e) {}

    setForm({
      title: '',
      category: 'Botanical Raw Actives',
      concerns: ['Barrier Repair'],
      lotNumber: `LOT-${new Date().getFullYear()}-BIO-${Math.floor(100 + Math.random() * 900)}`,
      origin: 'Nilgiri Biosphere Reserve, Tamil Nadu (2,100m ASL)',
      harvestSeason: 'Autumn Late Harvest 2026',
      activePurity: '98.5% Spectrophotometric Index',
      price: '',
      mrp: '',
      volume: '5 kg bulk drum',
      stock: 50,
      ingredients: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1608248597359-074478e17812?auto=format&fit=crop&w=800&q=80',
      labCertDeclaration: true
    });

    setSuccessMsg(`Batch ${newSub.lotNumber} submitted for Good Bee Master Formulator QC audit.`);
    setShowSubmitModal(false);
    setSubmitting(false);
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const handleDownloadCoa = (coa) => {
    const text = `
============================================================
GOOD BEE BOTANICAL FORMULATION LABORATORY
CERTIFICATE OF BOTANICAL PURITY & SPECTROPHOTOMETRIC ASSAY
============================================================
Certificate ID  : ${coa.coaId}
Batch / Lot No  : ${coa.lotNumber}
Product Item    : ${coa.productTitle}
Date of Analysis: ${coa.testingDate}
Chief Analyst   : ${coa.labTechnician}
Accreditation   : ISO-9001:2015 Botanical Certified | Ayush GMP

ASSAY PARAMETERS & GC-MS SPECTRA:
${coa.parameters.map((p) => `- ${p.name.padEnd(35)}: ${p.result.padEnd(20)} [Std: ${p.standard}] => ${p.status}`).join('\n')}

AUDIT CONCLUSION:
${coa.overallConclusion}

VERIFIED BY: Good Bee Quality Control Board
Status: OFFICIAL AUTHENTICATED DIGITAL SPEC SHEET
============================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${coa.coaId}_Certificate_of_Analysis.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadRemittance = (payout) => {
    const text = `
============================================================
GOOD BEE BOTANICAL APOTHECARY - PRODUCER REMITTANCE ADVICE
============================================================
Voucher Reference : ${payout.id}
Settlement Status : ${payout.status}
Settlement Date   : ${payout.disbursedDate}
Payment Channel   : ${payout.paymentMode}
Bank UTR / Ref    : ${payout.utrNumber}

SUPPLY BREAKDOWN:
- Batch / Lot Ref : ${payout.lotNumber}
- Line Item       : ${payout.itemDescription}
------------------------------------------------------------
Gross Supply Amount : INR ${payout.grossAmount.toLocaleString('en-IN')}
TDS Withholding (2%): INR ${payout.tdsDeduction.toLocaleString('en-IN')}
------------------------------------------------------------
NET DISBURSED       : INR ${payout.netPayable.toLocaleString('en-IN')}
------------------------------------------------------------

Payee Account: ${user?.companyName || 'Aura Botanica Bio-Labs'}
Authorized Signatory: Good Bee Finance & Vendor Settlement Desk
============================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${payout.id}_Remittance_Advice.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesFilter =
      filterStatus === 'ALL' ||
      (filterStatus === 'PENDING_REVIEW' && (sub.status === 'PENDING_REVIEW' || sub.status === 'PENDING')) ||
      (filterStatus === 'APPROVED' && sub.status === 'APPROVED') ||
      (filterStatus === 'REVISIONS_REQUESTED' && (sub.status === 'REVISIONS_REQUESTED' || sub.status === 'REJECTED'));

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      sub.title?.toLowerCase().includes(q) ||
      sub.category?.toLowerCase().includes(q) ||
      sub.lotNumber?.toLowerCase().includes(q) ||
      sub.origin?.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // KPI Calculations
  const approvedCount = submissions.filter((s) => s.status === 'APPROVED').length;
  const pendingCount = submissions.filter((s) => s.status === 'PENDING_REVIEW' || s.status === 'PENDING').length;
  const revisionCount = submissions.filter((s) => s.status === 'REVISIONS_REQUESTED' || s.status === 'REJECTED').length;
  const totalSupplyValue = PAYOUT_LEDGER.reduce((acc, p) => acc + p.grossAmount, 0);
  const settledValue = PAYOUT_LEDGER.filter((p) => p.status === 'SETTLED').reduce((acc, p) => acc + p.netPayable, 0);
  const escrowValue = PAYOUT_LEDGER.filter((p) => p.status === 'ESCROW_HOLD_QC').reduce((acc, p) => acc + p.netPayable, 0);

  return (
    <div className="py-8 bg-brand-ivory min-h-screen text-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-gold/25 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-charcoal text-brand-gold flex items-center justify-center flex-shrink-0 shadow-md">
              <FlaskConical className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold-dark border border-brand-gold/30">
                  Botanical Producer & Extraction Studio
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> ISO 9001:2015 GMP Certified
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl text-brand-charcoal font-bold tracking-tight">
                {user?.companyName || user?.name || 'Aura Botanica Bio-Labs Pvt Ltd'}
              </h1>
              <p className="text-xs text-brand-muted flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Lab License: <strong className="text-brand-charcoal font-mono">{user?.labCertId || 'AYUSH-KA-BLR-0941'}</strong></span>
                <span>•</span>
                <span>Active Apiaries & Estates: <strong className="text-brand-charcoal">Nilgiri & Kashmir Bio-Reserves</strong></span>
                <span>•</span>
                <span>QC Passing Ratio: <strong className="text-emerald-700 font-bold">96.8% Clean Assay</strong></span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 self-stretch lg:self-auto justify-end">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="px-5 py-2.5 bg-brand-charcoal text-brand-ivory text-xs font-semibold uppercase tracking-wider rounded-full hover:bg-brand-gold-dark transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Botanical Batch</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-4 py-2 bg-brand-cream border border-brand-gold/30 rounded-full text-xs font-medium text-brand-charcoal hover:bg-brand-sand/50 transition-colors"
            >
              ← Storefront
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-2xl text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-medium">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gold/20 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Live Formulations</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
              {approvedCount} <span className="text-xs font-sans font-normal text-emerald-700">Published</span>
            </div>
            <p className="text-[11px] text-brand-muted">Vetted and sold on public storefront</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gold/20 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Pending QC Review</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-700">
              {pendingCount} <span className="text-xs font-sans font-normal text-amber-800">In Assay</span>
            </div>
            <p className="text-[11px] text-brand-muted">Quarantined in Master Lab queue</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gold/20 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Total Supply Value</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">
              ₹{(totalSupplyValue / 100000).toFixed(2)}L
            </div>
            <p className="text-[11px] text-brand-muted">Delivered botanical volume</p>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-brand-gold/20 shadow-sm space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted block">Disbursed Settlements</span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-emerald-800">
              ₹{(settledValue / 1000).toFixed(1)}k
            </div>
            <p className="text-[11px] text-brand-muted font-medium text-emerald-700">100% On-time bank RTGS</p>
          </div>
        </div>

        {/* Main Tab Navigation */}
        <div className="flex border-b border-brand-gold/25 gap-2 sm:gap-6 text-xs font-bold overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'FORMULATIONS', label: `Formulations & Batches (${submissions.length})`, icon: Layers },
            { id: 'QUALITY_CONTROL', label: `Batch QC & COA Registry (${BATCH_QC_RECORDS.length})`, icon: Award },
            { id: 'PAYOUTS', label: `Payouts & Settlement Ledger (₹${settledValue.toLocaleString('en-IN')})`, icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 pt-1 px-1 border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-brand-gold-dark text-brand-charcoal'
                    : 'border-transparent text-brand-muted hover:text-brand-charcoal'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold-dark' : 'text-brand-muted'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: FORMULATION SUBMISSIONS & BATCHES                       */}
        {/* ============================================================== */}
        {activeTab === 'FORMULATIONS' && (
          <div className="space-y-6">
            
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-brand-gold/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {[
                  { id: 'ALL', label: `All Batches (${submissions.length})` },
                  { id: 'PENDING_REVIEW', label: `Quarantined / In Assay (${pendingCount})`, badge: pendingCount > 0 },
                  { id: 'APPROVED', label: `Approved & Live (${approvedCount})` },
                  { id: 'REVISIONS_REQUESTED', label: `Revisions (${revisionCount})`, badge: revisionCount > 0 }
                ].map((chip) => (
                  <button
                    key={chip.id}
                    onClick={() => setFilterStatus(chip.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                      filterStatus === chip.id
                        ? 'bg-brand-charcoal text-brand-ivory'
                        : 'bg-brand-cream/60 hover:bg-brand-cream text-brand-charcoal border border-brand-gold/20'
                    }`}
                  >
                    <span>{chip.label}</span>
                    {chip.badge && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by formulation, lot #, origin..."
                  className="w-full pl-9 pr-4 py-2 bg-brand-cream/40 border border-brand-gold/30 rounded-xl text-xs focus:outline-none focus:border-brand-gold"
                />
              </div>
            </div>

            {/* Protocol Notice Banner */}
            <div className="bg-brand-sand/30 border border-brand-gold/30 rounded-2xl p-4 flex items-start gap-3.5 text-xs text-brand-charcoal">
              <ShieldCheck className="w-5 h-5 text-brand-gold-dark flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-brand-charcoal block">
                  Good Bee Botanical Quarantined Review Standard
                </span>
                <p className="text-brand-muted leading-relaxed">
                  Every submitted botanical harvest lot undergoes spectrophotometric purity checks, solvent residue testing, and microbiological culture inspection. Only lots with authenticated active markers are cleared for public storefront release.
                </p>
              </div>
            </div>

            {/* Formulations Grid */}
            {filteredSubmissions.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-brand-gold/20 p-8 space-y-3">
                <FlaskConical className="w-10 h-10 text-brand-muted mx-auto opacity-40" />
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">No Formulations Found</h3>
                <p className="text-xs text-brand-muted max-w-md mx-auto">
                  No submissions match the current status filter. Click "Submit Botanical Batch" to enter a new active harvest lot into the QC review pipeline.
                </p>
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="px-5 py-2 bg-brand-charcoal text-brand-ivory text-xs font-semibold rounded-full hover:bg-brand-gold-dark transition-colors inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Submit Batch
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions.map((sub) => {
                  const isApproved = sub.status === 'APPROVED';
                  const isPending = sub.status === 'PENDING_REVIEW' || sub.status === 'PENDING';
                  const isRevision = sub.status === 'REVISIONS_REQUESTED' || sub.status === 'REJECTED';

                  return (
                    <div
                      key={sub.id}
                      className="bg-white rounded-3xl border border-brand-gold/25 p-5 space-y-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="space-y-3">
                        {/* Header tags */}
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-gold/20">
                            {sub.category}
                          </span>

                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle className="w-3 h-3" /> Live in Store
                            </span>
                          )}
                          {isPending && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                              <Clock className="w-3 h-3" /> Under QC Audit
                            </span>
                          )}
                          {isRevision && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                              <AlertCircle className="w-3 h-3" /> Revision Needed
                            </span>
                          )}
                        </div>

                        {/* Title & Image */}
                        <div className="flex gap-3">
                          <img
                            src={sub.image || 'https://images.unsplash.com/photo-1608248597359-074478e17812?auto=format&fit=crop&w=400&q=80'}
                            alt={sub.title}
                            className="w-18 h-18 rounded-2xl object-cover bg-brand-sand/30 border border-brand-gold/20 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] font-bold text-brand-muted block">
                              {sub.lotNumber || 'LOT-2026-UNASSIGNED'}
                            </span>
                            <h4 className="font-serif text-base font-bold text-brand-charcoal leading-snug line-clamp-2">
                              {sub.title}
                            </h4>
                            <p className="text-xs font-bold text-brand-charcoal">
                              ₹{sub.price} <span className="text-[10px] text-brand-muted font-normal">(MRP ₹{sub.mrp})</span>
                            </p>
                          </div>
                        </div>

                        {/* Purity & Origin Specs */}
                        <div className="bg-brand-ivory rounded-2xl p-3 border border-brand-gold/15 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-brand-muted uppercase">Purity Assay</span>
                            <span className="font-mono text-[11px] font-bold text-emerald-800">
                              {sub.activePurity || '98.5% Spectrophotometric'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-brand-muted uppercase">Origin</span>
                            <span className="text-[11px] text-brand-charcoal font-medium truncate max-w-[180px]">
                              {sub.origin || 'Nilgiri Biosphere'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-brand-muted uppercase">Harvest / Lot</span>
                            <span className="text-[11px] text-brand-muted">
                              {sub.harvestSeason || 'Late Harvest 2026'}
                            </span>
                          </div>
                        </div>

                        {/* Ingredients */}
                        <div className="text-[11px] text-brand-charcoal/80 line-clamp-2 italic">
                          "{sub.ingredients}"
                        </div>

                        {/* Admin Feedback Box */}
                        {sub.adminNotes && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 text-amber-800">
                              <AlertCircle className="w-3.5 h-3.5" /> Good Bee Quality Review Feedback:
                            </span>
                            <p className="text-[11px] leading-relaxed">{sub.adminNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="pt-3 border-t border-brand-gold/15 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedSub(sub)}
                          className="px-3 py-1.5 bg-brand-cream hover:bg-brand-sand/50 rounded-lg text-[11px] font-bold text-brand-charcoal flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> Spec Sheet
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-brand-muted font-mono">
                            {sub.volume || 'Bulk Batch'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: BATCH QUALITY CONTROL (QC) & COA REGISTRY               */}
        {/* ============================================================== */}
        {activeTab === 'QUALITY_CONTROL' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-brand-gold/25 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-brand-charcoal flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-gold-dark" />
                  <span>Certificate of Analysis (COA) Registry</span>
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Independent GC-MS chromatography profiles, active marker verification, and heavy-metal assays for every Good Bee batch.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {BATCH_QC_RECORDS.map((coa) => (
                  <div
                    key={coa.coaId}
                    className="bg-brand-ivory rounded-2xl border border-brand-gold/25 p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold bg-brand-charcoal text-brand-gold px-2 py-0.5 rounded">
                          {coa.coaId}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> VERIFIED
                        </span>
                      </div>

                      <div>
                        <h4 className="font-serif text-base font-bold text-brand-charcoal">
                          {coa.productTitle}
                        </h4>
                        <p className="text-xs font-mono text-brand-muted">
                          Batch: {coa.lotNumber} • Tested: {coa.testingDate}
                        </p>
                      </div>

                      {/* Lab Specs table */}
                      <div className="space-y-2 pt-2 border-t border-brand-gold/15 text-xs">
                        {coa.parameters.map((param, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] pb-1 border-b border-brand-gold/10">
                            <span className="text-brand-charcoal/80">{param.name}</span>
                            <span className="font-mono font-bold text-brand-charcoal">{param.result}</span>
                          </div>
                        ))}
                      </div>

                      <div className="p-2.5 rounded-xl bg-white border border-brand-gold/15 text-[11px] text-brand-muted leading-relaxed">
                        <strong className="text-brand-charcoal block mb-0.5">Assay Conclusion:</strong>
                        {coa.overallConclusion}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-brand-gold/20 flex items-center justify-between">
                      <span className="text-[10px] text-brand-muted truncate max-w-[140px]">
                        {coa.labTechnician}
                      </span>
                      <button
                        onClick={() => handleDownloadCoa(coa)}
                        className="px-3 py-1.5 bg-brand-charcoal hover:bg-brand-gold-dark text-brand-ivory rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download COA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: VENDOR PAYOUTS & SETTLEMENT LEDGER                      */}
        {/* ============================================================== */}
        {activeTab === 'PAYOUTS' && (
          <div className="space-y-6">
            
            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-brand-gold/25 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-muted">Gross Botanical Billings</span>
                <div className="font-serif text-2xl font-bold text-brand-charcoal">
                  ₹{totalSupplyValue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-brand-muted">Cumulative certified deliveries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-300 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Disbursed to Bank</span>
                <div className="font-serif text-2xl font-bold text-emerald-800">
                  ₹{settledValue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-emerald-700">Net credited via RTGS/NEFT</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-sm space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Held in QC Escrow</span>
                <div className="font-serif text-2xl font-bold text-amber-800">
                  ₹{escrowValue.toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-amber-700">Auto-cleared once assay reaches 100%</p>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-3xl border border-brand-gold/25 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-brand-gold/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-brand-charcoal">
                    Botanical Harvest Remittance Ledger
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Official financial settlement vouchers and statutory TDS tax receipts.
                  </p>
                </div>
                <div className="text-xs font-mono text-brand-muted">
                  Settlement Cycle: <strong className="text-brand-charcoal">Bi-Weekly Net-10</strong>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-cream text-brand-charcoal font-semibold uppercase text-[10px] tracking-wider border-b border-brand-gold/20">
                    <tr>
                      <th className="p-4">Voucher #</th>
                      <th className="p-4">Batch Lot Reference</th>
                      <th className="p-4">Gross Supply</th>
                      <th className="p-4">TDS (2%)</th>
                      <th className="p-4">Net Payout</th>
                      <th className="p-4">Bank Ref / UTR</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Advice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-gold/15">
                    {PAYOUT_LEDGER.map((pay) => {
                      const isSettled = pay.status === 'SETTLED';

                      return (
                        <tr key={pay.id} className="hover:bg-brand-ivory/50 transition-colors">
                          <td className="p-4 font-mono font-bold text-brand-gold-dark">{pay.id}</td>
                          <td className="p-4">
                            <span className="font-mono text-brand-charcoal block font-semibold">{pay.lotNumber}</span>
                            <span className="text-[11px] text-brand-muted truncate max-w-[200px] block">{pay.itemDescription}</span>
                          </td>
                          <td className="p-4 font-semibold text-brand-charcoal">
                            ₹{pay.grossAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 text-brand-muted">
                            ₹{pay.tdsDeduction.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 font-bold text-brand-charcoal text-sm">
                            ₹{pay.netPayable.toLocaleString('en-IN')}
                          </td>
                          <td className="p-4 font-mono text-[11px] text-brand-muted">
                            {pay.utrNumber}
                          </td>
                          <td className="p-4">
                            {isSettled ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Disbursed
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                QC Escrow Hold
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleDownloadRemittance(pay)}
                              className="px-3 py-1.5 bg-brand-cream hover:bg-brand-sand/50 text-brand-charcoal rounded-lg font-semibold text-[11px] border border-brand-gold/25 inline-flex items-center gap-1 transition-colors"
                            >
                              <Download className="w-3 h-3" /> Slip
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL: SUBMIT NEW BOTANICAL FORMULATION                        */}
      {/* ============================================================== */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold-dark block">
                  Good Bee Formulation Quarantined Queue
                </span>
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal">
                  Submit New Botanical Batch
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-brand-muted hover:text-brand-charcoal p-1.5 rounded-lg hover:bg-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmission} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="sm:col-span-2">
                  <label className="block mb-1 font-bold text-brand-charcoal">Formulation / Active Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-medium"
                    placeholder="e.g. Cold-Pressed Virgin Sea Buckthorn Fruit Oil"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-medium"
                  >
                    <option value="Botanical Raw Actives">Botanical Raw Actives</option>
                    <option value="Pure Carrier Actives">Pure Carrier Actives</option>
                    <option value="Bio-Active Infusions">Bio-Active Infusions</option>
                    <option value="Concentrated Serums">Concentrated Serums</option>
                    <option value="Cold Processed Soaps">Cold Processed Soaps</option>
                    <option value="Therapeutic Body Care">Therapeutic Body Care</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Batch / Lot Number *</label>
                  <input
                    type="text"
                    required
                    value={form.lotNumber}
                    onChange={(e) => setForm({ ...form, lotNumber: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Origin & Elevation *</label>
                  <input
                    type="text"
                    required
                    value={form.origin}
                    onChange={(e) => setForm({ ...form, origin: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="e.g. Nilgiri Biosphere, Tamil Nadu (2,100m ASL)"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Harvest Season *</label>
                  <input
                    type="text"
                    required
                    value={form.harvestSeason}
                    onChange={(e) => setForm({ ...form, harvestSeason: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="e.g. Autumn Late Harvest 2026"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Supply Unit Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-bold"
                    placeholder="2450"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Target Retail MRP (₹)</label>
                  <input
                    type="number"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="3200"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Batch Units / Stock *</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal font-bold"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-bold text-brand-charcoal">Volume / Container Specs</label>
                  <input
                    type="text"
                    value={form.volume}
                    onChange={(e) => setForm({ ...form, volume: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="e.g. 5 kg nitrogen-sealed drum"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-bold text-brand-charcoal">
                    Full Botanical Actives & INCI Disclosure *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={form.ingredients}
                    onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="100% pure cold-milled extract. Complete botanical name, plant part used, zero synthetic additives..."
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block mb-1 font-bold text-brand-charcoal">
                    Extraction Method & Research Specs
                  </label>
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 bg-white border border-brand-gold/30 rounded-xl focus:outline-none focus:border-brand-gold text-brand-charcoal"
                    placeholder="Extraction temperature (<32°C), solvent-free mechanical pressing, active stabilization notes..."
                  />
                </div>

                <div className="sm:col-span-2 bg-brand-cream/60 p-3.5 rounded-2xl border border-brand-gold/20 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="labCertDeclaration"
                    checked={form.labCertDeclaration}
                    onChange={(e) => setForm({ ...form, labCertDeclaration: e.target.checked })}
                    className="mt-0.5 accent-brand-charcoal rounded cursor-pointer"
                    required
                  />
                  <label htmlFor="labCertDeclaration" className="text-[11px] text-brand-charcoal/80 cursor-pointer">
                    <strong>Laboratory Purity Assurance:</strong> I certify that this harvest lot conforms strictly to Good Bee 100% natural pharmacopeia standards, with zero synthetic fillers, mineral oils, or artificial stabilizing agents.
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-gold/20 flex items-center justify-end gap-3">
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
                  className="px-6 py-2.5 bg-brand-charcoal text-brand-ivory rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-brand-gold-dark transition-colors shadow-md flex items-center gap-2"
                >
                  {submitting ? 'Submitting to Lab Queue...' : 'Submit Batch for QC Audit'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: BATCH SPEC SHEET & QC DETAILS                           */}
      {/* ============================================================== */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-charcoal/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-brand-ivory rounded-3xl border border-brand-gold/40 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 animate-scaleUp">
            
            <div className="flex items-center justify-between pb-3 border-b border-brand-gold/20">
              <div>
                <span className="font-mono text-[10px] font-bold text-brand-gold-dark uppercase block">
                  {selectedSub.lotNumber || 'BATCH SPEC'}
                </span>
                <h3 className="font-serif text-xl font-bold text-brand-charcoal">
                  {selectedSub.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="text-brand-muted hover:text-brand-charcoal p-1.5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex gap-4 items-center">
                <img
                  src={selectedSub.image || 'https://images.unsplash.com/photo-1608248597359-074478e17812?auto=format&fit=crop&w=400&q=80'}
                  alt={selectedSub.title}
                  className="w-20 h-20 rounded-2xl object-cover bg-brand-cream border border-brand-gold/25"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-cream border border-brand-gold/20 text-brand-charcoal">
                    {selectedSub.category}
                  </span>
                  <div className="font-mono text-base font-bold text-brand-charcoal mt-1">
                    Supply Price: ₹{selectedSub.price} <span className="text-xs text-brand-muted font-normal">(MRP ₹{selectedSub.mrp})</span>
                  </div>
                  <p className="text-brand-muted text-[11px]">Units: {selectedSub.stock} • Container: {selectedSub.volume}</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-brand-gold/20 space-y-2.5">
                <div className="flex justify-between border-b border-brand-gold/10 pb-1.5">
                  <span className="text-brand-muted font-medium">Origin Location</span>
                  <span className="font-semibold text-brand-charcoal">{selectedSub.origin || 'Nilgiri Biosphere'}</span>
                </div>
                <div className="flex justify-between border-b border-brand-gold/10 pb-1.5">
                  <span className="text-brand-muted font-medium">Harvest Period</span>
                  <span className="font-semibold text-brand-charcoal">{selectedSub.harvestSeason || 'Late Autumn 2026'}</span>
                </div>
                <div className="flex justify-between border-b border-brand-gold/10 pb-1.5">
                  <span className="text-brand-muted font-medium">Purity Specification</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedSub.activePurity || '98.5% Spectrophotometric'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted font-medium">Lab Certificate Ref</span>
                  <span className="font-mono text-brand-charcoal">{selectedSub.labCertId || 'COA-QC-GB'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-bold text-brand-charcoal block">Botanical Composition:</span>
                <p className="text-brand-charcoal/80 bg-brand-cream/50 p-3 rounded-xl border border-brand-gold/20 leading-relaxed text-[11px]">
                  {selectedSub.ingredients}
                </p>
              </div>

              {selectedSub.description && (
                <div className="space-y-1">
                  <span className="font-bold text-brand-charcoal block">Research & Extraction Notes:</span>
                  <p className="text-brand-charcoal/80 leading-relaxed text-[11px]">
                    {selectedSub.description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-brand-gold/20 flex justify-end">
              <button
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 bg-brand-charcoal text-brand-ivory rounded-full text-xs font-semibold hover:bg-brand-gold-dark transition-colors"
              >
                Close Spec Sheet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
