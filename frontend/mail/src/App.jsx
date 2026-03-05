import { useState } from 'react'
import axios from 'axios'
import * as XLSX from 'xlsx'

function App() {

  const [subject, setsubject] = useState("")
  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emaillist, setemaillist] = useState([])

  function handlesubject(event) {
    setsubject(event.target.value)
  }

  function handlemsg(event) {
    setmsg(event.target.value)
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const emailList = XLSX.utils.sheet_to_json(worksheet, { header: 'A' });
      const totalemail = emailList.map(function (item) { return item.A; });
      setemaillist(totalemail)
    }
    reader.readAsBinaryString(file);
  }

  function send() {
    setstatus(true)
    axios.post("https://mail-xi-gold.vercel.app", { msg: msg, emaillist: emaillist })
      .then(function (data) {
        if (data.data === true) {
          alert("Emails sent successfully")
          setstatus(false)
        }
        else {
          alert("Error in sending emails")
          setstatus(false)
        }
      })
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-10 md:p-14 py-10 sm:py-14 md:py-16">

      {/* One continuous card */}
      <div className="plastic-card w-full max-w-6xl animate-fade-in-up">

        {/* ── Header ── */}
        <header className="text-center space-y-2 mb-10 md:mb-14">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#4a2040]">
            Bulk Mailer
          </h1>
          <p className="text-[7px] sm:text-[12px] font-bold uppercase tracking-[0.35em] text-[#c9a0b8]">
            We can help your business with sending multiple emails at once
          </p>
        </header>

        {/* ── Upload (Left) + Subject/Message (Right) ── */}
        <div className="flex flex-col md:grid md:grid-cols-[1fr_1.5fr] gap-8 md:gap-10">

          {/* LEFT: File Upload */}
          <div className="flex flex-col space-y-3 h-full">
            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b07a9e] ml-2">
              Recipient List
            </label>
            <div className="upload-zone flex-grow flex flex-col items-center justify-center min-h-[220px] md:min-h-0">
              <input
                onChange={handlefile}
                type="file"
                id="fileInput"
                className="hidden"
              />
              <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center space-y-3">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{
                    background: '#fdf2f7',
                    boxShadow: 'inset 3px 3px 6px #e0c8d8, inset -3px -3px 6px #ffffff'
                  }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e84393" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>

                {emaillist.length > 0 ? (
                  <div className="space-y-1 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00b894] animate-soft-pulse" />
                      <span className="text-[#4a2040] font-bold text-sm">
                        {emaillist.length} Recipients Loaded
                      </span>
                    </div>
                    <p className="text-[9px] text-[#c9a0b8] uppercase font-bold tracking-widest">
                      Click to replace file
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 text-center">
                    <p className="text-[#b07a9e] font-semibold text-sm">
                      Upload Recipient File
                    </p>
                    <p className="text-[9px] text-[#c9a0b8] uppercase font-bold tracking-widest">
                      CSV / XLSX supported
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* RIGHT: Subject + Message */}
          <div className="flex flex-col space-y-5 h-full">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b07a9e] ml-2 block">
                Subject Line
              </label>
              <input
                type="text"
                onChange={handlesubject}
                value={subject}
                className="plastic-input"
                placeholder="Enter email subject..."
              />
            </div>

            <div className="space-y-2 flex-grow flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b07a9e] ml-2 block">
                Message Body
              </label>
              <textarea
                onChange={handlemsg}
                value={msg}
                className="plastic-input flex-grow resize-none min-h-[160px]"
                placeholder="Compose your email content here..."
              />
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="my-10 md:my-14 flex items-center gap-4">
          <div className="flex-grow h-[1px] bg-[#f0c6d9]/50" />
          <span className="text-[14px] font-bold uppercase tracking-[0.3em] text-[#4a2040] shrink-0">Preview</span>
          <div className="flex-grow h-[1px] bg-[#f0c6d9]/50" />
        </div>

        {/* ── Preview Section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-0">
            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#b07a9e]">
              Email Preview
            </label>
            {emaillist.length > 0 && (
              <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest text-[#e84393]"
                style={{
                  background: '#fdf2f7',
                  boxShadow: 'inset 2px 2px 4px #e0c8d8, inset -2px -2px 4px #ffffff'
                }}>
                {emaillist.length} recipients
              </span>
            )}
          </div>

          {/* Fixed Pink Preview Box */}
          <div className="preview-box">
            <div className="flex items-center gap-2 pb-2 mb-3 shrink-0"
              style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#fd79a8]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#f0c6d9]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#e8dae0]" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 ml-2">
                Preview
              </span>
            </div>

            <div className="preview-content-scroll flex-grow">
              {(subject || msg) ? (
                <div className="space-y-4">
                  {subject && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Subject</span>
                      <p className="text-base font-bold text-white mt-1">{subject}</p>
                    </div>
                  )}
                  {msg && (
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-white/40">Body</span>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/80 mt-1 font-medium">
                        {msg}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-2 opacity-40 select-none">
                  <div className="w-10 h-[2px] rounded-full bg-white/50" />
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/80">
                    Your email preview will appear here
                  </p>
                  <div className="w-6 h-[2px] rounded-full bg-white/50" />
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* ── Send Button ── */}
        <div className="mt-10">
          <button
            onClick={send}
            disabled={status || emaillist.length === 0}
            className="plastic-button"
          >
            {status ? (
              <span className="flex items-center gap-3">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              <span>Send Mail</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
