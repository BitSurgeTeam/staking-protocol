// import "./App.css";

import { Route, Routes } from "react-router-dom"
import RouterLogProvider, { RouterLogContext } from "./context/RouterContext"
// import "./style/daisyui-cover.css"; // 导入自定义的 DaisyUI 覆盖样式
import Home from "./pages/Home"
// import Footer from "./layout/Footer";
import Header from "./layout/Header"
import CreateAccount from "./pages/Account/Create/Index"
// import './style/daisyui-cover.css'; // 导入自定义的 DaisyUI 覆盖样式
import TransactionSection from "./pages/transactions/TransactionsSection.tsx"
import Transactions from "./pages/transactions/Index.tsx"
import TransactionDetail from "./pages/transactions/Detail.tsx"
import Setting from "./pages/Setting"
// import UserHome from "./pages/UserHome";
import AddressBook from "./pages/AddressBook"
import AppC from "./pages/App"
import Assets from "./pages/Assets"
import Swap from "./pages/Swap"
import SidebarLayout from "./layout/SidebarLayout"
import Test from "./pages/Test/Index"
import Account from "./pages/Account/Index"
import SendToken from "./pages/transactions/SendToken.tsx"
import { useContext } from "react"
import { Staking } from "./pages/Babylon/index.tsx"
import { ErrorProvider } from "./context/Error/ErrorContext";
import Market from "./pages/Market/Index.tsx"
import MarketDetail from "./pages/Market/Detail/Index.tsx"
import {
  WalletProvider as RoochWalletProvider,
  SuiClientProvider,
  createNetworkConfig,
} from "@mysten/dapp-kit"
import { getFullnodeUrl } from "@mysten/sui/client"

const { networkConfig:_networkConfig } = createNetworkConfig({
  // TODO: support muilt rpc
  // mainnet: { url: "https://sui-mainnet-endpoint.blockvision.org" },
  mainnet: { url: getFullnodeUrl("mainnet") },
  testnet: { url: getFullnodeUrl("testnet") },
})

function App() {
  const { current } = useContext(RouterLogContext)
  return (
    <RouterLogProvider>
      <div className="relative">
        {/* 仅在 Home 页面显示背景图片 */}
        {current === "/" && (
          <div
            className="absolute right-0 top-0 z-0 h-full bg-right bg-no-repeat"
            style={{
              width: "1066px",
              backgroundImage: "url('/assets/images/bgImage.svg')", // 使用相对路径引用
              backgroundSize: "contain",
            }}
          ></div>
        )}
        {/* 内容容器 */}
        <div className="relative z-10 flex h-full flex-col justify-between overflow-hidden">
          {/* <Header/> */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<Test />} />
            <Route path="/staking" element={
              <div>
                <Header haveSidebar={true} />
                <ErrorProvider><Staking /></ErrorProvider>
              </div>
            } />
            <Route path="/market" element={
              <div>
                <Header haveSidebar={true} />
                <Market />
              </div>
            } />
            <Route
              element={
                <div>
                  <Header haveSidebar={true} wallet={false} />
                  <SuiClientProvider networks={_networkConfig} defaultNetwork={'mainnet'}>
                  <RoochWalletProvider>
                  <MarketDetail />
                  </RoochWalletProvider>
                  </SuiClientProvider>
                </div>}
              path="/market/detail/:coinType/:maturity/:operation?/:action?/:tokenType?"
            />
            <Route
              path="/accounts"
              element={
                <div>
                  <Header haveSidebar={true} />
                  <Account />
                </div>
              }
            />
            <Route
              path="/account/create"
              element={
                <div>
                  <Header />
                  <CreateAccount />
                </div>
              }
            />
            <Route
              path="/account/:address"
              element={
                <SidebarLayout>
                  <div className="block 2xl:hidden">
                    <Header haveSidebar={true} />
                  </div>
                  <div className="hidden 2xl:block">
                    <Header />
                  </div>
                  <Transactions />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/tx/detail/:orderId"
              element={
                <SidebarLayout>
                  <div className="block 2xl:hidden">
                    <Header haveSidebar={true} />
                  </div>
                  <div className="hidden 2xl:block">
                    <Header />
                  </div>
                  <TransactionDetail />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/assets"
              element={
                <SidebarLayout>
                  <Header />
                  <Assets />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/transaction-section"
              element={
                <SidebarLayout>
                  <div className="block 2xl:hidden">
                    <Header haveSidebar={true} />
                  </div>
                  <div className="hidden 2xl:block">
                    <Header />
                  </div>
                  <TransactionSection />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/transaction/send"
              element={
                <SidebarLayout>
                  <div className="block 2xl:hidden">
                    <Header haveSidebar={true} />
                  </div>
                  <div className="hidden 2xl:block">
                    <Header />
                  </div>
                  <SendToken />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/addressBook"
              element={
                <SidebarLayout>
                  <Header />
                  <AddressBook />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/swap"
              element={
                <SidebarLayout>
                  <Header />
                  <Swap />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/app"
              element={
                <SidebarLayout>
                  <Header />
                  <AppC />
                </SidebarLayout>
              }
            />
            <Route
              path="/user/setting"
              element={
                <SidebarLayout>
                  <Header />
                  <Setting />
                </SidebarLayout>
              }
            />
            {/* 其他路由 */}
          </Routes>
        </div>
      </div>
    </RouterLogProvider>
  )
}

export default App
