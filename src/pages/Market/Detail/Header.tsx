import { IS_DEV } from "@/config"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { truncateStr } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useToast } from "@/components/Toast"
import { useEffect, useRef, useState } from "react"

import Squares2X2Icon from "@/assets/images/svg/squares-2x2.svg?react"
import {
  ConnectModal,
  useAccounts,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useSwitchAccount,
} from "@mysten/dapp-kit"

export default function Header() {
  const toast = useToast()
  const accounts = useAccounts()
  const [open, setOpen] = useState(false)
  const currentAccount = useCurrentAccount()
  const { isConnected } = useCurrentWallet()
  const [isOpen, setIsOpen] = useState(false)
  const [isDrop, setIsDrop] = useState(false)
  const { mutate: switchAccount } = useSwitchAccount()
  const { mutate: disconnect } = useDisconnectWallet()

  const subNavRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (event: MouseEvent) => {
    if (
      subNavRef.current &&
      !subNavRef.current.contains(event.target as Node)
    ) {
      setIsDrop(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="py-6">
      <div className="mx-auto flex w-full items-center justify-between text-xs">
        <div className="flex items-center gap-x-6">
          <Squares2X2Icon
            className="cursor-pointer text-white md:hidden"
            onClick={() => setIsOpen((isOpen) => !isOpen)}
          />

          {isConnected ? (
            <div className="fixed right-12 top-5" ref={subNavRef}>
              <div
                onClick={() => setIsDrop((isDrop) => !isDrop)}
                className="flex cursor-pointer items-center gap-x-1 rounded-full bg-[#0E0F16] px-3 py-2"
              >
                <span>{truncateStr(currentAccount?.address || "", 4)}</span>
                <ChevronDown className="size-4" />
              </div>
              {isDrop && (
                <ul className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg">
                  <li
                    className="w-full cursor-pointer bg-[#0E0F16] px-4 py-2 text-white/50 hover:text-white"
                    onClick={() => {
                      disconnect()
                    }}
                  >
                    Disconnect
                  </li>
                  <li
                    className="w-full cursor-pointer bg-[#0E0F16] px-4 py-2 text-white/50 hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        currentAccount?.address || "",
                      )
                      toast.success("Address copied to clipboard")
                      setIsDrop(false)
                    }}
                  >
                    Copy Address
                  </li>
                  {accounts
                    .filter(
                      (account) => account.address !== currentAccount?.address,
                    )
                    .map((account) => (
                      <li
                        key={account.address}
                        className="w-full cursor-pointer bg-[#0E0F16] px-4 py-2 text-white/50 hover:text-white"
                        onClick={() => {
                          switchAccount(
                            { account },
                            {
                              onSuccess: () =>
                                console.log(`switched to ${account.address}`),
                            },
                          )
                        }}
                      >
                        {truncateStr(account?.address || "", 4)}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          ) : (
            <ConnectModal
              open={open}
              onOpenChange={(isOpen) => setOpen(isOpen)}
              trigger={
                <button
                  disabled={!!currentAccount}
                  className="fixed right-12 top-5 rounded-3xl border border-white px-3 py-2 text-white outline-none"
                >
                  Connect Wallet
                </button>
              }
            />
          )}
        </div>
      </div>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ overflow: "hidden" }}
        className="flex gap-x-8 text-sm md:hidden"
      >
        <div className="flex flex-col">
          <Link to="/market" className="py-2 text-white">
            Markets
          </Link>
          <Link to="/portfolio" className="cursor-pointer py-2 text-white">
            Portfolio
          </Link>
          <Link to="/learn" className="py-2 text-white">
            Learn
          </Link>
          {IS_DEV && (
            <Link to="/test" className="py-2 text-white">
              Test
            </Link>
          )}
        </div>
      </motion.div>
    </header>
  )
}
