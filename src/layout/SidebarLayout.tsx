// src/layout/SidebarLayout.tsx

import React, { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import btcIcon from "/assets/icons/btc.svg"
import userAvatar from "/assets/images/userAvatar.svg"
import warnSetting from "/assets/icons/warnSetting.svg"
import arrow from "/assets/icons/arrow.svg"
import eyeIcon from "/assets/icons/eye.svg"
import qrIcon from "/assets/icons/qr.svg"
import shareIcon from "/assets/icons/share.svg"
import copyIcon from "/assets/icons/copy.svg"

import homeIcon from "/assets/icons/home.svg"
import assetsIcon from "/assets/icons/assets.svg"
import TransactionSectionIcon from "/assets/icons/transactionSection.svg"
import addressBookIcon from "/assets/icons/addressBook.svg"
import swapIcon from "/assets/icons/swap.svg"
import appIcon from "/assets/icons/app.svg"
import settingIcon from "/assets/icons/setting.png"
import { useCurrentAddress } from "@roochnetwork/rooch-sdk-kit"
import LogoWithText from "@/assets/svg/LogoWithText.svg?react"
import useMultiWalletStore from "@/stores/useMultiWalletStore"
import { unisatApi } from "@/utils/request"
import { UTXO } from "@/types/utxo"
import Decimal from "decimal.js"
// Sidebar 组件
const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const { address: multiAddress } = useParams()
  const [walletName, setWalletName] = useState("Unisat Btc Surge")

  const [balance, setBalance] = useState(0)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [isMultisig, setIsMultisig] = useState(true)
  const [multisigInfo, setMultisigInfo] = useState("2/3")

  const currentAddress = useCurrentAddress()

  useEffect(() => {
    unisatApi<UTXO[]>("/address/btc-utxo", "testnet")
      .get({
        address: multiAddress,
      })
      .then((utxos) => {
        setBalance(
          new Decimal(utxos.reduce((total, utxo) => total + utxo.satoshis, 0))
            .div(1e8)
            .toNumber(),
        )
      })
  }, [])

  const shortenedAddress = useMemo(() => {
    const address = currentAddress?.genRoochAddress().toStr()
    if (!address) return ""
    return `${address.slice(0, 10)}...${address.slice(-4)}`
  }, [currentAddress])

  const dialogRef = useRef<HTMLDialogElement>(null)
  const openModal = () => {
    if (dialogRef.current) {
      document.body.style.overflow = "hidden"
      dialogRef.current.showModal()
      dialogRef.current.classList.remove("hidden")
      dialogRef.current.classList.add("flex")
      setTimeout(() => {
        dialogRef.current?.classList.remove("-translate-x-full")
      }, 10)
    }
  }

  const closeModal = () => {
    if (dialogRef.current) {
      document.body.style.overflow = ""
      dialogRef.current.classList.add("-translate-x-full")
      setTimeout(() => {
        dialogRef.current?.classList.remove("flex")
        dialogRef.current?.classList.add("hidden")
        dialogRef.current?.close()
      }, 500)
    }
  }
  const handleClickOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      closeModal()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        currentAddress?.genRoochAddress().toStr() || "",
      )
    } catch (error) {
      console.error("copy:", error)
    }
  }
  const toggleVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  const handleNavigation = (path: string) => {
    navigate(path)
  }

  return (
    <aside className="hidden h-full w-72 shrink-0 bg-[#151617]/40 text-base text-[#E1E1E1] 2xl:block">
      <LogoWithText className="px-12 py-8" />
      <div className="my-4 flex h-9 w-full items-center justify-center bg-[#CD7000]/10 px-5 py-6 text-sm text-white">
        <img className="mr-2 size-6" src={btcIcon} alt="btcIcon" />
        <span className="text-lg">Bitcoin</span>
      </div>

      <div
        className="mx-5 my-5 flex cursor-pointer items-center justify-between"
        onClick={openModal}
      >
        <div className="relative inline-flex items-center">
          <img className="mr-2 h-14 w-14" src={userAvatar} alt="userAvatar" />
          <div className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border-none bg-electric-green">
            {isMultisig ? (
              <span className="text-[8px] font-bold text-black">
                {multisigInfo}
              </span>
            ) : (
              <img className="h-5 w-5" src={btcIcon} alt="BTC" />
            )}
          </div>
        </div>
        <div className="hidden">
          <p className="text-sm text-white">
            <span className="font-bold">{walletName}</span>
          </p>
          <p className="mb-1 text-xs text-white/50">
            <span className="font-normal">{shortenedAddress}</span>
          </p>
          <img className="h-3" src={warnSetting} alt="warnSetting" />
        </div>
        <button className={"btn ml-7 border-none p-0"}>
          <img className="h-7 w-7" src={arrow} alt="userAvatar" />
        </button>
      </div>

      <div className="mx-5 max-w-md items-center rounded-lg bg-[#161717] p-4 shadow-lg">
        <div className="flex flex-col justify-between">
          {/* 上半部分 */}
          <div className="flex items-center">
            <span className="mr-2 text-xs font-semibold text-white">
              Total Balance
            </span>
            <button onClick={toggleVisibility}>
              <img
                className="h-3 w-3 cursor-pointer"
                src={eyeIcon}
                alt="toggle visibility"
              />
            </button>
          </div>
          {/* 下半部分 */}
          <div className="flex items-center">
            <span className="mr-4 w-7/12 text-sm font-bold text-electric-green">
              {isBalanceVisible ? `${balance} BTC` : "******"}
            </span>
            {/* 右侧图标 */}
            <div className="flex space-x-4">
              <button>
                <img
                  className="h-3 w-3 cursor-pointer"
                  src={qrIcon}
                  alt="QR Code"
                />
              </button>
              <button>
                <img
                  className="h-3 w-3 cursor-pointer"
                  src={shareIcon}
                  alt="Share"
                />
              </button>
              <button onClick={handleCopy}>
                <img
                  className="h-3 w-3 cursor-pointer"
                  src={copyIcon}
                  alt="Copy"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4 flex h-10 w-full items-center justify-center px-5">
        <button className="btn btn-sm h-full w-full items-center justify-center rounded-full bg-electric-green text-black hover:bg-green-500">
          <span
            className="text-sm font-medium"
            onClick={() => navigate("/user/transaction-section")}
          >
            New Transaction
          </span>
        </button>
      </div>

      <ul className="menu-compact menu p-0">
        <li>
          <button
            className={`rounded-none px-8 py-4 hover:bg-[#161717]`}
            onClick={() =>
              multiAddress
                ? navigate("/account/" + multiAddress)
                : navigate("/accounts")
            }
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 size-6" src={homeIcon} alt="logo" />
            </div>
            <span className="text-lg">Home</span>
          </button>
        </li>
        <li className="hidden">
          <button
            className={`rounded-none px-8 hover:bg-[#161717]`}
            onClick={() => handleNavigation("/user/assets")}
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 h-4 w-4" src={assetsIcon} alt="logo" />
            </div>
            Assets
          </button>
        </li>
        <li className="hidden">
          <button
            className={`rounded-none px-8 hover:bg-[#161717]`}
            onClick={() => handleNavigation("/user/transaction-section")}
          >
            <div className={`inline-flex items-center`}>
              <img
                className="mr-2 h-4 w-4"
                src={TransactionSectionIcon}
                alt="logo"
              />
            </div>
            Transactions
          </button>
        </li>
        <li className="hidden">
          <button
            onClick={() => handleNavigation("/user/addressBook")}
            className={`rounded-none px-8 hover:bg-[#161717]`}
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 h-4 w-4" src={addressBookIcon} alt="logo" />
            </div>
            AddressBook
          </button>
        </li>
        <li className="hidden">
          <button
            className={`rounded-none px-8 hover:bg-[#161717]`}
            onClick={() => handleNavigation("/user/swap")}
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 h-4 w-4" src={swapIcon} alt="logo" />
            </div>{" "}
            swap
          </button>
        </li>
        <li className="hidden">
          <button
            className={`rounded-none px-8 hover:bg-[#161717]`}
            onClick={() => handleNavigation("/user/app")}
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 h-4 w-4" src={appIcon} alt="logo" />
            </div>
            app
          </button>
        </li>
        <li>
          <button
            className={`rounded-none px-8 py-4 hover:bg-[#161717]`}
            onClick={() => handleNavigation("/user/setting")}
          >
            <div className={`inline-flex items-center`}>
              <img className="mr-2 size-6" src={settingIcon} alt="logo" />
            </div>
            <span className="text-lg">setting</span>
          </button>
        </li>
      </ul>

      {/* 使用 <dialog> 作为模态框 */}
      <dialog
        ref={dialogRef}
        onClick={handleClickOutside}
        className="modal fixed inset-0 z-50 h-full -translate-x-full bg-black bg-opacity-50 opacity-0 transition-all duration-500 ease-in-out"
      >
        <div className="fixed inset-y-0 left-0 w-1/3 overflow-auto bg-[#161717] text-white shadow-lg">
          <div className="mt-10 w-full">
            <div className="flex w-full items-center justify-between border-b-2 border-gray-500/30 p-5">
              <span className="text-xl text-white">Surge accounts</span>
              <button className="btn btn-sm flex h-14 w-36 items-center justify-center rounded-md border border-electric-green bg-black text-electric-green">
                Create account
              </button>
            </div>

            <div className="border-b-2 border-gray-500/30 p-5">
              <span className="text-xl text-white">My accounts</span>
            </div>
            <div className="border-b-2 border-gray-500/30 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    className="h-5 w-5 cursor-pointer"
                    src={eyeIcon}
                    alt="toggle visibility"
                  />
                  <span className="text-base text-white">Watchlist (1)</span>
                </div>

                <div>
                  <button>
                    <span className="text-xl text-electric-green">+ Add</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center py-8">
              <div>
                <span className="text-xl text-white">
                  Export or import your Surge data{" "}
                </span>
              </div>
              <div className="mt-5 flex items-center space-x-4">
                <button className="btn btn-sm flex h-10 w-24 items-center justify-center rounded-md border border-electric-green bg-black text-electric-green">
                  Export
                </button>
                <button className="btn btn-sm flex h-10 w-24 items-center justify-center rounded-md border border-electric-green bg-black text-electric-green">
                  Import
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </aside>
  )
}

// SidebarLayout 组件
interface SidebarLayoutProps {
  children: React.ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex w-0 grow flex-col items-center">{children}</div>
    </div>
  )
}

export default SidebarLayout