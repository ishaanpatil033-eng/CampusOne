import React, { useState, useMemo } from 'react'
import { Printer, FileText, Settings2, Clock, CheckCircle } from 'lucide-react'
import { submitPrintJob } from '../../services/printQService'
import { usePrintQOrders } from '../../hooks/usePrintQ'

const INIT_FORM = {
  fileUrl: '', fileName: '', pageCount: 1,
  isColor: false, spiralBinding: false, lamination: false,
  pickupTimeSlot: '10:00 AM - 10:30 AM'
}

const TIME_SLOTS = [
  '09:00 AM - 09:30 AM', '10:00 AM - 10:30 AM', '11:00 AM - 11:30 AM',
  '12:00 PM - 12:30 PM', '02:00 PM - 02:30 PM', '03:00 PM - 03:30 PM',
  '04:00 PM - 04:30 PM'
]

export default function PrintQ() {
  const { orders, loading: ordersLoading, refetch } = usePrintQOrders()
  const [form, setForm] = useState(INIT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const price = useMemo(() => {
    let cost = form.pageCount * (form.isColor ? 10 : 2)
    if (form.spiralBinding) cost += 50
    if (form.lamination) cost += 20
    return cost
  }, [form])

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fileUrl || !form.fileName) {
      setError('Please provide file URL and name.')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await submitPrintJob(form)
      setForm(INIT_FORM)
      refetch()
      alert('Print job submitted successfully!')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit print job.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in flex flex-col lg:flex-row gap-6">
      
      {/* Left: Print Form */}
      <div className="flex-1 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-50 rounded-2xl">
            <Printer className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">PrintQ</h1>
            <p className="text-slate-400 text-sm">Smart stationary & print queue.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>}
          
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" /> Document Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">File Name *</label>
                <input name="fileName" value={form.fileName} onChange={handleChange} className="form-input" placeholder="project_report.pdf" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">File URL *</label>
                <input name="fileUrl" value={form.fileUrl} onChange={handleChange} className="form-input" placeholder="Google Drive/Firebase link" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Total Pages</label>
                <input name="pageCount" type="number" min={1} value={form.pageCount} onChange={handleChange} className="form-input" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary-500" /> Print Settings
            </h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" name="isColor" checked={form.isColor} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-700">Color Print (₹10/pg)</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" name="spiralBinding" checked={form.spiralBinding} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-700">Spiral Binding (+₹50)</span>
              </label>
              <label className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" name="lamination" checked={form.lamination} onChange={handleChange} className="w-4 h-4 text-primary-600 rounded border-slate-300" />
                <span className="text-sm font-medium text-slate-700">Lamination (+₹20)</span>
              </label>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary-500" /> Pickup Slot
            </h2>
            <select name="pickupTimeSlot" value={form.pickupTimeSlot} onChange={handleChange} className="form-input">
              {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-400">Estimated Cost</p>
              <p className="text-2xl font-bold text-slate-900">₹{price}</p>
            </div>
            <button type="submit" disabled={submitting}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 flex items-center gap-2">
              {submitting ? 'Submitting...' : 'Confirm & Pay'}
            </button>
          </div>
        </form>
      </div>

      {/* Right: Job Status */}
      <div className="w-full lg:w-80 xl:w-96">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">My Print Jobs</h2>
        {ordersLoading ? (
          <p className="text-sm text-slate-400">Loading...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-slate-100">
            <Printer className="w-10 h-10 text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">No print jobs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                {order.status === 'READY' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm text-slate-800 line-clamp-1">{order.fileName}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ml-2 ${
                    order.status === 'READY' ? 'bg-emerald-100 text-emerald-700' :
                    order.status === 'PREPARING' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'COMPLETED' ? 'bg-slate-100 text-slate-500' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 mb-2">
                  <span>{order.pageCount} pg</span>
                  <span>{order.isColor ? 'Color' : 'B&W'}</span>
                  {order.spiralBinding && <span>Spiral</span>}
                  {order.lamination && <span>Lam.</span>}
                </div>
                <div className="text-xs font-medium text-slate-700 bg-slate-50 py-1.5 px-2 rounded-lg flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Pickup: {order.pickupTimeSlot}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
