// DOM Elements
const verifyBtn = document.getElementById("verifyBtn");
const nextBtn = document.getElementById("nextBtn");
const confirmPopup = document.getElementById("confirmPopup");
const pinModal = document.getElementById("pinModal");
const summary = document.getElementById("summary");
const successScreen = document.getElementById("successScreen");
const successText = document.getElementById("successText");
const notification = document.getElementById("notification");
const accountNumberInput = document.getElementById("accountNumber");
const amountInput = document.getElementById("amount");
const selectedBankEl = document.getElementById("selectedBank");
const bankSelect = document.getElementById("bankSelect");
const accountNameConfirm = document.getElementById("accountNameConfirm");
const amountGroup = document.getElementById("amountGroup");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const bankDetection = document.getElementById("bankDetection");
const detectedBankText = document.getElementById("detectedBankText");
const themeIcon = document.getElementById("themeIcon");
const recentList = document.getElementById("recentList");
const favoritesList = document.getElementById("favoritesList");
// Bank modal DOM elements
const cancelBankBtn = document.getElementById("cancelBankBtn");
const closeBankModalBtn = document.getElementById("closeBankModal");
const bankModal = document.getElementById("bankModal");
const bankBackdrop = document.getElementById("bankBackdrop");
const bankList = document.getElementById("bankList");
const bankSearch = document.getElementById("bankSearch");
const countryFilter = document.getElementById("countryFilter");
const prevPage = document.getElementById("prevPage");
const nextPage = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
let transferData = {};
let bankSelected = false;
// Payment Gateway Simulation
class PaymentGateway {
  constructor() {
    this.apiKey = "test_key";
    this.baseUrl = "https://api.payment-gateway.com";
  }
  
  async initiateTransfer(payload) {
    console.log(`Connecting to ${this.baseUrl}/transfers...`);
    
    // Simulate network latency
    await this.delay(300 + Math.random() * 900);
    
    // Simulate different API responses
    const responses = [
      { status: "success", data: { id: `pg_${this.generateId()}`, status: "success" }},
      { status: "success", data: { id: `pg_${this.generateId()}`, status: "pending" }},
      { status: "error", message: "Insufficient funds" },
      { status: "error", message: "Recipient account not found" },
      { status: "error", message: "Bank service unavailable" }
    ];
    
    // Weighted response simulation (70% success, 15% pending, 15% failure)
    const weights = [0.55, 0.15, 0.1, 0.1, 0.1];
    const response = this.weightedRandom(responses, weights);
    
    console.log(`Gateway response: ${response.status}`);
    return response;
  }
  
  generateId() {
    return Math.random().toString(36).substring(2, 15);
  }
  
  weightedRandom(items, weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
// Notification Service Simulation
class NotificationService {
  constructor() {
    this.sentNotifications = [];
  }
  
  async sendNotification(recipient, message, channel = "email") {
    console.log(`Sending ${channel} notification to ${recipient}...`);
    
    // Simulate notification delivery delay
    await this.delay(100 + Math.random() * 400);
    
    const notification = {
      recipient,
      message,
      channel,
      timestamp: new Date(),
      status: "delivered"
    };
    
    this.sentNotifications.push(notification);
    console.log(`Notification delivered: ${message.substring(0, 50)}...`);
    return notification;
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
// Initialize services
const paymentGateway = new PaymentGateway();
const notificationService = new NotificationService();
// Helper function to generate reference number
function generateReference() {
  const timestamp = new Date().toISOString().replace(/[-:T.]/g, "").substring(0, 14);
  const uniqueId = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `TXN-${timestamp}-${uniqueId}`;
}
// Update theme icon based on current theme
function updateThemeIcon() {
  const isLightMode = document.body.classList.contains('light');
  themeIcon.className = isLightMode ? 'fa fa-sun' : 'fa fa-moon';
}
// Listen for theme changes
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      updateThemeIcon();
    }
  });
});
observer.observe(document.body, { attributes: true });
// Bank data with countries and banks
const INLINE_STARTER = {
  countries: [
    {
      country: "Nigeria",
      banks: [
        { name: "Access Bank", domain: "accessbankplc.com", code: "044" },
        { name: "First Bank of Nigeria", domain: "firstbanknigeria.com", code: "011" },
        { name: "Guaranty Trust Bank (GTBank)", domain: "gtbank.com", code: "058" },
        { name: "United Bank for Africa (UBA)", domain: "ubagroup.com", code: "033" },
        { name: "Zenith Bank", domain: "zenithbank.com", code: "057" },
        { name: "Polaris Bank", domain: "polarisbanklimited.com", code: "076" },
        { name: "Fidelity Bank", domain: "fidelitybank.ng", code: "070" },
        { name: "Wema Bank", domain: "wemabank.com", code: "035" },
        { name: "Keystone Bank", domain: "keystonebankng.com", code: "082" },
        { name: "Stanbic IBTC", domain: "stanbicibtc.com", code: "221" },
        { name: "MONIE POINT", domain: "moniepoint.com", code: "50215" },
        { name: "OPay", domain: "opay.com", code: "50216" },
        { name: "OPay Microfinance Bank", domain: "opay.com", code: "50216" },
        { name: "OPay Digital Bank", domain: "opay.com", code: "50216" },
        { name: "Palmpay", domain: "palmpay.com", code: "50217" },
        { name: "Kuda Bank", domain: "kudabank.com", code: "50218" },
        { name: "Carbon", domain: "carbon.ng", code: "50219" },
        { name: "ALAT by Wema", domain: "alat.ng", code: "50220" },
        { name: "V Bank", domain: "vbank.com", code: "50221" },
        { name: "Mintyn", domain: "mintyn.com", code: "50222" },
        { name: "Rubies MFB", domain: "rubiesmfb.com", code: "50223" },
        { name: "Eyowo", domain: "eyowo.com", code: "50224" },
        { name: "Sparkle", domain: "sparkle.ng", code: "50225" },
        { name: "GoMoney", domain: "gomoney.com", code: "50226" },
        { name: "Mint", domain: "mint.com", code: "50227" },
        { name: "VFD Microfinance Bank", domain: "vfdbank.com", code: "50228" },
        { name: "TCF MFB", domain: "tcfmfb.com", code: "50229" },
        { name: "Abbey Mortgage Bank", domain: "abbeymortgagebank.com", code: "50230" },
        { name: "Page MFB", domain: "pagemfb.com", code: "50231" },
        { name: "Safe Haven MFB", domain: "safehavenmfb.com", code: "50232" },
        { name: "Mutual Trust MFB", domain: "mutualtrustmfb.com", code: "50233" },
        { name: "Trustbond MFB", domain: "trustbondmfb.com", code: "50234" },
        { name: "Corestep MFB", domain: "corestepmfb.com", code: "50235" },
        { name: "PecanTrust MFB", domain: "pecantrustmfb.com", code: "50236" },
        { name: "SeedCapital MFB", domain: "seedcapitalmfb.com", code: "50237" },
        { name: "Bosak MFB", domain: "bosakmfb.com", code: "50238" },
        { name: "Credo MFB", domain: "credomfb.com", code: "50239" },
        { name: "Globus Bank", domain: "globusbank.com", code: "50240" },
        { name: "Suntrust Bank", domain: "suntrustbank.com", code: "50241" },
        { name: "Parallex Bank", domain: "parallexbank.com", code: "50242" },
        { name: "Providus Bank", domain: "providusbank.com", code: "50243" },
        { name: "Titan Trust Bank", domain: "titantrustbank.com", code: "50244" },
        { name: "Lotus Bank", domain: "lotusbank.com", code: "50245" },
        { name: "Citi Bank", domain: "citi.com", code: "50246" },
        { name: "Heritage Bank", domain: "heritagebank.com", code: "50247" },
        { name: "Union Bank", domain: "unionbank.com", code: "50248" },
        { name: "Sterling Bank", domain: "sterlingbank.com", code: "50249" },
        { name: "Wema Bank", domain: "wemabank.com", code: "50250" },
        { name: "Zenith Bank", domain: "zenithbank.com", code: "50251" },
        { name: "Access Bank", domain: "accessbank.com", code: "50252" },
        { name: "First Bank", domain: "firstbank.com", code: "50253" },
        { name: "UBA", domain: "uba.com", code: "50254" },
        { name: "GTBank", domain: "gtbank.com", code: "50255" },
        { name: "Ecobank", domain: "ecobank.com", code: "50256" },
        { name: "Fidelity Bank", domain: "fidelitybank.com", code: "50257" },
        { name: "Keystone Bank", domain: "keystonebank.com", code: "50258" },
        { name: "Polaris Bank", domain: "polarisbank.com", code: "50259" },
        { name: "Unity Bank", domain: "unitybank.com", code: "50260" },
        { name: "Stanbic IBTC", domain: "stanbicibtc.com", code: "50261" },
        { name: "Standard Chartered", domain: "standardchartered.com", code: "50262" },
        { name: "Citibank", domain: "citibank.com", code: "50263" },
        { name: "Jaiz Bank", domain: "jaizbank.com", code: "50264" },
        { name: "Providus Bank", domain: "providusbank.com", code: "50265" },
        { name: "Suntrust Bank", domain: "suntrustbank.com", code: "50266" },
        { name: "Parallex Bank", domain: "parallexbank.com", code: "50267" },
        { name: "Titan Trust Bank", domain: "titantrustbank.com", code: "50268" },
        { name: "Lotus Bank", domain: "lotusbank.com", code: "50269" },
        { name: "Globus Bank", domain: "globusbank.com", code: "50270" },
        { name: "Citi Bank", domain: "citibank.com", code: "50271" },
        { name: "Heritage Bank", domain: "heritagebank.com", code: "50272" },
        { name: "Union Bank", domain: "unionbank.com", code: "50273" },
        { name: "Sterling Bank", domain: "sterlingbank.com", code: "50274" },
        { name: "Wema Bank", domain: "wemabank.com", code: "50275" },
        { name: "Zenith Bank", domain: "zenithbank.com", code: "50276" },
        { name: "Access Bank", domain: "accessbank.com", code: "50277" },
        { name: "First Bank", domain: "firstbank.com", code: "50278" },
        { name: "UBA", domain: "uba.com", code: "50279" },
        { name: "GTBank", domain: "gtbank.com", code: "50280" },
        { name: "Ecobank", domain: "ecobank.com", code: "50281" },
        { name: "Fidelity Bank", domain: "fidelitybank.com", code: "50282" },
        { name: "Keystone Bank", domain: "keystonebank.com", code: "50283" },
        { name: "Polaris Bank", domain: "polarisbank.com", code: "50284" },
        { name: "Unity Bank", domain: "unitybank.com", code: "50285" },
        { name: "Stanbic IBTC", domain: "stanbicibtc.com", code: "50286" },
        { name: "Standard Chartered", domain: "standardchartered.com", code: "50287" },
        { name: "Citibank", domain: "citibank.com", code: "50288" },
        { name: "Jaiz Bank", domain: "jaizbank.com", code: "50289" },
        { name: "Providus Bank", domain: "providusbank.com", code: "50290" },
        { name: "Suntrust Bank", domain: "suntrustbank.com", code: "50291" },
        { name: "Parallex Bank", domain: "parallexbank.com", code: "50292" },
        { name: "Titan Trust Bank", domain: "titantrustbank.com", code: "50293" },
        { name: "Lotus Bank", domain: "lotusbank.com", code: "50294" },
        { name: "Globus Bank", domain: "globusbank.com", code: "50295" },
        { name: "Citi Bank", domain: "citibank.com", code: "50296" },
        { name: "Heritage Bank", domain: "heritagebank.com", code: "50297" },
        { name: "Union Bank", domain: "unionbank.com", code: "50298" },
        { name: "Sterling Bank", domain: "sterlingbank.com", code: "50299" },
        { name: "Wema Bank", domain: "wemabank.com", code: "50300" }
      ]
    },
    {
      country: "Kenya",
      banks: [
        { name: "KCB Bank", domain: "kcbgroup.com" },
        { name: "Equity Bank", domain: "equitygroupholdings.com" },
        { name: "Co-operative Bank of Kenya", domain: "co-opbank.co.ke" },
        { name: "Absa Bank Kenya", domain: "absa.co.ke" },
        { name: "Stanbic Bank Kenya", domain: "stanbicbank.co.ke" }
      ]
    },
    {
      country: "South Africa",
      banks: [
        { name: "Absa Group", domain: "absa.africa" },
        { name: "Standard Bank", domain: "standardbank.com" },
        { name: "FirstRand (FNB)", domain: "fnb.co.za" },
        { name: "Nedbank", domain: "nedbank.co.za" },
        { name: "Capitec", domain: "capitecbank.co.za" }
      ]
    },
    {
      country: "Ghana",
      banks: [
        { name: "GCB Bank", domain: "gcbbank.com.gh" },
        { name: "Ecobank Ghana", domain: "ecobank.com" },
        { name: "Stanbic Bank Ghana", domain: "stanbicbank.com.gh" },
        { name: "UBA Ghana", domain: "ubagroup.com" },
        { name: "Fidelity Bank Ghana", domain: "myfidelitybank.net" }
      ]
    },
    {
      country: "United States",
      banks: [
        { name: "JPMorgan Chase", domain: "chase.com" },
        { name: "Bank of America", domain: "bankofamerica.com" },
        { name: "Wells Fargo", domain: "wellsfargo.com" },
        { name: "Citibank", domain: "citi.com" },
        { name: "Goldman Sachs", domain: "goldmansachs.com" }
      ]
    },
    {
      country: "United Kingdom",
      banks: [
        { name: "HSBC", domain: "hsbc.co.uk" },
        { name: "Barclays", domain: "barclays.co.uk" },
        { name: "Lloyds Bank", domain: "lloydsbank.com" },
        { name: "NatWest", domain: "natwest.com" },
        { name: "Standard Chartered", domain: "sc.com" }
      ]
    }
  ]
};
// Create bank code lookup map for optimized bank detection
const bankCodeMap = {};
INLINE_STARTER.countries.forEach(country => {
  country.banks.forEach(bank => {
    if (bank.code) {
      bankCodeMap[bank.code] = bank.name;
    }
  });
});
// Mock account names for demonstration
const mockAccountNames = {
  "5806096904": "SAAD NAZIFI",
  "8081708005": "AUWAL RABILU",
  "8200552337": "TANKO GABRIEL",
  "1234567890": "JOHN DOE",
  "9876543210": "JANE SMITH"
};
// Show notification
function showNotification(message) {
  notification.textContent = message;
  notification.classList.add("show");
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}
// Tab switching functionality
function switchTab(tabName) {
  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  document.getElementById(tabName).classList.add('active');
}
// Use recent transfer
function useRecentTransfer(account, bank) {
  accountNumberInput.value = account;
  selectedBankEl.textContent = bank;
  bankSelect.classList.add('auto-selected');
  showNotification("Recent transfer applied");
  checkFormValidity();
}
// Load recent transactions from localStorage
function loadRecentTransactions() {
  const user = JSON.parse(localStorage.getItem("kudiratUser") || "{}");
  const transactions = user.transactions || [];
  
  // Clear existing items
  recentList.innerHTML = "";
  
  // Filter for bank transfers and sort by date (most recent first)
  const bankTransfers = transactions
    .filter(tx => tx.type === "Transfer to Bank")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3); // Show only the 3 most recent
  
  if (bankTransfers.length === 0) {
    recentList.innerHTML = '<li class="empty">No recent transfers</li>';
    return;
  }
  
  bankTransfers.forEach(tx => {
    const li = document.createElement("li");
    li.onclick = () => useRecentTransfer(tx.account, tx.bank);
    
    li.innerHTML = `
      <div class="recent-header">
        <div class="recent-name">${tx.recipient}</div>
        <div class="recent-amount">₦${tx.amount.toLocaleString()}</div>
        <i class="fa fa-star favorite-icon ${tx.isFavorite ? 'active' : ''}" 
           onclick="event.stopPropagation(); toggleFavorite('${tx.account}', '${tx.bank}')"></i>
      </div>
      <div class="recent-details">${tx.account} ${tx.bank}</div>
    `;
    
    recentList.appendChild(li);
  });
}
// Load favorite transactions from localStorage
function loadFavoriteTransactions() {
  const user = JSON.parse(localStorage.getItem("kudiratUser") || "{}");
  const transactions = user.transactions || [];
  
  // Clear existing items
  favoritesList.innerHTML = "";
  
  // Filter for bank transfers marked as favorites
  const favoriteTransfers = transactions
    .filter(tx => tx.type === "Transfer to Bank" && tx.isFavorite);
  
  if (favoriteTransfers.length === 0) {
    favoritesList.innerHTML = '<li class="empty">No favorites yet</li>';
    return;
  }
  
  favoriteTransfers.forEach(tx => {
    const li = document.createElement("li");
    li.onclick = () => useRecentTransfer(tx.account, tx.bank);
    
    li.innerHTML = `
      <div class="favorites-header">
        <div class="favorites-name">${tx.recipient}</div>
        <div class="favorites-amount">₦${tx.amount.toLocaleString()}</div>
        <i class="fa fa-star favorite-icon active" 
           onclick="event.stopPropagation(); toggleFavorite('${tx.account}', '${tx.bank}')"></i>
      </div>
      <div class="favorites-details">${tx.account} ${tx.bank}</div>
    `;
    
    favoritesList.appendChild(li);
  });
}
// Toggle favorite status
function toggleFavorite(account, bank) {
  const user = JSON.parse(localStorage.getItem("kudiratUser") || "{}");
  let users = JSON.parse(localStorage.getItem("kudiratUsers") || "[]");
  
  // Find the transaction
  const transaction = user.transactions.find(
    tx => tx.type === "Transfer to Bank" && 
         tx.account === account && 
         tx.bank === bank
  );
  
  if (transaction) {
    transaction.isFavorite = !transaction.isFavorite;
    
    // Update in users array
    const currentUserIndex = users.findIndex(u => u.phone === user.phone);
    if (currentUserIndex !== -1) {
      users[currentUserIndex] = user;
      localStorage.setItem("kudiratUsers", JSON.stringify(users));
      localStorage.setItem("kudiratUser", JSON.stringify(user));
      
      // Reload the lists
      loadRecentTransactions();
      loadFavoriteTransactions();
      
      showNotification(
        transaction.isFavorite ? "Added to favorites" : "Removed from favorites"
      );
    }
  }
}
// Detect bank from account number using optimized lookup map
function detectBank(accountNumber) {
  // Try to match the longest code first (some codes are 5 digits, some 3)
  for (let len = 5; len >= 3; len--) {
    const prefix = accountNumber.substring(0, len);
    if (bankCodeMap[prefix]) {
      return bankCodeMap[prefix];
    }
  }
  return null;
}
// Check if form is valid for verification
function checkFormValidity() {
  const bank = selectedBankEl.textContent;
  const account = accountNumberInput.value;
  
  if(bank !== "Select Bank" && account.length === 10) {
    verifyBtn.disabled = false;
  } else {
    verifyBtn.disabled = true;
  }
}
// Account number input handler
accountNumberInput.addEventListener('input', function() {
  // Remove non-numeric characters
  this.value = this.value.replace(/\D/g, '');
  
  // Limit to 10 digits
  if (this.value.length > 10) {
    this.value = this.value.substring(0, 10);
  }
  
  // Only auto-detect bank if no bank has been manually selected
  if (!bankSelect.classList.contains('auto-selected') && this.value.length === 10) {
    const detectedBank = detectBank(this.value);
    if (detectedBank) {
      selectedBankEl.textContent = detectedBank;
      bankSelect.classList.add('auto-selected');
      bankDetection.style.display = 'flex';
      detectedBankText.textContent = `Bank detected: ${detectedBank}`;
      showNotification(`Bank automatically detected: ${detectedBank}`);
    } else {
      bankSelect.classList.remove('auto-selected');
      bankDetection.style.display = 'none';
    }
  } else if (this.value.length < 10) {
    // Only clear if not manually selected
    if (!bankSelect.classList.contains('auto-selected')) {
      bankSelect.classList.remove('auto-selected');
      bankDetection.style.display = 'none';
    }
  }
  
  checkFormValidity();
});
// Verify button click handler
verifyBtn.addEventListener("click", () => {
  const bank = selectedBankEl.textContent;
  const account = accountNumberInput.value;
  
  // Move to step 2
  step1.classList.remove('active');
  step2.classList.add('active');
  
  // Show loading state
  accountNameConfirm.innerHTML = `
    <div class="loading">
      <span class="loading"></span>
      <span>Verifying account details...</span>
    </div>
  `;
  
  // Simulate API call to get account name
  setTimeout(() => {
    const accountName = mockAccountNames[account] || "ACCOUNT HOLDER";
    
    // Show account name confirmation
    accountNameConfirm.innerHTML = `
      <div class="name">${accountName}</div>
      <div class="account">${account} • ${bank}</div>
    `;
    
    // Show amount input
    amountGroup.style.display = "block";
    nextBtn.style.display = "flex";
    
    // Store transfer data
    transferData = { bank, account, accountName };
  }, 1500);
});
// Next button click handler (after account verification)
nextBtn.addEventListener("click", () => {
  const amount = amountInput.value;
  
  if(!amount || parseFloat(amount) <= 0) {
    showNotification("Please enter a valid amount");
    return;
  }
  
  transferData.amount = amount;
  
  // Get current user balance
  const currentUser = JSON.parse(localStorage.getItem("kudiratUser") || "{}");
  
  // Show confirmation popup with balance
  summary.innerHTML = `
    <p><span>Current Balance:</span> <span>₦${currentUser.balance.toLocaleString()}</span></p>
    <p><span>Recipient:</span> <span>${transferData.accountName}</span></p>
    <p><span>Account:</span> <span>${transferData.account} • ${transferData.bank}</span></p>
    <p><span>Amount:</span> <span>₦${parseFloat(amount).toLocaleString()}</span></p>
  `;
  confirmPopup.classList.add("show");
});
function closePopup(){ 
  confirmPopup.classList.remove("show");
}
function openPinModal(){
  confirmPopup.classList.remove("show");
  pinModal.classList.add("show");
  // Focus first PIN input
  setTimeout(() => {
    pinModal.querySelector('input').focus();
  }, 300);
}
function closePinModal(){ 
  pinModal.classList.remove("show");
  // Clear PIN inputs
  pinModal.querySelectorAll('input').forEach(input => input.value = '');
}
async function verifyPin(){
  const pinInputs = pinModal.querySelectorAll("input");
  const pin = Array.from(pinInputs).map(i => i.value).join("");
  const user = JSON.parse(localStorage.getItem("kudiratUser") || "{}");
  
  if(pin.length !== 4){
    showNotification("Enter 4-digit PIN");
    return;
  }
  
  // Fixed PIN verification with trimming and string conversion
  if(pin.trim() !== String(user.pin).trim()){
    showNotification("Incorrect PIN");
    // Clear PIN inputs
    pinInputs.forEach(input => input.value = '');
    pinInputs[0].focus();
    return;
  }
  
  // Show loading state
  const btn = pinModal.querySelector('.btn');
  const originalContent = btn.innerHTML;
  btn.innerHTML = '<span class="loading"></span> Processing...';
  btn.disabled = true;
  
  // Generate reference number
  const reference = generateReference();
  
  // Simulate processing delay after PIN verification (1.5-3 seconds)
  await paymentGateway.delay(1500 + Math.random() * 1500);
  
  // Call payment gateway
  const gatewayPayload = {
    sourceAccount: user.phone,
    destinationAccount: transferData.account,
    amount: parseFloat(transferData.amount),
    currency: "NGN",
    reference
  };
  
  const gatewayResponse = await paymentGateway.initiateTransfer(gatewayPayload);
  
  // Process gateway response
  if (gatewayResponse.status === "success") {
    const gatewayStatus = gatewayResponse.data.status;
    
    if (gatewayStatus === "success") {
      // Log transaction
      let users = JSON.parse(localStorage.getItem("kudiratUsers") || "[]");
      let currentUser = users.find(u => u.phone === user.phone);
      
      if(currentUser.balance < parseFloat(transferData.amount)){
        showNotification("Insufficient balance");
        btn.innerHTML = originalContent;
        btn.disabled = false;
        return;
      }
      
      currentUser.balance -= parseFloat(transferData.amount);
      
      const tx = {
        type: "Transfer to Bank",
        recipient: transferData.accountName,
        bank: transferData.bank,
        account: transferData.account,
        amount: parseFloat(transferData.amount),
        date: new Date().toISOString(),
        status: "Successful",
        reference: reference,
        isFavorite: false
      };
      
      currentUser.transactions = currentUser.transactions || [];
      currentUser.transactions.push(tx);
      
      localStorage.setItem("kudiratUsers", JSON.stringify(users));
      localStorage.setItem("kudiratUser", JSON.stringify(currentUser));
      
      // Send success notification to recipient
      const message = `You've received ₦${parseFloat(transferData.amount).toLocaleString()} from ${user.name}. Ref: ${reference}`;
      await notificationService.sendNotification(transferData.account, message);
      
      // Reload the recent and favorite transactions
      loadRecentTransactions();
      loadFavoriteTransactions();
      
      // Show success screen
      closePinModal();
      successText.textContent = `₦${parseFloat(transferData.amount).toLocaleString()} sent to ${transferData.accountName} (${transferData.account}). Reference: ${reference}`;
      successScreen.style.display = "flex";
      
      // Auto redirect after delay
      setTimeout(() => { 
        window.location.href = "dashboard.html"; 
      }, 3000);
      
    } else if (gatewayStatus === "pending") {
      // Log transaction as pending
      let users = JSON.parse(localStorage.getItem("kudiratUsers") || "[]");
      let currentUser = users.find(u => u.phone === user.phone);
      
      const tx = {
        type: "Transfer to Bank",
        recipient: transferData.accountName,
        bank: transferData.bank,
        account: transferData.account,
        amount: parseFloat(transferData.amount),
        date: new Date().toISOString(),
        status: "Pending",
        reference: reference,
        isFavorite: false
      };
      
      currentUser.transactions = currentUser.transactions || [];
      currentUser.transactions.push(tx);
      
      localStorage.setItem("kudiratUsers", JSON.stringify(users));
      localStorage.setItem("kudiratUser", JSON.stringify(currentUser));
      
      // Send pending notification to recipient
      const message = `A transfer of ₦${parseFloat(transferData.amount).toLocaleString()} from ${user.name} is being processed. Ref: ${reference}`;
      await notificationService.sendNotification(transferData.account, message);
      
      // Reload the recent and favorite transactions
      loadRecentTransactions();
      loadFavoriteTransactions();
      
      // Show success screen with pending status
      closePinModal();
      successText.textContent = `₦${parseFloat(transferData.amount).toLocaleString()} sent to ${transferData.accountName} (${transferData.account}). Reference: ${reference} (Status: Pending)`;
      successScreen.style.display = "flex";
      
      // Auto redirect after delay
      setTimeout(() => { 
        window.location.href = "dashboard.html"; 
      }, 3000);
    }
  } else {
    // Handle failed transfer
    const errorMessage = gatewayResponse.message || "Unknown error";
    
    // Log failed transaction
    let users = JSON.parse(localStorage.getItem("kudiratUsers") || "[]");
    let currentUser = users.find(u => u.phone === user.phone);
    
    const tx = {
      type: "Transfer to Bank",
      recipient: transferData.accountName,
      bank: transferData.bank,
      account: transferData.account,
      amount: parseFloat(transferData.amount),
      date: new Date().toISOString(),
      status: "Failed",
      reference: reference,
      isFavorite: false,
      failureReason: errorMessage
    };
    
    currentUser.transactions = currentUser.transactions || [];
    currentUser.transactions.push(tx);
    
    localStorage.setItem("kudiratUsers", JSON.stringify(users));
    localStorage.setItem("kudiratUser", JSON.stringify(currentUser));
    
    // Send failure notification to recipient
    const message = `A transfer of ₦${parseFloat(transferData.amount).toLocaleString()} from ${user.name} failed. Ref: ${reference}`;
    await notificationService.sendNotification(transferData.account, message);
    
    // Reload the recent and favorite transactions
    loadRecentTransactions();
    loadFavoriteTransactions();
    
    // Show error
    showNotification(`Transfer failed: ${errorMessage}. Reference: ${reference}`);
    btn.innerHTML = originalContent;
    btn.disabled = false;
  }
}
// PIN input handling with validation
const pinInputs = pinModal.querySelectorAll("input");
pinInputs.forEach((input, index) => {
  input.addEventListener("input", (e) => {
    // Only allow digits
    e.target = e.target.replace(/[^0-9]/g, '');
    
    if(e.target.length === 1 && index < pinInputs.length - 1) {
      pinInputs[index + 1].focus();
    }
  });
  
  input.addEventListener("keydown", (e) => {
    if(e.key === "Backspace") {
      if(this.value.length === 0 && index > 0) {
        pinInputs[index - 1].focus();
      }
    }
  });
});
// Bank selection modal
const PAGE_SIZE = 60;
const state = {
  allRows: [],
  filtered: [],
  page: 1
};
// Make functions globally accessible
window.openBankModal = openBankModal;
window.closeBankModal = closeBankModal;
window.cancelBankSelection = cancelBankSelection;
window.closePopup = closePopup;
window.openPinModal = openPinModal;
window.closePinModal = closePinModal;
window.verifyPin = verifyPin;
function openBankModal(){
  bankSelected = false; // Reset selection status when opening modal
  bankModal.classList.add("show");
  bankBackdrop.classList.add("show");
  bankSearch.focus();
  
  // Reset filters
  bankSearch.value = "";
  countryFilter.value = "";
  
  // Load banks if not already loaded
  if (state.allRows.length === 0) {
    loadBanks();
  } else {
    // If banks are already loaded, reset filters and render
    applyFilters(); // This will reset the filtered list and render
  }
}
function closeBankModal(){
  // Always close the modal regardless of selection
  bankModal.classList.remove("show");
  bankBackdrop.classList.remove("show");
  bankSearch.value = "";
  countryFilter.value = "";
  applyFilters();
  checkFormValidity();
}
function cancelBankSelection(){
  // Reset bank selection when canceling
  selectedBankEl.textContent = "Select Bank";
  bankSelect.classList.remove('auto-selected');
  bankSelected = true; // Allow closing
  closeBankModal();
}
function flatten(data){
  const rows = [];
  data.countries.forEach(c=>{
    console.log(`Processing country: ${c.country} with ${c.banks.length} banks`);
    (c.banks||[]).forEach(b=>{
      rows.push({
        country: c.country,
        name: b.name,
        domain: b.domain || "",
        code: b.code || ""
      });
    });
  });
  console.log(`Total banks after flattening: ${rows.length}`);
  return rows;
}
function initials(name){
  return name.split(/\s+/).slice(0,2).map(w=>w[0]?.toUpperCase()||"").join("");
}
function logoUrl(domain){
  if(!domain) return "";
  
  try {
    // Validate domain format
    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(domain)) {
      return "";
    }
    return `https://logo.clearbit.com/${domain}`;
  } catch (e) {
    return "";
  }
}
function buildCountryFilter(rows){
  const countries = [...new Set(rows.map(r=>r.country))].sort();
  console.log("Countries found:", countries);
  countryFilter.innerHTML = `<option value="">All countries</option>` + 
    countries.map(c=>`<option value="${c}">${c}</option>`).join("");
}
// Improved search function
function applyFilters(){
  const q = bankSearch.value.trim().toLowerCase();
  const ctry = countryFilter.value;
  let list = state.allRows;
  if(ctry) list = list.filter(r=>r.country===ctry);
  if(q){
    list = list.filter(r => {
      // Search in name, country, and code
      const nameMatch = r.name.toLowerCase().includes(q);
      const countryMatch = r.country.toLowerCase().includes(q);
      const codeMatch = r.code && r.code.toLowerCase().includes(q);
      
      // Also check for common variations
      const variations = ['opay', 'opera', 'opay digital', 'opay microfinance'];
      const variationMatch = variations.some(var => 
        r.name.toLowerCase().includes(var) || 
        (r.code && r.code.toLowerCase().includes(var))
      );
      
      return nameMatch || countryMatch || codeMatch || variationMatch;
    });
  }
  state.filtered = list;
  state.page = 1;
  renderPage();
}
function renderPage(){
  const start = (state.page-1)*PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const slice = state.filtered.slice(start,end);
  bankList.innerHTML = "";
  
  // If no banks found, show a message
  if (state.filtered.length === 0) {
    bankList.innerHTML = `<div class="empty">No banks found. Try a different search term.</div>`;
    return;
  }
  
  if(slice.length === 0){
    bankList.innerHTML = `<div class="empty">No banks found on this page.</div>`;
  } else {
    slice.forEach(r=>{
      const item = document.createElement("div");
      item.className = "bank-item";
      item.setAttribute('data-bank-name', r.name);
      
      const logoContainer = document.createElement("div");
      logoContainer.className = "bank-logo";
      
      const url = logoUrl(r.domain);
      if(url){
        const img = document.createElement("img");
        img.src = url;
        img.alt = r.name;
        img.className = "bank-logo";
        img.onerror = function(){
          this.replaceWith(makeInitialsNode(r.name));
        };
        logoContainer.appendChild(img);
      } else {
        logoContainer.appendChild(makeInitialsNode(r.name));
      }
      
      item.appendChild(logoContainer);
      
      const meta = document.createElement("div");
      meta.className = "bank-meta";
      meta.innerHTML = `<div class="bank-name">${r.name}</div><div class="bank-country">${r.country}${r.code?` • ${r.code}`:""}</div>`;
      item.appendChild(meta);
      
      bankList.appendChild(item);
    });
  }
  
  const totalPages = Math.max(1, Math.ceil(state.filtered.length / PAGE_SIZE));
  prevPage.disabled = state.page<=1;
  nextPage.disabled = state.page>=totalPages;
  pageInfo.textContent = `Page ${state.page} / ${totalPages} • ${state.filtered.length} banks`;
}
function makeInitialsNode(name){
  const span = document.createElement("div");
  span.className = "bank-logo";
  span.textContent = initials(name);
  return span;
}
prevPage.addEventListener("click", ()=>{
  if(state.page>1){ state.page--; renderPage(); }
});
nextPage.addEventListener("click", ()=>{
  const totalPages = Math.ceil(state.filtered.length / PAGE_SIZE);
  if(state.page<totalPages){ state.page++; renderPage(); }
});
bankSearch.addEventListener("input", applyFilters);
countryFilter.addEventListener("change", applyFilters);
// Add event delegation for bank selection
bankList.addEventListener('click', function(e) {
  const bankItem = e.target.closest('.bank-item');
  if (bankItem) {
    const bankName = bankItem.getAttribute('data-bank-name');
    selectedBankEl.textContent = bankName;
    bankSelect.classList.add('auto-selected');
    bankSelected = true; // Mark as selected
    closeBankModal();
    showNotification(`Selected: ${bankName}`);
    checkFormValidity();
  }
});
// Fixed loadBanks function to ensure proper initialization
async function loadBanks(){
  try {
    // Add loading state
    bankList.innerHTML = '<div class="loading">Loading banks...</div>';
    
    // First, load the inline data immediately
    state.allRows = flatten(INLINE_STARTER);
    console.log("Loaded inline banks:", state.allRows.length);
    
    // Build country filter and render page with inline data
    buildCountryFilter(state.allRows);
    state.filtered = state.allRows.slice();
    renderPage();
    
    // Then try to fetch external data to update if available
    try {
      const res = await fetch("banks-africa.json", { cache: "no-store" });
      if(res.ok) {
        let data = await res.json();
        
        // Ensure OPay is included in the data
        let opayFound = false;
        data.countries.forEach(country => {
          if (country.banks) {
            country.banks.forEach(bank => {
              if (bank.name.toLowerCase().includes("opay")) {
                opayFound = true;
              }
            });
          }
        });
        
        // If OPay is not found in the fetched data, add it
        if (!opayFound) {
          // Find Nigeria in the countries array
          let nigeriaIndex = data.countries.findIndex(c => c.country === "Nigeria");
          if (nigeriaIndex === -1) {
            // If Nigeria doesn't exist, add it
            data.countries.push({
              country: "Nigeria",
              banks: []
            });
            nigeriaIndex = data.countries.length - 1;
          }
          
          // Add OPay to Nigeria's banks
          data.countries[nigeriaIndex].banks.push({
            name: "OPay",
            domain: "opay.com",
            code: "50216"
          });
        }
        
        // Update with fetched data
        state.allRows = flatten(data);
        buildCountryFilter(state.allRows);
        state.filtered = state.allRows.slice();
        renderPage();
      }
    } catch (e) {
      console.log("Could not fetch external bank data, using inline data");
      // We already loaded the inline data above, so nothing more to do
    }
  } catch(e) {
    console.error("Error loading banks:", e);
    bankList.innerHTML = `<div class="empty">Error loading banks. Please try again.</div>`;
  }
}
// Format amount input
amountInput.addEventListener('input', function() {
  // Remove non-numeric characters
  this.value = this.value.replace(/[^\d.]/g, '');
  
  // Ensure only one decimal point
  const parts = this.value.split('.');
  if (parts.length > 2) {
    this.value = parts[0] + '.' + parts.slice(1).join('');
  }
  
  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    this.value = parts[0] + '.' + parts[1].substring(0, 2);
  }
});
// Setup all event listeners
function setupEventListeners() {
  // Cancel bank selection
  if (cancelBankBtn) {
    cancelBankBtn.addEventListener("click", cancelBankSelection);
  }
  
  // Close bank modal
  if (closeBankModalBtn) {
    closeBankModalBtn.addEventListener("click", closeBankModal);
  }
  
  // Close popup
  const closePopupBtn = document.getElementById("closePopup");
  if (closePopupBtn) {
    closePopupBtn.addEventListener("click", closePopup);
  }
  
  // Confirm transfer
  const confirmTransferBtn = document.getElementById("confirmTransferBtn");
  if (confirmTransferBtn) {
    confirmTransferBtn.addEventListener("click", openPinModal);
  }
  
  // Close PIN modal
  const closePinModalBtn = document.getElementById("closePinModal");
  if (closePinModalBtn) {
    closePinModalBtn.addEventListener("click", closePinModal);
  }
  
  // Verify PIN
  const verifyPinBtn = document.getElementById("verifyPinBtn");
  if (verifyPinBtn) {
    verifyPinBtn.addEventListener("click", verifyPin);
  }
  
  // Bank backdrop click
  if (bankBackdrop) {
    bankBackdrop.addEventListener("click", closeBankModal);
  }
}
// Initialize app
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme icon on page load
  updateThemeIcon();
  
  // Load banks on page load
  loadBanks();
  
  // Load recent and favorite transactions
  loadRecentTransactions();
  loadFavoriteTransactions();
  
  // Add event listener to bank select element
  bankSelect.addEventListener("click", openBankModal);
  
  // Setup all event listeners
  setupEventListeners();
  
  // Transaction History Navigation
  document.querySelectorAll('.view-all button').forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.closest('.tab-content').id;
      if (tabName === 'recents') {
        window.location.href = 'transaction.html?type=recent';
      } else {
        window.location.href = 'transaction.html?type=favorites';
      }
    });
  });
});