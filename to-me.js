// to-bank.js
document.addEventListener('DOMContentLoaded', function() {
  // Theme Management
  const ThemeManager = {
    init() {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      this.applyTheme(savedTheme);
    },
    
    applyTheme(theme) {
      if (theme === 'light') {
        document.body.classList.add('light');
      } else {
        document.body.classList.remove('light');
      }
      localStorage.setItem('theme', theme);
    },
    
    toggle() {
      const currentTheme = document.body.classList.contains('light') ? 'light' : 'dark';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(newTheme);
    }
  };

  // Initialize theme
  ThemeManager.init();

  // DOM Elements
  const elements = {
    // Domestic transfer elements
    accountNumber: document.getElementById('accountNumber'),
    bankSelect: document.getElementById('bankSelect'),
    selectedBank: document.getElementById('selectedBank'),
    verifyBtn: document.getElementById('verifyBtn'),
    accountNameConfirm: document.getElementById('accountNameConfirm'),
    amountGroup: document.getElementById('amountGroup'),
    amount: document.getElementById('amount'),
    nextBtn: document.getElementById('nextBtn'),
    bankDetection: document.getElementById('bankDetection'),
    detectedBankText: document.getElementById('detectedBankText'),
    
    // International transfer elements
    recipientCountry: document.getElementById('recipientCountry'),
    recipientCurrency: document.getElementById('recipientCurrency'),
    recipientBank: document.getElementById('recipientBank'),
    recipientAccount: document.getElementById('recipientAccount'),
    recipientName: document.getElementById('recipientName'),
    validateIntBtn: document.getElementById('validateIntBtn'),
    intAccountConfirm: document.getElementById('intAccountConfirm'),
    confirmedRecipientName: document.getElementById('confirmedRecipientName'),
    confirmedAccountDetails: document.getElementById('confirmedAccountDetails'),
    intAmountGroup: document.getElementById('intAmountGroup'),
    intAmount: document.getElementById('intAmount'),
    exchangeDisplay: document.getElementById('exchangeDisplay'),
    exchangeRate: document.getElementById('exchangeRate'),
    transferFee: document.getElementById('transferFee'),
    recipientGets: document.getElementById('recipientGets'),
    intContinueBtn: document.getElementById('intContinueBtn'),
    
    // Common elements
    confirmPopup: document.getElementById('confirmPopup'),
    closePopup: document.getElementById('closePopup'),
    summary: document.getElementById('summary'),
    confirmTransferBtn: document.getElementById('confirmTransferBtn'),
    pinModal: document.getElementById('pinModal'),
    closePinModal: document.getElementById('closePinModal'),
    verifyPinBtn: document.getElementById('verifyPinBtn'),
    successScreen: document.getElementById('successScreen'),
    successText: document.getElementById('successText'),
    notification: document.getElementById('notification'),
    
    // Bank modal elements
    bankModal: document.getElementById('bankModal'),
    bankBackdrop: document.getElementById('bankBackdrop'),
    bankList: document.getElementById('bankList'),
    bankSearch: document.getElementById('bankSearch'),
    countryFilter: document.getElementById('countryFilter'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    closeBankModal: document.getElementById('closeBankModal'),
    cancelBankBtn: document.getElementById('cancelBankBtn')
  };

  // Expanded bank data - African and International banks
  const banks = [
    // Nigerian Banks
    { id: 1, name: 'Access Bank', code: '044', country: 'Nigeria', swift: 'ABNGNGLA', type: 'commercial' },
    { id: 2, name: 'Zenith Bank', code: '057', country: 'Nigeria', swift: 'ZEIBNGLA', type: 'commercial' },
    { id: 3, name: 'Guaranty Trust Bank', code: '058', country: 'Nigeria', swift: 'GTBINGLA', type: 'commercial' },
    { id: 4, name: 'First Bank of Nigeria', code: '011', country: 'Nigeria', swift: 'FMBINGLA', type: 'commercial' },
    { id: 5, name: 'United Bank for Africa', code: '033', country: 'Nigeria', swift: 'UNAFNGLA', type: 'commercial' },
    { id: 6, name: 'Ecobank Nigeria', code: '050', country: 'Nigeria', swift: 'ECOCNGLA', type: 'commercial' },
    { id: 7, name: 'Wema Bank', code: '035', country: 'Nigeria', swift: 'WEMANGLA', type: 'commercial' },
    { id: 8, name: 'Sterling Bank', code: '232', country: 'Nigeria', swift: 'SBNIGNGL', type: 'commercial' },
    { id: 9, name: 'Fidelity Bank', code: '070', country: 'Nigeria', swift: 'FIDINGLA', type: 'commercial' },
    { id: 10, name: 'Union Bank', code: '032', country: 'Nigeria', swift: 'UNIONGLA', type: 'commercial' },
    
    // Ghanaian Banks
    { id: 11, name: 'GCB Bank', code: 'GH01', country: 'Ghana', swift: 'GCBIGHAC', type: 'commercial' },
    { id: 12, name: 'Ecobank Ghana', code: 'GH02', country: 'Ghana', swift: 'ECOCGHAC', type: 'commercial' },
    { id: 13, name: 'Standard Chartered Ghana', code: 'GH03', country: 'Ghana', swift: 'SCBLGHAC', type: 'international' },
    { id: 14, name: 'Barclays Ghana', code: 'GH04', country: 'Ghana', swift: 'BARBGHAC', type: 'international' },
    { id: 15, name: 'Zenith Bank Ghana', code: 'GH05', country: 'Ghana', swift: 'ZEIBGHAC', type: 'commercial' },
    
    // Kenyan Banks
    { id: 16, name: 'Equity Bank Kenya', code: 'KE01', country: 'Kenya', swift: 'EQBLKENA', type: 'commercial' },
    { id: 17, name: 'Kenya Commercial Bank', code: 'KE02', country: 'Kenya', swift: 'KCBLKENX', type: 'commercial' },
    { id: 18, name: 'Standard Chartered Kenya', code: 'KE03', country: 'Kenya', swift: 'SCBLKENX', type: 'international' },
    { id: 19, name: 'Cooperative Bank', code: 'KE04', country: 'Kenya', swift: 'KCOKENA', type: 'commercial' },
    { id: 20, name: 'NCBA Bank Kenya', code: 'KE05', country: 'Kenya', swift: 'NCBAKENA', type: 'commercial' },
    
    // South African Banks
    { id: 21, name: 'Standard Bank', code: 'ZA01', country: 'South Africa', swift: 'SBZAZAJJ', type: 'commercial' },
    { id: 22, name: 'Absa Bank', code: 'ZA02', country: 'South Africa', swift: 'ABSAZAJJ', type: 'commercial' },
    { id: 23, name: 'First National Bank', code: 'ZA03', country: 'South Africa', swift: 'FIRNZAJJ', type: 'commercial' },
    { id: 24, name: 'Nedbank', code: 'ZA04', country: 'South Africa', swift: 'NEDSZAJJ', type: 'commercial' },
    { id: 25, name: 'Capitec Bank', code: 'ZA05', country: 'South Africa', swift: 'CAPTZAJJ', type: 'commercial' },
    
    // Egyptian Banks
    { id: 26, name: 'National Bank of Egypt', code: 'EG01', country: 'Egypt', swift: 'NBEGEGCX', type: 'commercial' },
    { id: 27, name: 'Banque Misr', code: 'EG02', country: 'Egypt', swift: 'BMISEGCX', type: 'commercial' },
    { id: 28, name: 'Commercial International Bank', code: 'EG03', country: 'Egypt', swift: 'CIBEEGCX', type: 'commercial' },
    { id: 29, name: 'QNB Al Ahli', code: 'EG04', country: 'Egypt', swift: 'QNBAEGCX', type: 'international' },
    { id: 30, name: 'HSBC Egypt', code: 'EG05', country: 'Egypt', swift: 'HSBCEGCX', type: 'international' },
    
    // International Banks
    { id: 31, name: 'JP Morgan Chase', code: 'US01', country: 'United States', swift: 'CHASUS33', type: 'international' },
    { id: 32, name: 'Bank of America', code: 'US02', country: 'United States', swift: 'BOFAUS3N', type: 'international' },
    { id: 33, name: 'Citibank', code: 'US03', country: 'United States', swift: 'CITIUS33', type: 'international' },
    { id: 34, name: 'Wells Fargo', code: 'US04', country: 'United States', swift: 'WFBIUS6S', type: 'international' },
    { id: 35, name: 'Goldman Sachs', code: 'US05', country: 'United States', swift: 'GSBKUS33', type: 'international' },
    
    { id: 36, name: 'HSBC UK', code: 'GB01', country: 'United Kingdom', swift: 'HBUKGB4B', type: 'international' },
    { id: 37, name: 'Barclays UK', code: 'GB02', country: 'United Kingdom', swift: 'BARCGB22', type: 'international' },
    { id: 38, name: 'Lloyds Bank', code: 'GB03', country: 'United Kingdom', swift: 'LOYDGB2L', type: 'international' },
    { id: 39, name: 'NatWest', code: 'GB04', country: 'United Kingdom', swift: 'NWBKGB2L', type: 'international' },
    { id: 40, name: 'Standard Chartered UK', code: 'GB05', country: 'United Kingdom', swift: 'SCBLGB2L', type: 'international' },
    
    { id: 41, name: 'Deutsche Bank', code: 'DE01', country: 'Germany', swift: 'DEUTDEFF', type: 'international' },
    { id: 42, name: 'Commerzbank', code: 'DE02', country: 'Germany', swift: 'COBADEFF', type: 'international' },
    { id: 43, name: 'BNP Paribas', code: 'FR01', country: 'France', swift: 'BNPAFRPP', type: 'international' },
    { id: 44, name: 'Societe Generale', code: 'FR02', country: 'France', swift: 'SOGEFRPP', type: 'international' },
    { id: 45, name: 'UBS Switzerland', code: 'CH01', country: 'Switzerland', swift: 'UBSWCHZH80A', type: 'international' },
    
    { id: 46, name: 'Scotiabank', code: 'CA01', country: 'Canada', swift: 'NOSCCATT', type: 'international' },
    { id: 47, name: 'Royal Bank of Canada', code: 'CA02', country: 'Canada', swift: 'ROYCCAT2', type: 'international' },
    { id: 48, name: 'TD Canada Trust', code: 'CA03', country: 'Canada', swift: 'TDOMCATTTOR', type: 'international' },
    { id: 49, name: 'CIBC', code: 'CA04', country: 'Canada', swift: 'CIBCCATT', type: 'international' },
    { id: 50, name: 'BMO Bank of Montreal', code: 'CA05', country: 'Canada', swift: 'BOFMCAM2', type: 'international' },
    
    { id: 51, name: 'Commonwealth Bank', code: 'AU01', country: 'Australia', swift: 'CTBAAU2S', type: 'international' },
    { id: 52, name: 'ANZ Bank', code: 'AU02', country: 'Australia', swift: 'ANZBAU3M', type: 'international' },
    { id: 53, name: 'Westpac', code: 'AU03', country: 'Australia', swift: 'WPACAU2S', type: 'international' },
    { id: 54, name: 'NAB', code: 'AU04', country: 'Australia', swift: 'NATAAU33', type: 'international' },
    { id: 55, name: 'Macquarie Bank', code: 'AU05', country: 'Australia', swift: 'MQBLAU2B', type: 'international' },
    
    { id: 56, name: 'ICICI Bank', code: 'IN01', country: 'India', swift: 'ICICINBB', type: 'international' },
    { id: 57, name: 'State Bank of India', code: 'IN02', country: 'India', swift: 'SBININBB', type: 'international' },
    { id: 58, name: 'HDFC Bank', code: 'IN03', country: 'India', swift: 'HDFCINBB', type: 'international' },
    { id: 59, name: 'Axis Bank', code: 'IN04', country: 'India', swift: 'AXISINBB', type: 'international' },
    { id: 60, name: 'Punjab National Bank', code: 'IN05', country: 'India', swift: 'PUNBINBB', type: 'international' },
    
    { id: 61, name: 'Emirates NBD', code: 'AE01', country: 'UAE', swift: 'EBILAEAD', type: 'international' },
    { id: 62, name: 'First Abu Dhabi Bank', code: 'AE02', country: 'UAE', swift: 'NBADAEAA', type: 'international' },
    { id: 63, name: 'Mashreq Bank', code: 'AE03', country: 'UAE', swift: 'BOMLAEAD', type: 'international' },
    { id: 64, name: 'ADCB', code: 'AE04', country: 'UAE', swift: 'ADCBAEAA', type: 'international' },
    { id: 65, name: 'Dubai Islamic Bank', code: 'AE05', country: 'UAE', swift: 'DUBIAEAD', type: 'international' }
  ];

  // International exchange rates (mock data)
  const exchangeRates = {
    'USD': 0.00067,
    'GBP': 0.00053,
    'EUR': 0.00062,
    'CAD': 0.00091,
    'AUD': 0.00101,
    'INR': 0.056,
    'CNY': 0.0048,
    'AED': 0.0025,
    'GHS': 0.0072,
    'KES': 0.085,
    'ZAR': 0.012,
    'EGP': 0.032
  };

  // State
  let selectedBankData = null;
  let currentPage = 1;
  const itemsPerPage = 10;
  let filteredBanks = [...banks];

  // Initialize event listeners
  function initEventListeners() {
    // Domestic transfer events
    if (elements.accountNumber) {
      elements.accountNumber.addEventListener('input', handleAccountNumberInput);
    }
    
    if (elements.bankSelect) {
      elements.bankSelect.addEventListener('click', openBankModal);
    }
    
    if (elements.verifyBtn) {
      elements.verifyBtn.addEventListener('click', verifyDomesticAccount);
    }
    
    if (elements.nextBtn) {
      elements.nextBtn.addEventListener('click', showDomesticConfirmation);
    }
    
    // International transfer events
    if (elements.recipientCountry) {
      elements.recipientCountry.addEventListener('change', updateCurrencyOptions);
    }
    
    if (elements.intAmount) {
      elements.intAmount.addEventListener('input', calculateExchange);
    }
    
    if (elements.validateIntBtn) {
      elements.validateIntBtn.addEventListener('click', validateInternationalDetails);
    }
    
    if (elements.intContinueBtn) {
      elements.intContinueBtn.addEventListener('click', showInternationalConfirmation);
    }
    
    // Bank modal events
    if (elements.bankSearch) {
      elements.bankSearch.addEventListener('input', filterBanks);
    }
    
    if (elements.countryFilter) {
      elements.countryFilter.addEventListener('change', filterBanks);
    }
    
    if (elements.prevPage) {
      elements.prevPage.addEventListener('click', () => changePage(-1));
    }
    
    if (elements.nextPage) {
      elements.nextPage.addEventListener('click', () => changePage(1));
    }
    
    if (elements.closeBankModal) {
      elements.closeBankModal.addEventListener('click', closeBankModal);
    }
    
    if (elements.cancelBankBtn) {
      elements.cancelBankBtn.addEventListener('click', closeBankModal);
    }
    
    if (elements.bankBackdrop) {
      elements.bankBackdrop.addEventListener('click', closeBankModal);
    }
    
    // Common events
    if (elements.closePopup) {
      elements.closePopup.addEventListener('click', closeConfirmationPopup);
    }
    
    if (elements.closePinModal) {
      elements.closePinModal.addEventListener('click', closePinModal);
    }
    
    if (elements.verifyPinBtn) {
      elements.verifyPinBtn.addEventListener('click', verifyPin);
    }
  }

  // Domestic transfer functions
  function handleAccountNumberInput() {
    const accountNumber = elements.accountNumber.value;
    
    if (accountNumber.length === 10) {
      // Auto-detect bank based on account number prefix (mock logic)
      const bankPrefix = accountNumber.substring(0, 3);
      const detectedBank = banks.find(bank => bank.code === bankPrefix);
      
      if (detectedBank) {
        elements.selectedBank.textContent = `${detectedBank.name} (${detectedBank.country})`;
        elements.bankSelect.classList.add('auto-selected');
        elements.detectedBankText.textContent = `Bank detected: ${detectedBank.name}`;
        elements.bankDetection.style.display = 'flex';
        selectedBankData = detectedBank;
        elements.verifyBtn.disabled = false;
      } else {
        elements.verifyBtn.disabled = true;
      }
    } else {
      elements.verifyBtn.disabled = true;
      elements.bankDetection.style.display = 'none';
    }
  }

  function verifyDomesticAccount() {
    const accountNumber = elements.accountNumber.value;
    
    if (!accountNumber || !selectedBankData) {
      showNotification('Please enter a valid account number', 'error');
      return;
    }
    
    // Show loading state
    elements.accountNameConfirm.innerHTML = `
      <div class="loading">
        <span class="loading"></span>
        <span>Verifying account details...</span>
      </div>
    `;
    
    // Switch to step 2
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    
    // Simulate API call
    setTimeout(() => {
      // Mock account name
      const accountName = 'JOHN DOE';
      
      elements.accountNameConfirm.innerHTML = `
        <div class="name">${accountName}</div>
        <div class="account">${selectedBankData.name} (${selectedBankData.country}) • ${accountNumber}</div>
      `;
      
      elements.amountGroup.style.display = 'block';
      elements.nextBtn.style.display = 'flex';
      
      showNotification('Account verified successfully', 'success');
    }, 1500);
  }

  function showDomesticConfirmation() {
    const amount = parseFloat(elements.amount.value) || 0;
    
    if (amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    // Show confirmation popup
    elements.summary.innerHTML = `
      <p><span>Recipient:</span> <span>JOHN DOE</span></p>
      <p><span>Bank:</span> <span>${selectedBankData.name} (${selectedBankData.country})</span></p>
      <p><span>Account:</span> <span>${elements.accountNumber.value}</span></p>
      <p><span>Amount:</span> <span>₦${amount.toFixed(2)}</span></p>
      <p><span>Fee:</span> <span>₦50.00</span></p>
      <p><span>Total:</span> <span>₦${(amount + 50).toFixed(2)}</span></p>
    `;
    
    elements.confirmPopup.classList.add('show');
  }

  // International transfer functions
  function updateCurrencyOptions() {
    const country = elements.recipientCountry.value;
    elements.recipientCurrency.innerHTML = '<option value="">Select Currency</option>';
    
    // Add currency options based on country
    switch(country) {
      case 'US':
        elements.recipientCurrency.innerHTML += '<option value="USD">US Dollar (USD)</option>';
        break;
      case 'GB':
        elements.recipientCurrency.innerHTML += '<option value="GBP">British Pound (GBP)</option>';
        break;
      case 'CA':
        elements.recipientCurrency.innerHTML += '<option value="CAD">Canadian Dollar (CAD)</option>';
        break;
      case 'EU':
        elements.recipientCurrency.innerHTML += '<option value="EUR">Euro (EUR)</option>';
        break;
      case 'AU':
        elements.recipientCurrency.innerHTML += '<option value="AUD">Australian Dollar (AUD)</option>';
        break;
      case 'IN':
        elements.recipientCurrency.innerHTML += '<option value="INR">Indian Rupee (INR)</option>';
        break;
      case 'CN':
        elements.recipientCurrency.innerHTML += '<option value="CNY">Chinese Yuan (CNY)</option>';
        break;
      case 'AE':
        elements.recipientCurrency.innerHTML += '<option value="AED">UAE Dirham (AED)</option>';
        break;
      case 'GH':
        elements.recipientCurrency.innerHTML += '<option value="GHS">Ghanaian Cedi (GHS)</option>';
        break;
      case 'KE':
        elements.recipientCurrency.innerHTML += '<option value="KES">Kenyan Shilling (KES)</option>';
        break;
      case 'ZA':
        elements.recipientCurrency.innerHTML += '<option value="ZAR">South African Rand (ZAR)</option>';
        break;
      case 'EG':
        elements.recipientCurrency.innerHTML += '<option value="EGP">Egyptian Pound (EGP)</option>';
        break;
    }
  }

  function validateInternationalDetails() {
    const country = elements.recipientCountry.value;
    const currency = elements.recipientCurrency.value;
    const bank = elements.recipientBank.value;
    const account = elements.recipientAccount.value;
    const name = elements.recipientName.value;
    
    // Basic validation
    if (!country || !currency || !bank || !account || !name) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Simulate API validation
    showNotification('Validating recipient details...', 'info');
    
    setTimeout(() => {
      // Show confirmation
      elements.confirmedRecipientName.textContent = name;
      elements.confirmedAccountDetails.textContent = `${bank} • ${account}`;
      
      // Switch to step 2
      document.getElementById('intStep1').classList.remove('active');
      document.getElementById('intStep2').classList.add('active');
      elements.intAccountConfirm.style.display = 'block';
      elements.intAmountGroup.style.display = 'block';
      elements.intContinueBtn.style.display = 'flex';
      
      showNotification('Recipient details validated successfully', 'success');
    }, 1500);
  }

  function calculateExchange() {
    const amount = parseFloat(elements.intAmount.value) || 0;
    const currency = elements.recipientCurrency.value;
    
    if (amount <= 0 || !currency) return;
    
    const rate = exchangeRates[currency] || 0;
    const convertedAmount = amount * rate;
    const fee = 500; // Fixed fee in NGN
    
    // Update UI
    elements.exchangeRate.textContent = `1 NGN = ${rate} ${currency}`;
    elements.transferFee.textContent = `₦${fee.toFixed(2)}`;
    elements.recipientGets.textContent = `${convertedAmount.toFixed(2)} ${currency}`;
    
    // Show exchange display
    elements.exchangeDisplay.style.display = 'block';
  }

  function showInternationalConfirmation() {
    const amount = parseFloat(elements.intAmount.value) || 0;
    const currency = elements.recipientCurrency.value;
    const name = elements.recipientName.value;
    const account = elements.recipientAccount.value;
    
    if (amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    // Calculate final values
    const rate = exchangeRates[currency] || 0;
    const convertedAmount = amount * rate;
    const fee = 500;
    
    // Update summary
    elements.summary.innerHTML = `
      <p><span>Recipient:</span> <span>${name}</span></p>
      <p><span>Account:</span> <span>${account}</span></p>
      <p><span>You Send:</span> <span>₦${amount.toFixed(2)}</span></p>
      <p><span>Exchange Rate:</span> <span>1 NGN = ${rate} ${currency}</span></p>
      <p><span>Fee:</span> <span>₦${fee.toFixed(2)}</span></p>
      <p><span>Recipient Gets:</span> <span>${convertedAmount.toFixed(2)} ${currency}</span></p>
    `;
    
    // Show popup
    elements.confirmPopup.classList.add('show');
  }

  // Bank modal functions
  function openBankModal() {
    elements.bankModal.classList.add('show');
    elements.bankBackdrop.classList.add('show');
    populateCountryFilter();
    renderBankList();
  }

  function closeBankModal() {
    elements.bankModal.classList.remove('show');
    elements.bankBackdrop.classList.remove('show');
  }

  function populateCountryFilter() {
    // Get unique countries from banks
    const countries = [...new Set(banks.map(bank => bank.country))];
    
    elements.countryFilter.innerHTML = '<option value="">All countries</option>';
    countries.forEach(country => {
      elements.countryFilter.innerHTML += `<option value="${country}">${country}</option>`;
    });
  }

  function filterBanks() {
    const searchTerm = elements.bankSearch.value.toLowerCase();
    const countryFilter = elements.countryFilter.value;
    
    filteredBanks = banks.filter(bank => {
      const matchesSearch = bank.name.toLowerCase().includes(searchTerm) || 
                           bank.swift.toLowerCase().includes(searchTerm);
      const matchesCountry = !countryFilter || bank.country === countryFilter;
      return matchesSearch && matchesCountry;
    });
    
    currentPage = 1;
    renderBankList();
  }

  function renderBankList() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedBanks = filteredBanks.slice(startIndex, endIndex);
    
    if (paginatedBanks.length === 0) {
      elements.bankList.innerHTML = '<div class="empty">No banks found</div>';
    } else {
      elements.bankList.innerHTML = paginatedBanks.map(bank => {
        const typeIcon = bank.type === 'international' ? '🌐' : '🏦';
        return `
          <div class="bank-item" data-id="${bank.id}">
            <div class="bank-logo">${typeIcon}</div>
            <div class="bank-meta">
              <div class="bank-name">${bank.name}</div>
              <div class="bank-country">${bank.country} • ${bank.swift}</div>
            </div>
          </div>
        `;
      }).join('');
      
      // Add click event to bank items
      document.querySelectorAll('.bank-item').forEach(item => {
        item.addEventListener('click', function() {
          const bankId = parseInt(this.getAttribute('data-id'));
          const bank = banks.find(b => b.id === bankId);
          selectBank(bank);
        });
      });
    }
    
    // Update pagination
    updatePagination();
  }

  function updatePagination() {
    const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
    elements.pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    elements.prevPage.disabled = currentPage === 1;
    elements.nextPage.disabled = currentPage === totalPages || totalPages === 0;
  }

  function changePage(direction) {
    const totalPages = Math.ceil(filteredBanks.length / itemsPerPage);
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
      currentPage = newPage;
      renderBankList();
    }
  }

  function selectBank(bank) {
    selectedBankData = bank;
    elements.selectedBank.textContent = `${bank.name} (${bank.country})`;
    elements.bankSelect.classList.add('auto-selected');
    closeBankModal();
    
    // Enable verify button if account number is valid
    if (elements.accountNumber.value.length === 10) {
      elements.verifyBtn.disabled = false;
    }
  }

  // Common functions
  function closeConfirmationPopup() {
    elements.confirmPopup.classList.remove('show');
  }

  function showPinModal() {
    elements.pinModal.classList.add('show');
    
    // Setup PIN inputs
    const pinInputs = elements.pinModal.querySelectorAll('.pin-inputs input');
    pinInputs.forEach((input, index) => {
      input.value = '';
      input.addEventListener('input', function() {
        if (this.value.length === 1 && index < pinInputs.length - 1) {
          pinInputs[index + 1].focus();
        }
      });
      
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value === '' && index > 0) {
          pinInputs[index - 1].focus();
        }
      });
    });
  }

  function closePinModal() {
    elements.pinModal.classList.remove('show');
  }

  function verifyPin() {
    // Get PIN value
    const pinInputs = elements.pinModal.querySelectorAll('.pin-inputs input');
    let pin = '';
    pinInputs.forEach(input => {
      pin += input.value;
    });
    
    if (pin.length !== 4) {
      showNotification('Please enter a complete 4-digit PIN', 'error');
      return;
    }
    
    // Simulate PIN verification
    closePinModal();
    processTransfer();
  }

  function processTransfer() {
    showNotification('Processing transfer...', 'info');
    
    // Determine if it's domestic or international
    const isInternational = document.getElementById('internationalOption').classList.contains('active');
    
    // Simulate processing
    setTimeout(() => {
      // Show success screen
      let successMessage = '';
      
      if (isInternational) {
        const amount = parseFloat(elements.intAmount.value) || 0;
        const currency = elements.recipientCurrency.value;
        const name = elements.recipientName.value;
        successMessage = `₦${amount.toFixed(2)} has been sent to ${name}. The transfer should arrive within 1-3 business days.`;
      } else {
        const amount = parseFloat(elements.amount.value) || 0;
        successMessage = `₦${amount.toFixed(2)} has been sent successfully. The recipient should receive the funds instantly.`;
      }
      
      elements.successText.textContent = successMessage;
      elements.successScreen.style.display = 'flex';
      
      // Reset form after delay
      setTimeout(() => {
        elements.successScreen.style.display = 'none';
        if (isInternational) {
          resetInternationalForm();
        } else {
          resetDomesticForm();
        }
      }, 5000);
    }, 2000);
  }

  function resetDomesticForm() {
    elements.accountNumber.value = '';
    elements.selectedBank.textContent = 'Select Bank';
    elements.bankSelect.classList.remove('auto-selected');
    elements.amount.value = '';
    elements.verifyBtn.disabled = true;
    elements.bankDetection.style.display = 'none';
    
    // Reset steps
    document.getElementById('step1').classList.add('active');
    document.getElementById('step2').classList.remove('active');
    elements.amountGroup.style.display = 'none';
    elements.nextBtn.style.display = 'none';
  }

  function resetInternationalForm() {
    elements.recipientCountry.value = '';
    elements.recipientCurrency.value = '';
    elements.recipientBank.value = '';
    elements.recipientAccount.value = '';
    elements.recipientName.value = '';
    elements.intAmount.value = '';
    
    // Reset steps
    document.getElementById('intStep1').classList.add('active');
    document.getElementById('intStep2').classList.remove('active');
    elements.intAccountConfirm.style.display = 'none';
    elements.intAmountGroup.style.display = 'none';
    elements.exchangeDisplay.style.display = 'none';
    elements.intContinueBtn.style.display = 'none';
  }

  function showNotification(message, type = 'info') {
    elements.notification.textContent = message;
    elements.notification.classList.add('show');
    
    // Set color based on type
    switch(type) {
      case 'success':
        elements.notification.style.background = 'var(--accent)';
        break;
      case 'error':
        elements.notification.style.background = '#e74c3c';
        break;
      default:
        elements.notification.style.background = 'var(--bg-card)';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
      elements.notification.classList.remove('show');
    }, 3000);
  }

  // Initialize the application
  function init() {
    initEventListeners();
    
    // Load recent transactions (mock data)
    const recentTransactions = [
      { name: 'Jane Smith', bank: 'Access Bank (Nigeria)', account: '0123456789', amount: 15000, date: 'Today' },
      { name: 'Robert Johnson', bank: 'Zenith Bank (Nigeria)', account: '9876543210', amount: 25000, date: 'Yesterday' },
      { name: 'Mary Williams', bank: 'GTBank (Nigeria)', account: '1122334455', amount: 8000, date: 'May 12' },
      { name: 'Ahmed Hassan', bank: 'QNB Al Ahli (Egypt)', account: 'EG0123456789', amount: 35000, date: 'May 11' },
      { name: 'Kwame Nkrumah', bank: 'GCB Bank (Ghana)', account: 'GH0123456789', amount: 12000, date: 'May 10' }
    ];
    
    const recentList = document.getElementById('recentList');
    if (recentList) {
      recentList.innerHTML = recentTransactions.map(transaction => `
        <li>
          <div class="recent-header">
            <div class="recent-name">${transaction.name}</div>
            <div class="recent-amount">₦${transaction.amount.toLocaleString()}</div>
          </div>
          <div class="recent-details">${transaction.bank} • ${transaction.account} • ${transaction.date}</div>
        </li>
      `).join('');
    }
    
    // Load favorite transactions (mock data)
    const favoriteTransactions = [
      { name: 'John Doe', bank: 'First Bank (Nigeria)', account: '5555666677', amount: 20000 },
      { name: 'Sarah Miller', bank: 'UBA (Nigeria)', account: '8888999900', amount: 12000 },
      { name: 'James Wilson', bank: 'Standard Bank (South Africa)', account: 'ZA0123456789', amount: 45000 },
      { name: 'Priya Sharma', bank: 'ICICI Bank (India)', account: 'IN0123456789', amount: 18000 }
    ];
    
    const favoritesList = document.getElementById('favoritesList');
    if (favoritesList) {
      favoritesList.innerHTML = favoriteTransactions.map(transaction => `
        <li>
          <div class="favorites-header">
            <div class="favorites-name">${transaction.name}</div>
            <div class="favorites-amount">₦${transaction.amount.toLocaleString()}</div>
          </div>
          <div class="favorites-details">${transaction.bank} • ${transaction.account}</div>
          <i class="fas fa-star favorite-icon active"></i>
        </li>
      `).join('');
    }
  }

  // Start the application
  init();
});

// Global function for switching transfer types
function switchTransferType(type) {
  const domesticOption = document.getElementById('domesticOption');
  const internationalOption = document.getElementById('internationalOption');
  const domesticForm = document.getElementById('domesticForm');
  const internationalForm = document.getElementById('internationalForm');
  
  if (type === 'domestic') {
    domesticOption.classList.add('active');
    internationalOption.classList.remove('active');
    domesticForm.style.display = 'block';
    internationalForm.style.display = 'none';
  } else {
    domesticOption.classList.remove('active');
    internationalOption.classList.add('active');
    domesticForm.style.display = 'none';
    internationalForm.style.display = 'block';
  }
}

// Global function for switching tabs
function switchTab(tabName) {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.classList.remove('active');
  });
  
  tabContents.forEach(content => {
    content.classList.remove('active');
  });
  
  if (tabName === 'recents') {
    tabButtons[0].classList.add('active');
    document.getElementById('recents').classList.add('active');
  } else {
    tabButtons[1].classList.add('active');
    document.getElementById('favorites').classList.add('active');
  }
}