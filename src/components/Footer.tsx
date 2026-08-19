export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 py-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">VARAHA METALIKS PVT. LTD</h2>
        <p className="text-sm font-semibold tracking-widest text-blue-500 mb-8 uppercase">BIS Certified ISO 9001 Company</p>
        
        <div className="w-24 h-px bg-gray-800 mb-8"></div>
        
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Varaha Metaliks Pvt. Ltd. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
