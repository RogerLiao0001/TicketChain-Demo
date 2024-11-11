# 解決搶票亂象：融合區塊鏈的票務公平分配與交易系統

## 連結
- [概念介紹簡報](https://www.canva.com/design/DAGWK0eREuo/e2G5NRa9IXbpLWZR8265yA/view?utm_content=DAGWK0eREuo&utm_campaign=designshare&utm_medium=link&utm_source=editor)
- [目前之演示網頁](https://blockchain-ticket-cb046d6a501b.herokuapp.com/hw3)
- [介紹網站(隨時更新)]([https://github.com/RogerLiao0001/TicketChain-Demo](https://hackmd.io/T_M2_dVdQ8W8M6QOZgRALw?view))

## 緣由
最近周杰倫演唱會、獵人限量卡包事件可得知，現有售票系統、限量商品購買中存在票務分配不公、黃牛操控等問題：
- 真正的粉絲無法取得票券，常被黃牛及自動搶票程序攔截。
- 主辦單位的票務獲利未能最大化，黃牛交易收益無法回流主辦方。
- 轉售與退票操作困難，二手票不僅難以取得，且存在詐騙風險。
- 票務分配及系統運行缺乏透明度，主辦方有不公開操作的空間。

## 目標

1. **優先真正粉絲**：讓粉絲優先獲得一手票，減少過度搶票的壓力與尋找二手票的負擔。
2. **允許二手交易**：讓有需求的粉絲或黃牛進行票務轉售。
3. **增加主辦方獲利**：透過智能合約，票務的二次交易收益將部分回饋主辦單位。

---

## 解決方案架構（道法術器）

### 道（價值觀）

- 建立公平、透明的票務分配系統，讓真正的粉絲有更多機會取得票券，同時增強主辦方的收益。
- 系統應兼顧效率，避免過高的時間與金錢成本。
  
### 法（實現方法）

1. **代幣質押機制**：
   - 使用類似PoS的質押代幣方式，每年或特定週期重置代幣配額，讓粉絲有機會以一手價格獲得最心儀的藝人票券。
   - 每位用戶擁有固定數量的代幣，用於在特定活動中進行質押。粉絲可根據對藝人或活動的偏好投入更多代幣，進而提升搶票成功機率。
   - 透過政府或第三方驗證，用戶取得的代幣數量固定，防止黃牛利用人頭帳戶重複參與搶票。
   - 使用中心化系統，但可在區塊鏈上發行代幣實現，增加系統透明度。(撰寫智能合約不可轉讓)

2. **NFT 票券**：
   - 將票券轉化為NFT，支持二次交易且具唯一性，防止偽造票券與詐騙行為。
   - 二手票交易收益部分回饋主辦方，具體抽成設計可限於超出原價部分，以鼓勵合理轉售。
   - 設定轉賣價格上限以限制黃牛操作空間，並限制交易僅限於官方NFT交易平台，防止私下交易。
  
3. **公開透明的抽選流程**：
   - 可透過智能合約實現公開透明的票券分配，避免黑箱操作。

### 術（具體技術）

- **網站實作**：建立一個網站模擬代幣分配、質押購票流程，並展示公開透明的獲票選擇過程及票券NFT交易市場。

### 器（工具）

- 前後端開發工具，支持網頁和移動端介面。(目前使用react.js、雲端資料庫製作)
- 使用區塊鏈技術發行NFT。
- 代幣、拮選可選擇用中心化或去中心化技術實現。

---

## 專案面臨的挑戰與解決想法

1. **身份驗證（防止人頭帳號）**：黃牛公司用真人人頭帳號大量創建錢包地址，大量搶票，如何解決？  
   - 每個帳號一年也只能買大約一次熱門票，因此應該不會出大事，但還是要運行測試後才知道

2. **身份驗證的隱私問題**
   - 方案一：透過第三方KYC身份驗證，系統僅保存用戶身份的哈希值，不直接存儲個人資料，既保護隱私又避免人頭帳號。
   - 方案二：讓政府主持身份驗證與
  
3. **這個系統可能不用區塊鏈就能做**  
   - 確實，但是這個系統還是很有價值，而且就算主體用中心化系統，也能套用一些如NFT、智能合約公開，來嵌入部分區塊鏈技術
  
4. **如何降低整套系統成本，讓廠商願意採用？** 
   - 我目前只想到能叫政府立法強制套用這套程式
  
5. **提升用戶易用性**: 大部分人不會用區塊鏈，也不會想額外花時間研究網站使用  
   - **無需錢包設計**：將粉絲代幣和NFT票券管理嵌入到平台內，用戶無需區塊鏈知識。
   - 在後端使用區塊鏈技術，但對用戶提供簡單直觀的介面，無需他們理解技術細節。
   - **實體售票機支持**：可透過掃碼或證件掃描登入與驗證，適合不熟悉線上購票的用戶使用。

# 補充：
- 使用質押點數，每人每次限購兩張票，避免一人大量刷票。還有剩下的票，則可無限不需點數購買。
- 每個場次的主辦方可以新增條件讓粉絲獲得一定比例的額外限用於該場次的點數？例如網頁可提供Spotify API串接，收聽該藝人達一定時數可是為粉絲，增加獲票機率
- 是否在台灣合法？
- 可考慮用CAPTCHA之類的機制取代驗證碼，防止機器人搶票（我就不懂傳統驗證碼那麼沒用，為什麼各大售票系統還是堅持用傳統驗證買而不是CAPTCHA等進階的機器人防止機制？）
- 完全使用區塊鏈的售票系統，國內外有相關文獻做過研究了，但我覺得沒有套用的必要性，且對於搶票問題無根本性解決！
- 本大綱為初稿，我會閱讀更多文獻來將此系統架構完善，並且做成完整的網站！

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
