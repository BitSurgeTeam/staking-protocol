import { useNavigate } from "react-router-dom"
import BitcoinIcon from "@/assets/svg/bitcoin.svg?react"

export default function Info({
  setName,
  nextStep,
}: {
  nextStep: () => void
  setName: React.Dispatch<React.SetStateAction<string>>
}) {
  const navigate = useNavigate()
  return (
    <div className="mt-[18px] grid w-full grid-cols-3 gap-x-6">
      <div className="col-span-3 rounded-3xl bg-[#0A0A0A] p-3 md:col-span-2 md:p-6">
        <h6>Enter your Surge name</h6>
        <p className="mt-2 text-sm text-white/50 md:text-base">
          Fill in the name and personal information
        </p>
        <div className="mt-5 grid grid-cols-3 gap-x-2">
          <div className="col-span-3 flex items-center gap-x-4 rounded-2xl bg-[#141516] px-[18px] py-5 md:col-span-2 md:gap-x-16">
            <span className="text-xs">Name</span>
            <input
              type="text"
              placeholder="Account name"
              onChange={(e) => setName(e.target.value)}
              className="grow border-none bg-transparent text-xs outline-none placeholder:text-white/50"
            />
          </div>
          <div className="col-span-1 hidden items-center justify-center gap-x-2 rounded-2xl bg-[#141516] px-[18px] py-5 md:flex">
            <BitcoinIcon />
            <span className="text-white">Bitcoin</span>
          </div>
        </div>
        <p className="mt-5 text-xs">
          By continuing, you agree to our terms of use and privacy policy.
        </p>
        <div className="mt-6 flex items-center justify-end gap-x-2">
          <button
            className="rounded-full border border-white px-4 py-1.5 text-sm md:px-8 md:py-3"
            onClick={() => navigate("/accounts")}
          >
            Back
          </button>
          <button
            onClick={nextStep}
            className="rounded-full border border-[#12FF80] bg-[#12FF80] px-4 py-1.5 text-sm text-black md:px-8 md:py-3"
          >
            Next
          </button>
        </div>
      </div>
      <div className="col-span-1 hidden flex-col gap-y-5 rounded-3xl bg-[#0A0A0A] p-6 md:flex">
        <h6>Your Surge Account Preview</h6>
        <div className="grid grid-cols-3 gap-x-4 rounded-2xl bg-[#141516] px-5 py-6">
          <span className="col-span-1">Wallet</span>
          <div className="col-span-2 flex items-center gap-x-2">
            <div className="h-8 w-8 rounded-full bg-white"></div>
            <div>0x716...63fe</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-x-4 rounded-2xl bg-[#141516] px-5 py-6">
          <span className="col-span-1">Network</span>
          <div className="col-span-2 flex items-center gap-x-2">
            <BitcoinIcon className="h-8 w-8" />
            <div>Bitcoin</div>
          </div>
        </div>
      </div>
    </div>
  )
}