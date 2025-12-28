import { useRef, useState } from 'react'
import Modal from './Modal'
import { CloudUpload } from 'lucide-react';


export default function ClaimUploadModal({ points = 50, onClose, onSubmitted }) {
  const fileRef = useRef(null)
  const [file, setFile] = useState(null)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function chooseFile() {
    fileRef.current?.click()
  }

  return (
    <Modal title={`Claim Your ${points} Points`} onClose={onClose}>
      <div className="w-full max-w-md">
        <p className="text-sm text-slate-600 mb-3">Sign up for Reclaim (free, no payment needed), then fill the form below:</p>
            <ol className="space-y-3 text-sm text-slate-600 mb-4">
            <li className="flex gap-3">
                <span className="min-w-[24px] h-6 flex items-center justify-center
                                bg-indigo-600 text-white font-semibold text-xs rounded">
                1
                </span>
                <div>
                Enter your Reclaim sign-up email.
               
                </div>
            </li>

            <li className="flex gap-3">
                <span className="min-w-[24px] h-6 flex items-center justify-center
                                bg-indigo-600 text-white font-semibold text-xs rounded">
                2
                </span>
                <div>
                Upload a screenshot of your Reclaim profile showing your email.
                </div>
            </li>
             <p className="text-sm text-slate-500 mt-1">
                    After verification, you’ll get 25 Flowva Points! 🎉😊
                </p>
            </ol>

        <label className="block text-xs font-medium text-slate-700">Email used on Reclaim</label>
        <input value={email} onChange={(e) => { setEmail(e.target.value); setEmailError('') }} placeholder="user@example.com" className="w-full border rounded px-3 py-2 mt-1" />
        {emailError && <div className="text-xs text-red-500 mt-1">{emailError}</div>}

        <label className="block text-xs font-medium text-slate-700 mt-4">Upload screenshot (mandatory)</label>
        <div onClick={chooseFile} className="mt-2 border border-slate-200 rounded p-4 text-center cursor-pointer bg-white">
          <input ref={fileRef} type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex items-center justify-center gap-2">
            <CloudUpload className="w-5 h-5 text-slate-400" />
            <div className="text-sm text-slate-500">Choose file</div>
          </div>
        </div>
        {file && <div className="text-xs text-slate-600 mt-2">{file.name}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded bg-slate-100">Cancel</button>
          <button onClick={() => {
            if (!file) return
            if (!email) { setEmailError('Please fill in the email address'); return }
            setSubmitting(true)
            setTimeout(() => {
              setSubmitting(false)
              onClose()
              onSubmitted?.()
            }, 10000)
          }} disabled={!file || submitting} className={`px-4 py-2 rounded ${submitting ? 'bg-gray-300 text-gray-700' : 'bg-violet-600 text-white'}`}>
            {submitting ? 'Submitting…' : 'Submit Claim'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
